import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const cuisine = searchParams.get('cuisine');
    const category = searchParams.get('category');
    const climate = searchParams.get('climate');
    
    // Explicit dietType query param or fallback to user session
    const dietTypeParam = searchParams.get('dietType') || session?.dietType || 'vegetarian';

    const where: any = {};

    // STRICT DIETARY FILTERING: Never show non-veg to vegetarians!
    if (dietTypeParam === 'vegan') {
      where.dietType = 'vegan';
    } else if (dietTypeParam === 'vegetarian') {
      where.dietType = { in: ['vegetarian', 'vegan'] };
    } else if (dietTypeParam === 'eggetarian') {
      where.dietType = { in: ['vegetarian', 'vegan', 'eggetarian'] };
    }
    // If 'non-veg' or 'all', no restriction applied

    if (query) {
      where.name = {
        contains: query,
      };
    }

    if (cuisine && cuisine !== 'All') {
      where.cuisine = cuisine;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (climate && climate !== 'All') {
      where.climateAttribute = climate;
    }

    const foods = await prisma.foodItem.findMany({
      where,
      take: 30,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ foods, appliedDietFilter: dietTypeParam });
  } catch (error: any) {
    console.error('Food search error:', error);
    return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 });
  }
}
