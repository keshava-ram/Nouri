'use client';

import React, { useState } from 'react';
import { Sparkles, Utensils, Check, Plus, ChefHat, Compass, Thermometer } from 'lucide-react';

interface DeficitBalancerProps {
  recommendationData: any;
  onQuickLogFood: (food: any, mealType: string) => Promise<void>;
}

export const DeficitBalancer: React.FC<DeficitBalancerProps> = ({
  recommendationData,
  onQuickLogFood,
}) => {
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string>('DINNER');

  if (!recommendationData) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-64 flex items-center justify-center">
        <span className="text-sm text-slate-400">Analyzing nutritional deficit and climate conditions...</span>
      </div>
    );
  }

  const { deficitReport, weather, suggestions, actionableSummary } = recommendationData;

  const handleLog = async (food: any) => {
    try {
      setLoggingId(food.id);
      await onQuickLogFood(food, selectedMealType);
    } finally {
      setLoggingId(null);
    }
  };

  const getClimateBadge = (climateAttr: string) => {
    if (climateAttr === 'cooling') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
          ❄️ Cooling Food
        </span>
      );
    }
    if (climateAttr === 'warming') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          🔥 Warming Food
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
        ⚖️ Neutral
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Smart Nutritional Deficit Balancer</h2>
          </div>
          <p className="text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            {actionableSummary}
          </p>
        </div>

        {/* Meal Type Selector for 1-click logging */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1 rounded-xl self-start md:self-auto border border-white/10">
          <span className="text-xs text-emerald-200 pl-2 pr-1 font-medium">Log as:</span>
          {['SNACKS', 'LUNCH', 'DINNER'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMealType(type)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedMealType === type
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Deficit Indicators Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
          <span className="text-[11px] text-emerald-200 uppercase tracking-wider block font-medium">Protein Deficit</span>
          <span className="text-2xl font-extrabold mt-1 block">
            {deficitReport.remainingProtein > 0 ? `+${deficitReport.remainingProtein}g` : 'Satisfied ✓'}
          </span>
          <span className="text-[11px] text-emerald-100/60 mt-0.5 block">Needed to hit target</span>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
          <span className="text-[11px] text-emerald-200 uppercase tracking-wider block font-medium">Calorie Space</span>
          <span className="text-2xl font-extrabold mt-1 block">
            {deficitReport.remainingCalories > 0 ? `${deficitReport.remainingCalories} kcal` : 'At limit'}
          </span>
          <span className="text-[11px] text-emerald-100/60 mt-0.5 block">Budget left today</span>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
          <span className="text-[11px] text-emerald-200 uppercase tracking-wider block font-medium">Local Climate</span>
          <span className="text-lg font-bold mt-1 block truncate">
            {weather.temperature}°C ({weather.condition})
          </span>
          <span className="text-[11px] text-emerald-100/60 mt-0.5 block capitalize">{weather.climateCategory} focus</span>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
          <span className="text-[11px] text-emerald-200 uppercase tracking-wider block font-medium">Carb & Fat Room</span>
          <span className="text-lg font-bold mt-1 block">
            {Math.max(0, deficitReport.remainingCarbs)}g C / {Math.max(0, deficitReport.remainingFats)}g F
          </span>
          <span className="text-[11px] text-emerald-100/60 mt-0.5 block">Remaining balance</span>
        </div>
      </div>

      {/* Suggested Recipes / Meals Grid */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
            Recommended Dishes to Balance Today ({suggestions.length} options)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((food: any) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl p-5 text-slate-800 shadow-lg border border-emerald-500/20 flex flex-col justify-between hover:border-emerald-400 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{food.name}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {food.dietType === 'vegetarian' || food.dietType === 'vegan' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          🟢 100% Veg
                        </span>
                      ) : food.dietType === 'eggetarian' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          🟡 Egg
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          🔴 Non-Veg
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {food.cuisine}
                      </span>
                      {getClimateBadge(food.climateAttribute)}
                      <span className="text-[10px] text-slate-500 px-1.5">{food.servingSize}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLog(food)}
                    disabled={loggingId !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    {loggingId === food.id ? (
                      <Check className="w-3.5 h-3.5 animate-bounce" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>{loggingId === food.id ? 'Logged!' : `Log to ${selectedMealType.slice(0, 3)}`}</span>
                  </button>
                </div>

                {/* Macro pill indicators */}
                <div className="grid grid-cols-4 gap-2 mt-4 py-2.5 px-3 bg-slate-50 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Protein</span>
                    <strong className="text-emerald-700 text-sm font-extrabold">{food.protein}g</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Calories</span>
                    <strong className="text-slate-800 text-sm font-extrabold">{food.calories}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Carbs</span>
                    <strong className="text-blue-600 text-sm font-semibold">{food.carbs}g</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Fats</span>
                    <strong className="text-purple-600 text-sm font-semibold">{food.fats}g</strong>
                  </div>
                </div>

                {/* Prep note */}
                {food.recipeNotes && (
                  <div className="mt-3 text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 leading-relaxed">
                    <strong className="text-emerald-900 font-semibold">Prep Suggestion: </strong>
                    {food.recipeNotes}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-slate-100">
                <ChefHat className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">{food.matchReason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
