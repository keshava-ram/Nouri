import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const endDate = searchParams.get('end') || new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate) || Number.isNaN(Date.parse(`${endDate}T00:00:00Z`))) {
      return NextResponse.json({ error: 'A valid end date is required' }, { status: 400 });
    }

    const end = new Date(`${endDate}T00:00:00Z`);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 6);
    const startDate = start.toISOString().slice(0, 10);

    const [meals, waterLogs] = await Promise.all([
      prisma.mealLog.findMany({
        where: { userId: session.id, date: { gte: startDate, lte: endDate } },
        select: { date: true, calories: true, protein: true },
      }),
      prisma.waterLog.findMany({
        where: { userId: session.id, date: { gte: startDate, lte: endDate } },
        select: { date: true, amountMl: true },
      }),
    ]);

    const daily = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + index);
      const key = date.toISOString().slice(0, 10);
      const dayMeals = meals.filter((meal) => meal.date === key);
      const dayWater = waterLogs.filter((log) => log.date === key);
      return {
        date: key,
        calories: Math.round(dayMeals.reduce((sum, meal) => sum + meal.calories, 0)),
        protein: Math.round(dayMeals.reduce((sum, meal) => sum + meal.protein, 0) * 10) / 10,
        waterMl: dayWater.reduce((sum, log) => sum + log.amountMl, 0),
      };
    });

    return NextResponse.json({ startDate, endDate, daily });
  } catch (error) {
    console.error('Fetch weekly trends error:', error);
    return NextResponse.json({ error: 'Failed to fetch weekly trends' }, { status: 500 });
  }
}
