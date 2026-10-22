import { prisma } from './prisma';
import { WeatherInfo } from './weather';

export interface DeficitReport {
  remainingCalories: number;
  remainingProtein: number;
  remainingCarbs: number;
  remainingFats: number;
  status: 'on_track' | 'deficit' | 'surplus';
  primaryDeficit: 'protein' | 'carbs' | 'fats' | 'calories' | 'balanced';
}

export interface RecommendationResult {
  deficitReport: DeficitReport;
  weather: WeatherInfo;
  suggestions: Array<{
    id: string;
    name: string;
    cuisine: string;
    category: string;
    climateAttribute: string;
    servingSize: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    recipeNotes: string | null;
    score: number;
    matchReason: string;
  }>;
  actionableSummary: string;
}

export async function generateBalancingSuggestions(params: {
  userId: string;
  targets: { calories: number; protein: number; carbs: number; fats: number; waterMl: number };
  consumed: { calories: number; protein: number; carbs: number; fats: number; waterMl: number };
  dietType?: string | null;
  regionCuisine?: string | null;
  weather: WeatherInfo;
}): Promise<RecommendationResult> {
  const { targets, consumed, dietType, regionCuisine, weather } = params;

  const remCalories = Math.round(targets.calories - consumed.calories);
  const remProtein = Math.round(targets.protein - consumed.protein);
  const remCarbs = Math.round(targets.carbs - consumed.carbs);
  const remFats = Math.round(targets.fats - consumed.fats);

  // Determine primary macro gap
  let primaryDeficit: DeficitReport['primaryDeficit'] = 'balanced';
  if (remProtein >= 20) {
    primaryDeficit = 'protein';
  } else if (remCalories >= 400 && remCarbs >= 50) {
    primaryDeficit = 'carbs';
  } else if (remCalories <= 0) {
    primaryDeficit = 'calories';
  }

  const deficitReport: DeficitReport = {
    remainingCalories: remCalories,
    remainingProtein: remProtein,
    remainingCarbs: remCarbs,
    remainingFats: remFats,
    status: remCalories < -150 ? 'surplus' : remCalories > 300 ? 'deficit' : 'on_track',
    primaryDeficit,
  };

  // Build Prisma filter based on dietary restrictions (Strictly safeguard vegetarian choices)
  const effectiveDiet = dietType || 'vegetarian';
  const dietFilter: any = {};
  if (effectiveDiet === 'vegan') {
    dietFilter.dietType = 'vegan';
  } else if (effectiveDiet === 'vegetarian') {
    dietFilter.dietType = { in: ['vegan', 'vegetarian'] };
  } else if (effectiveDiet === 'eggetarian') {
    dietFilter.dietType = { in: ['vegan', 'vegetarian', 'eggetarian'] };
  }

  const allFoods = await prisma.foodItem.findMany({
    where: dietFilter,
  });

  // Score candidate foods
  const scoredFoods = allFoods.map((food) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Protein deficit matching
    if (remProtein > 15 && food.protein >= 12) {
      score += food.protein * 2.5;
      reasons.push(`Provides ${food.protein}g protein`);
    }

    // 2. Calorie headroom matching
    if (remCalories > 0 && food.calories <= remCalories + 50) {
      score += 15;
    } else if (remCalories <= 200 && food.calories > 300) {
      score -= 30; // Don't recommend calorie bomb when near limit
    }

    // 3. Regional Cuisine alignment
    if (regionCuisine && food.cuisine.toLowerCase() === regionCuisine.toLowerCase()) {
      score += 25;
      reasons.push(`Matches your ${food.cuisine} preference`);
    } else if (food.cuisine === 'Universal') {
      score += 10;
    }

    // 4. Climate Alignment
    if (weather.climateCategory === 'cooling' && food.climateAttribute === 'cooling') {
      score += 25;
      reasons.push(`Cooling effect suited for ${weather.temperature}°C weather`);
    } else if (weather.climateCategory === 'warming' && food.climateAttribute === 'warming') {
      score += 25;
      reasons.push(`Warming and digestive support for cool/rainy climate`);
    }

    const matchReason = reasons.length > 0 ? reasons.join(' • ') : 'Balanced nutritional profile';

    return {
      ...food,
      score,
      matchReason,
    };
  });

  // Sort by highest score first
  scoredFoods.sort((a, b) => b.score - a.score);
  const topSuggestions = scoredFoods.slice(0, 4);

  let actionableSummary = '';
  if (remProtein > 20) {
    actionableSummary = `You still need ${remProtein}g more protein today. We recommend focusing on high-density protein options that fit comfortably within your remaining ${Math.max(0, remCalories)} kcal.`;
  } else if (deficitReport.status === 'on_track') {
    actionableSummary = `You have hit your core macro targets nicely today! Opt for light, hydrating options to maintain steady energy.`;
  } else if (deficitReport.status === 'surplus') {
    actionableSummary = `You have met your daily caloric ceiling. Stick to zero-calorie hydration like infused water or herbal tea for the rest of the evening.`;
  } else {
    actionableSummary = `You have ${remCalories} kcal remaining. Here are balanced, climate-optimized meals to wrap up your day.`;
  }

  return {
    deficitReport,
    weather,
    suggestions: topSuggestions,
    actionableSummary,
  };
}
