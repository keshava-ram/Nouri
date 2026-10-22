import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, COOKIE_NAME } from '@/lib/auth';
import { calculateNutritionalTargets } from '@/lib/nutrition-calculator';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, gender, age, weightKg, heightCm, activityLevel, goal, dietType, regionCuisine, city } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const numericAge = Number(age);
    const numericWeight = Number(weightKg);
    const numericHeight = Number(heightCm);
    if (!['male', 'female', 'other'].includes(gender) || !Number.isFinite(numericAge) || numericAge < 13 || numericAge > 120 || !Number.isFinite(numericWeight) || numericWeight < 25 || numericWeight > 350 || !Number.isFinite(numericHeight) || numericHeight < 100 || numericHeight > 250) {
      return NextResponse.json({ error: 'Please provide a valid sex, age (13–120), weight (25–350 kg), and height (100–250 cm).' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Compute initial calculated targets
    const targets = calculateNutritionalTargets({
      gender,
      age: numericAge,
      weightKg: numericWeight,
      heightCm: numericHeight,
      activityLevel: activityLevel || 'moderate',
      goal: goal || 'maintain',
    });

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        gender: gender || 'male',
        age: numericAge,
        weightKg: numericWeight,
        heightCm: numericHeight,
        activityLevel: activityLevel || 'moderate',
        goal: goal || 'maintain',
        dietType: dietType || 'vegetarian',
        regionCuisine: regionCuisine || 'South Indian',
        city: city || 'Hyderabad',
        targetCalories: targets.calories,
        targetProtein: targets.protein,
        targetCarbs: targets.carbs,
        targetFats: targets.fats,
        targetWaterMl: targets.waterMl,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        age: user.age,
        weightKg: user.weightKg,
        heightCm: user.heightCm,
        activityLevel: user.activityLevel,
        goal: user.goal,
        dietType: user.dietType,
        regionCuisine: user.regionCuisine,
        city: user.city,
        targetCalories: user.targetCalories,
        targetProtein: user.targetProtein,
        targetCarbs: user.targetCarbs,
        targetFats: user.targetFats,
        targetWaterMl: user.targetWaterMl,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account: ' + (error?.message || '') }, { status: 500 });
  }
}
