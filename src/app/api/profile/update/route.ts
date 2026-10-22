import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateNutritionalTargets } from '@/lib/nutrition-calculator';
import { geocodeCity, reverseGeocode } from '@/lib/weather';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      gender,
      age,
      weightKg,
      heightCm,
      activityLevel,
      goal,
      dietType,
      regionCuisine,
      city,
      latitude,
      longitude,
      waterReminders,
      mealReminders,
      reminderIntervalHours,
      customTargets, // optional manual override
    } = body;

    // Resolve location coordinates
    let resolvedLat = latitude !== undefined ? Number(latitude) : session.latitude;
    let resolvedLng = longitude !== undefined ? Number(longitude) : session.longitude;
    let resolvedCity = city ?? session.city;

    if (latitude !== undefined && longitude !== undefined && !city) {
      // Reverse geocode GPS to city name
      resolvedCity = await reverseGeocode(Number(latitude), Number(longitude));
    } else if (city && city !== session.city && (latitude === undefined || longitude === undefined)) {
      // Geocode city string to lat/lng
      const geo = await geocodeCity(city);
      if (geo) {
        resolvedLat = geo.latitude;
        resolvedLng = geo.longitude;
        resolvedCity = geo.name;
      }
    }

    let targets = {
      calories: session.targetCalories,
      protein: session.targetProtein,
      carbs: session.targetCarbs,
      fats: session.targetFats,
      waterMl: session.targetWaterMl,
    };

    if (customTargets) {
      targets = {
        calories: Number(customTargets.calories) || targets.calories,
        protein: Number(customTargets.protein) || targets.protein,
        carbs: Number(customTargets.carbs) || targets.carbs,
        fats: Number(customTargets.fats) || targets.fats,
        waterMl: Number(customTargets.waterMl) || targets.waterMl,
      };
    } else if (weightKg || heightCm || age || activityLevel || goal) {
      const calculated = calculateNutritionalTargets({
        gender: gender ?? session.gender,
        age: age ? Number(age) : session.age,
        weightKg: weightKg ? Number(weightKg) : session.weightKg,
        heightCm: heightCm ? Number(heightCm) : session.heightCm,
        activityLevel: activityLevel ?? session.activityLevel,
        goal: goal ?? session.goal,
      });
      targets = calculated;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        gender: gender ?? session.gender,
        age: age ? Number(age) : session.age,
        weightKg: weightKg ? Number(weightKg) : session.weightKg,
        heightCm: heightCm ? Number(heightCm) : session.heightCm,
        activityLevel: activityLevel ?? session.activityLevel,
        goal: goal ?? session.goal,
        dietType: dietType ?? session.dietType,
        regionCuisine: regionCuisine ?? session.regionCuisine,
        city: resolvedCity,
        latitude: resolvedLat,
        longitude: resolvedLng,
        targetCalories: targets.calories,
        targetProtein: targets.protein,
        targetCarbs: targets.carbs,
        targetFats: targets.fats,
        targetWaterMl: targets.waterMl,
        waterReminders: waterReminders !== undefined ? waterReminders : session.waterReminders,
        mealReminders: mealReminders !== undefined ? mealReminders : session.mealReminders,
        reminderIntervalHours: reminderIntervalHours ? Number(reminderIntervalHours) : session.reminderIntervalHours,
      },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        age: true,
        weightKg: true,
        heightCm: true,
        activityLevel: true,
        goal: true,
        dietType: true,
        regionCuisine: true,
        city: true,
        latitude: true,
        longitude: true,
        targetCalories: true,
        targetProtein: true,
        targetCarbs: true,
        targetFats: true,
        targetWaterMl: true,
        waterReminders: true,
        mealReminders: true,
        reminderIntervalHours: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile: ' + error?.message }, { status: 500 });
  }
}
