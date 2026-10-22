import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLocalWeather } from '@/lib/weather';
import { generateBalancingSuggestions } from '@/lib/recommendation-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // 1. Fetch today's meal totals
    const meals = await prisma.mealLog.findMany({
      where: {
        userId: session.id,
        date,
      },
    });

    const consumed = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fats += meal.fats;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0, waterMl: 0 }
    );

    // 2. Fetch today's water intake
    const waterAggregate = await prisma.waterLog.aggregate({
      where: {
        userId: session.id,
        date,
      },
      _sum: { amountMl: true },
    });
    consumed.waterMl = waterAggregate._sum.amountMl || 0;

    // 3. Fetch real-time weather using user's location
    const lat = session.latitude || 17.385;
    const lng = session.longitude || 78.4867;
    const weather = await getLocalWeather(lat, lng);

    // 4. Generate intelligent balancing recommendations
    const recommendations = await generateBalancingSuggestions({
      userId: session.id,
      targets: {
        calories: session.targetCalories,
        protein: session.targetProtein,
        carbs: session.targetCarbs,
        fats: session.targetFats,
        waterMl: session.targetWaterMl,
      },
      consumed,
      dietType: session.dietType,
      regionCuisine: session.regionCuisine,
      weather,
    });

    return NextResponse.json({
      success: true,
      consumed: {
        calories: Math.round(consumed.calories),
        protein: Math.round(consumed.protein * 10) / 10,
        carbs: Math.round(consumed.carbs * 10) / 10,
        fats: Math.round(consumed.fats * 10) / 10,
        waterMl: consumed.waterMl,
      },
      targets: {
        calories: session.targetCalories,
        protein: session.targetProtein,
        carbs: session.targetCarbs,
        fats: session.targetFats,
        waterMl: session.targetWaterMl,
        effectiveWaterTarget: session.targetWaterMl + weather.hydrationBonusMl,
      },
      ...recommendations,
    });
  } catch (error: any) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations: ' + error?.message }, { status: 500 });
  }
}
