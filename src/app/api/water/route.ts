import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const logs = await prisma.waterLog.findMany({
      where: {
        userId: session.id,
        date: date,
      },
      orderBy: { loggedAt: 'desc' },
    });

    const totalMl = logs.reduce((sum, item) => sum + item.amountMl, 0);

    return NextResponse.json({
      date,
      totalMl,
      targetMl: session.targetWaterMl,
      logs,
    });
  } catch (error: any) {
    console.error('Fetch water error:', error);
    return NextResponse.json({ error: 'Failed to fetch water logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amountMl, date = new Date().toISOString().split('T')[0] } = body;

    if (!amountMl || Number(amountMl) <= 0) {
      return NextResponse.json({ error: 'Valid water amount (ml) is required' }, { status: 400 });
    }

    const log = await prisma.waterLog.create({
      data: {
        userId: session.id,
        date,
        amountMl: Number(amountMl),
      },
    });

    const total = await prisma.waterLog.aggregate({
      where: {
        userId: session.id,
        date,
      },
      _sum: { amountMl: true },
    });

    return NextResponse.json({
      success: true,
      log,
      totalMl: total._sum.amountMl || 0,
      targetMl: session.targetWaterMl,
    });
  } catch (error: any) {
    console.error('Add water error:', error);
    return NextResponse.json({ error: 'Failed to log water intake' }, { status: 500 });
  }
}
