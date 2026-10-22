'use client';

import React from 'react';
import { Flame, Dumbbell, Wheat, Droplets } from 'lucide-react';

interface NutritionalOverviewProps {
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
  };
}

export const NutritionalOverview: React.FC<NutritionalOverviewProps> = ({ targets, consumed }) => {
  const calPercent = Math.min(100, Math.round((consumed.calories / (targets.calories || 2000)) * 100));
  const proteinPercent = Math.min(100, Math.round((consumed.protein / (targets.protein || 120)) * 100));
  const carbsPercent = Math.min(100, Math.round((consumed.carbs / (targets.carbs || 220)) * 100));
  const fatsPercent = Math.min(100, Math.round((consumed.fats / (targets.fats || 65)) * 100));

  const remainingProtein = Math.max(0, Math.round((targets.protein || 120) - consumed.protein));
  const remainingCalories = Math.round((targets.calories || 2000) - consumed.calories);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* 1. Calories Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Calories</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{consumed.calories}</span>
            <span className="text-xs font-medium text-slate-400">/ {targets.calories} kcal</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {remainingCalories >= 0 ? `${remainingCalories} kcal left today` : `${Math.abs(remainingCalories)} kcal over target`}
          </p>
        </div>

        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                remainingCalories < 0 ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${calPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Protein Card (High Emphasis) */}
      <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs ring-1 ring-emerald-500/10 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 pointer-events-none" />
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Protein Target</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-900">{consumed.protein}g</span>
            <span className="text-xs font-medium text-slate-400">/ {targets.protein}g</span>
          </div>
          <p className="text-xs font-medium mt-1">
            {remainingProtein > 0 ? (
              <span className="text-emerald-700">Need {remainingProtein}g more to balance</span>
            ) : (
              <span className="text-emerald-600 font-semibold">Goal achieved! 🎉</span>
            )}
          </p>
        </div>

        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Carbs Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Carbohydrates</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{consumed.carbs}g</span>
            <span className="text-xs font-medium text-slate-400">/ {targets.carbs}g</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {Math.max(0, targets.carbs - consumed.carbs)}g remaining
          </p>
        </div>

        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Fats Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Healthy Fats</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{consumed.fats}g</span>
            <span className="text-xs font-medium text-slate-400">/ {targets.fats}g</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {Math.max(0, targets.fats - consumed.fats)}g remaining
          </p>
        </div>

        <div className="mt-4">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-500"
              style={{ width: `${fatsPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
