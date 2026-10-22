'use client';

import React from 'react';
import { Plus, Trash2, Utensils, Sun, Sunset, Coffee, Moon } from 'lucide-react';

interface MealListProps {
  meals: any[];
  onOpenLogger: (mealType: string) => void;
  onDeleteMeal: (mealId: string) => Promise<void>;
}

export const MealList: React.FC<MealListProps> = ({ meals, onOpenLogger, onDeleteMeal }) => {
  const mealSections = [
    { type: 'BREAKFAST', label: 'Breakfast', icon: <Coffee className="w-4 h-4 text-amber-500" /> },
    { type: 'LUNCH', label: 'Lunch', icon: <Sun className="w-4 h-4 text-orange-500" /> },
    { type: 'SNACKS', label: 'Snacks & Tea', icon: <Utensils className="w-4 h-4 text-teal-500" /> },
    { type: 'DINNER', label: 'Dinner', icon: <Moon className="w-4 h-4 text-indigo-500" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Today's Meal Logs</h3>
          <p className="text-xs text-slate-500">Track and review logged items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealSections.map((section) => {
          const sectionMeals = meals.filter((m) => m.mealType === section.type);
          const sectionCalories = sectionMeals.reduce((sum, m) => sum + m.calories, 0);
          const sectionProtein = sectionMeals.reduce((sum, m) => sum + m.protein, 0);

          return (
            <div key={section.type} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {section.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{section.label}</h4>
                      <span className="text-[11px] text-slate-400">
                        {sectionCalories} kcal • {Math.round(sectionProtein * 10) / 10}g protein
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenLogger(section.type)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Items */}
                <div className="mt-3 space-y-2">
                  {sectionMeals.length === 0 ? (
                    <div className="py-4 text-center">
                      <span className="text-xs text-slate-400">No food logged yet</span>
                    </div>
                  ) : (
                    sectionMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{meal.foodName}</p>
                          <span className="text-[11px] text-slate-500">
                            {meal.portionSize > 1 ? `${meal.portionSize}x ` : ''}
                            {meal.calories} kcal • <strong className="text-emerald-700 font-semibold">{meal.protein}g protein</strong>
                          </span>
                        </div>

                        <button
                          onClick={() => onDeleteMeal(meal.id)}
                          title="Remove item"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
