'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, User, Dumbbell, Compass, Navigation, Check } from 'lucide-react';
import { calculateNutritionalTargets } from '@/lib/nutrition-calculator';

interface OnboardingModalProps {
  isOpen: boolean;
  user: any;
  onComplete: (updatedData: any) => Promise<void>;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  user,
  onComplete,
}) => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState<number>(24);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('build_muscle');
  const [dietType, setDietType] = useState('vegetarian');
  const [regionCuisine, setRegionCuisine] = useState('South Indian');
  const [city, setCity] = useState('Hyderabad');
  const [detectingGps, setDetectingGps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live calculation of targets
  const calculated = useMemo(() => {
    return calculateNutritionalTargets({
      gender,
      age: Number(age) || 25,
      weightKg: Number(weightKg) || 70,
      heightCm: Number(heightCm) || 172,
      activityLevel,
      goal,
    });
  }, [gender, age, weightKg, heightCm, activityLevel, goal]);

  if (!isOpen) return null;

  const handleDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          const data = await res.json();
          const detectedCity = data.city || data.locality || data.principalSubdivision || 'Detected City';
          setCity(detectedCity);
        } catch (err) {
          console.error(err);
        } finally {
          setDetectingGps(false);
        }
      },
      (err) => {
        console.warn(err);
        setDetectingGps(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onComplete({
        gender,
        age: Number(age),
        weightKg: Number(weightKg),
        heightCm: Number(heightCm),
        activityLevel,
        goal,
        dietType,
        regionCuisine,
        city,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 overflow-hidden">
        {/* Ambient glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center pb-6 border-b border-white/10">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Welcome to Nouri{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
            Let's configure your physical metrics so Nouri can tailor your daily protein,
            macro targets, and climate-aligned meals with precision.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          {/* Section 1: Body Metrics */}
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2.5">
              1. Body & Anthropometrics
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Sex</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Age</label>
                <input
                  type="number"
                  required
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min="30"
                  max="250"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  required
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-2.5 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Activity & Goals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sedentary">Sedentary (Desk Job)</option>
                <option value="light">Lightly Active (1-2 days/wk)</option>
                <option value="moderate">Moderately Active (3-5 days/wk)</option>
                <option value="active">Very Active (6-7 days/wk)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Fitness Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="lose_fat">Fat Loss (Deficit)</option>
                <option value="maintain">Maintain Healthy Weight</option>
                <option value="build_muscle">Build Muscle (Lean Surplus)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Cuisine & Strict Diet */}
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2.5">
              2. Culinary & Regional Palette
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Dietary Restriction</label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800/90 border border-emerald-500/40 text-emerald-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="vegetarian">🥗 100% Pure Vegetarian</option>
                  <option value="vegan">🌱 Vegan (Plant-based)</option>
                  <option value="eggetarian">🥚 Eggetarian (Veg + Eggs)</option>
                  <option value="non-veg">🍗 Omnivore / Non-Veg</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Regional Cuisine</label>
                <select
                  value={regionCuisine}
                  onChange={(e) => setRegionCuisine(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="South Indian">South Indian</option>
                  <option value="North Indian">North Indian</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="East Asian">East Asian</option>
                  <option value="Continental">Continental</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-300">City / Location</label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingGps}
                  className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  <Navigation className={`w-3 h-3 ${detectingGps ? 'animate-spin' : ''}`} />
                  <span>{detectingGps ? 'Detecting...' : 'Detect My GPS'}</span>
                </button>
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad, Mumbai, Bengaluru"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Live Calculated Blueprint Card */}
          <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 text-xs">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              ⚡ Calculated Nutritional Targets:
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Calories</span>
                <strong className="text-white text-sm font-black">{calculated.calories}</strong>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-emerald-500/40">
                <span className="text-[10px] text-emerald-400 block font-bold">Protein</span>
                <strong className="text-emerald-400 text-sm font-black">{calculated.protein}g</strong>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Carbs</span>
                <strong className="text-blue-400 text-sm font-bold">{calculated.carbs}g</strong>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Water</span>
                <strong className="text-cyan-400 text-sm font-bold">{calculated.waterMl}ml</strong>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Saving Blueprint...</span>
            ) : (
              <>
                <span>Save & Enter My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
