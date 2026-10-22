'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Utensils, Sparkles } from 'lucide-react';

interface MealLoggerModalProps {
  isOpen: boolean;
  initialMealType?: string;
  userDietType?: string;
  onClose: () => void;
  onAddMeal: (mealData: any) => Promise<void>;
}

export const MealLoggerModal: React.FC<MealLoggerModalProps> = ({
  isOpen,
  initialMealType = 'BREAKFAST',
  userDietType = 'vegetarian',
  onClose,
  onAddMeal,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [mealType, setMealType] = useState<string>(initialMealType);
  const [dietFilter, setDietFilter] = useState<string>(userDietType || 'vegetarian');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [portion, setPortion] = useState<number>(1.0);

  // Custom form state
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFats, setCustomFats] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMealType(initialMealType);
  }, [initialMealType]);

  useEffect(() => {
    if (userDietType) {
      setDietFilter(userDietType);
    }
  }, [userDietType]);

  // Search effect with strict dietary enforcement
  useEffect(() => {
    if (!isOpen) return;
    const fetchFoods = async () => {
      setIsSearching(true);
      try {
        const queryParams = new URLSearchParams({
          q: searchQuery,
          dietType: dietFilter,
        });
        const res = await fetch(`/api/foods/search?${queryParams.toString()}`);
        const data = await res.json();
        setSearchResults(data.foods || []);
      } catch (err) {
        console.error('Failed to search foods:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeout = setTimeout(fetchFoods, 200);
    return () => clearTimeout(timeout);
  }, [searchQuery, dietFilter, isOpen]);

  if (!isOpen) return null;

  const handleSelectFood = async (food: any) => {
    try {
      setIsSubmitting(true);
      await onAddMeal({
        mealType,
        foodName: food.name,
        portionSize: portion,
        portionUnit: food.servingSize,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        fiber: food.fiber || 0,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCalories || !customProtein) return;

    try {
      setIsSubmitting(true);
      await onAddMeal({
        mealType,
        foodName: customName,
        portionSize: portion,
        portionUnit: 'serving',
        calories: Number(customCalories),
        protein: Number(customProtein),
        carbs: Number(customCarbs || 0),
        fats: Number(customFats || 0),
      });
      setCustomName('');
      setCustomCalories('');
      setCustomProtein('');
      setCustomCarbs('');
      setCustomFats('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Log Food Intake</h3>
            <p className="text-xs text-slate-500">Record your nutrition for {mealType.toLowerCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Type Pills */}
        <div className="flex gap-2 my-4">
          {['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'].map((t) => (
            <button
              key={t}
              onClick={() => setMealType(t)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                mealType === t
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-4">
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-2 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'search'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Search Food Library
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'custom'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Custom Entry
          </button>
        </div>

        {/* Portion Selector */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl mb-3 text-xs">
          <span className="font-medium text-slate-600">Portion Multiplier:</span>
          <div className="flex gap-1.5">
            {[0.5, 1.0, 1.5, 2.0].map((p) => (
              <button
                key={p}
                onClick={() => setPortion(p)}
                className={`px-2 py-0.5 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                  portion === p
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p}x
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Search */}
        {activeTab === 'search' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Dietary Filter chips */}
            <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto text-[11px] pb-1">
              <span className="text-slate-400 font-semibold text-[10px] uppercase">Filter:</span>
              {[
                { id: 'vegetarian', label: '🥗 Pure Veg Only' },
                { id: 'vegan', label: '🌱 100% Vegan' },
                ...(userDietType === 'non-veg' ? [{ id: 'non-veg', label: '🍗 All Foods' }] : []),
                ...(userDietType === 'eggetarian' ? [{ id: 'eggetarian', label: '🥚 Include Eggs' }] : []),
              ].map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  onClick={() => setDietFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap text-xs ${
                    dietFilter === filter.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search food (e.g. Curd, Paneer, Idli, Dal)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {isSearching ? (
                <div className="py-8 text-center text-xs text-slate-400">Searching verified foods...</div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching foods found for your dietary preference. Switch to "Custom Entry" to log anything!
                </div>
              ) : (
                searchResults.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/60 hover:border-emerald-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{food.name}</span>
                        {food.dietType === 'vegetarian' || food.dietType === 'vegan' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Veg
                          </span>
                        ) : food.dietType === 'eggetarian' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Egg
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Non-Veg
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500">
                          {food.cuisine}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {Math.round(food.calories * portion)} kcal •{' '}
                        <strong className="text-emerald-700 font-bold">
                          {Math.round(food.protein * portion * 10) / 10}g protein
                        </strong>{' '}
                        • {Math.round(food.carbs * portion)}g C • {Math.round(food.fats * portion)}g F
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectFood(food)}
                      disabled={isSubmitting}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Entry */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCustomSubmit} className="space-y-3 flex-1 overflow-y-auto">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Food / Meal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Oatmeal with Almonds & Milk"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Calories (kcal) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 320"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-700 block mb-1">Protein (g) *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="e.g. 24"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Carbohydrates (g)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 35"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Fats (g)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 8"
                  value={customFats}
                  onChange={(e) => setCustomFats(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? 'Adding...' : `Log to ${mealType.toLowerCase()}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
