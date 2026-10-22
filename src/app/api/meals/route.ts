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

    const meals = await prisma.mealLog.findMany({
      where: {
        userId: session.id,
        date: date,
      },
      orderBy: { createdAt: 'asc' },
    });

    const totals = meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fats += meal.fats;
        acc.fiber += meal.fiber || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
    );

    return NextResponse.json({
      date,
      meals,
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein * 10) / 10,
        carbs: Math.round(totals.carbs * 10) / 10,
        fats: Math.round(totals.fats * 10) / 10,
        fiber: Math.round(totals.fiber * 10) / 10,
      },
    });
  } catch (error: any) {
    console.error('Fetch meals error:', error);
    return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      date = new Date().toISOString().split('T')[0],
      mealType = 'BREAKFAST',
      foodName,
      portionSize = 1.0,
      portionUnit = 'serving',
      calories,
      protein,
      carbs,
      fats,
      fiber = 0,
    } = body;

    if (!foodName || calories === undefined || protein === undefined) {
      return NextResponse.json({ error: 'Food name, calories, and protein are required' }, { status: 400 });
    }

    const factor = Number(portionSize) || 1.0;

    const newMeal = await prisma.mealLog.create({
      data: {
        userId: session.id,
        date,
        mealType: mealType.toUpperCase(),
        foodName,
        portionSize: factor,
        portionUnit,
        calories: Number(calories) * factor,
        protein: Number(protein) * factor,
        carbs: Number(carbs || 0) * factor,
        fats: Number(fats || 0) * factor,
        fiber: Number(fiber || 0) * factor,
      },
    });

    return NextResponse.json({ success: true, meal: newMeal });
  } catch (error: any) {
    console.error('Add meal error:', error);
    return NextResponse.json({ error: 'Failed to add meal: ' + error?.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Meal ID is required' }, { status: 400 });
    }

    const meal = await prisma.mealLog.findUnique({
      where: { id },
    });

    if (!meal || meal.userId !== session.id) {
      return NextResponse.json({ error: 'Meal not found or unauthorized' }, { status: 404 });
    }

    await prisma.mealLog.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Meal deleted' });
  } catch (error: any) {
    console.error('Delete meal error:', error);
    return NextResponse.json({ error: 'Failed to delete meal' }, { status: 500 });
  }
}
