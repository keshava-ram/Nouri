export interface ProfileInput {
  gender?: string | null;
  age?: number | null;
  weightKg?: number | null;
  heightCm?: number | null;
  activityLevel?: string | null; // "sedentary" | "light" | "moderate" | "active" | "very_active"
  goal?: string | null; // "lose_fat" | "maintain" | "build_muscle"
}

export interface CalculatedTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterMl: number;
}

export function calculateNutritionalTargets(profile: ProfileInput): CalculatedTargets {
  const weight = profile.weightKg || 68;
  const height = profile.heightCm || 172;
  const age = profile.age || 25;
  const gender = profile.gender || 'other';
  const activity = profile.activityLevel || 'moderate';
  const goal = profile.goal || 'maintain';

  // 1. Calculate Basal Metabolic Rate (BMR) - Mifflin-St Jeor formula
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr -= 78;
  }

  // 2. Activity Multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const multiplier = activityMultipliers[activity] || 1.45;
  let tdee = Math.round(bmr * multiplier);

  // 3. Goal Adjustment
  if (goal === 'lose_fat') {
    tdee = Math.max(1300, tdee - 450); // Safe deficit
  } else if (goal === 'build_muscle') {
    tdee += 350; // Lean surplus
  }

  // 4. Macro Distribution
  // Protein: ~1.8g - 2.2g per kg of bodyweight depending on goal
  let proteinPerKg = 1.8;
  if (goal === 'build_muscle' || goal === 'lose_fat') {
    proteinPerKg = 2.0;
  }
  const proteinGrams = Math.round(weight * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  // Fats: ~25% of total calories
  const fatCalories = tdee * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs: Remaining calories
  const remainingCalories = Math.max(0, tdee - proteinCalories - fatCalories);
  const carbGrams = Math.round(remainingCalories / 4);

  // 5. Water: ~35ml per kg bodyweight (standard baseline)
  const baselineWaterMl = Math.round(weight * 35);
  const roundedWater = Math.max(2000, Math.min(4500, Math.round(baselineWaterMl / 100) * 100));

  return {
    calories: tdee,
    protein: proteinGrams,
    carbs: carbGrams,
    fats: fatGrams,
    waterMl: roundedWater,
  };
}
