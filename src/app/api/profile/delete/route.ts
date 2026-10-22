import { NextResponse } from 'next/server';
import { getSessionUser, COOKIE_NAME } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Custom foods do not use a cascading relation, so remove them explicitly.
    await prisma.customFood.deleteMany({ where: { userId: session.id } });

    // Meal and water logs cascade when the user is deleted.
    await prisma.user.delete({
      where: { id: session.id },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account and all associated nutritional data have been permanently deleted',
    });

    // Clear session cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: '',
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete account: ' + error?.message }, { status: 500 });
  }
}
