'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Droplet,
  Sun,
  CloudRain,
  Dumbbell,
  ArrowRight,
  ShieldCheck,
  Compass,
  Check,
  ChevronRight,
  Heart,
  ChefHat,
  Leaf,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onLaunchDemo: () => Promise<void>;
  isDemoLoading: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onLaunchDemo,
  isDemoLoading,
}) => {
  // Interactive Simulator state
  const [simProteinDeficit, setSimProteinDeficit] = useState<number>(35);
  const [simClimate, setSimClimate] = useState<'hot' | 'cold' | 'pleasant'>('hot');
  const [simDiet, setSimDiet] = useState<'vegetarian' | 'vegan'>('vegetarian');

  // Interactive Simulator dish suggestions
  const getSimulatedDishes = () => {
    if (simDiet === 'vegan') {
      if (simClimate === 'hot') {
        return [
          {
            name: 'Sprouted Moong Sundal with Lemon & Coconut',
            protein: 16,
            calories: 175,
            climate: '❄️ Cooling',
            desc: 'High-protein sprouted green gram lightly tossed with mustard, curry leaves, and cooling fresh coconut.',
          },
          {
            name: 'Boiled Chickpea & Cucumber Chaat',
            protein: 13,
            calories: 190,
            climate: '❄️ Cooling',
            desc: 'Fiber-rich kabuli chana tossed with crisp cucumbers, tomatoes, and lemon dressing.',
          },
        ];
      } else {
        return [
          {
            name: 'Mediterranean Lentil & Vegetable Soup',
            protein: 15,
            calories: 220,
            climate: '🔥 Warming',
            desc: 'Hearty brown lentils slow-cooked with cumin, garlic, and root vegetables for rainy or cold days.',
          },
          {
            name: 'Besan Chilla with Spinach & Ajwain',
            protein: 14,
            calories: 215,
            climate: '🔥 Warming',
            desc: 'Savory roasted chickpea flour crepes infused with warming carom seeds and wilted spinach.',
          },
        ];
      }
    } else {
      // Vegetarian
      if (simClimate === 'hot') {
        return [
          {
            name: 'Spiced Buttermilk (Chaas) + Greek Yogurt Pachadi',
            protein: 18,
            calories: 160,
            climate: '❄️ Cooling',
            desc: 'Electrolyte-restoring churned curd with ginger & mint, paired with high-casein Greek yogurt dip.',
          },
          {
            name: 'Sprouted Moong Sundal & Fresh Curd',
            protein: 21,
            calories: 235,
            climate: '❄️ Cooling',
            desc: 'Protein-dense steamed sprouts paired with gut-soothing probiotic curd.',
          },
        ];
      } else {
        return [
          {
            name: 'Paneer Bhurji with Turmeric & Bajra Roti',
            protein: 26,
            calories: 340,
            climate: '🔥 Warming',
            desc: 'Warm crumbled cottage cheese sautéed with garlic and cumin, served with warming pearl millet roti.',
          },
          {
            name: 'Yellow Moong Dal Tadka with Steamed Spinach',
            protein: 15,
            calories: 195,
            climate: '🔥 Warming',
            desc: 'Easily digestible comforting lentils tempered with ghee, hing, and ginger.',
          },
        ];
      }
    }
  };

  const simDishes = getSimulatedDishes();

  return (
    <div className="relative min-h-screen bg-transparent text-slate-900 overflow-hidden">

      {/* Floating Navbar */}
      <header className="sticky top-4 z-40 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-panel rounded-2xl px-5 py-3 flex items-center justify-between shadow-xs border border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <span className="font-extrabold text-lg">N</span>
            </div>
            <div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
                Nouri
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                Climate Balanced
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#simulator" className="hover:text-emerald-700 transition-colors">
              Deficit Simulator
            </a>
            <a href="#features" className="hover:text-emerald-700 transition-colors">
              Core Pillars
            </a>
            <a href="#comparison" className="hover:text-emerald-700 transition-colors">
              Why Nouri
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onLaunchDemo}
              disabled={isDemoLoading}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isDemoLoading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Demo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        {/* Floating pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-xs mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Intelligent Nutrition & Hydration Companion</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Stop Logging What Went Wrong.{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent block sm:inline">
            Balance What's Missing.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-slate-600 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Nouri detects today's nutritional gaps (e.g., <strong className="text-slate-900">40g protein short</strong>)
          and recommends seasonal, regional dishes aligned with your local weather.
          Strict pure-vegetarian filtering, zero guesswork.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onLaunchDemo}
            disabled={isDemoLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isDemoLoading ? 'Launching Live Dashboard...' : 'Try 1-Click Interactive Demo'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            Create Personal Profile
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Strict Pure Veg Filtering
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" /> Live Climate Thermal Buffers
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-cyan-600" /> One-Tap Hydration Reminders
          </span>
        </div>
      </section>

      {/* LIVE INTERACTIVE SIMULATOR (The Game Changer) */}
      <section id="simulator" className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl border border-white/80 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <ChefHat className="w-5 h-5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Interactive Deficit Simulator
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Experience how Nouri dynamically bridges your remaining macros based on weather and diet.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Diet:</span>
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                <button
                  onClick={() => setSimDiet('vegetarian')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    simDiet === 'vegetarian' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🥗 Pure Veg
                </button>
                <button
                  onClick={() => setSimDiet('vegan')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    simDiet === 'vegan' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌱 Vegan
                </button>
              </div>
            </div>
          </div>

          {/* Controls: Deficit Slider + Climate Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 pt-2">
            {/* Slider Control */}
            <div className="bg-white/80 p-5 rounded-2xl border border-slate-200/60 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Remaining Protein Deficit
                </span>
                <span className="text-base font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {simProteinDeficit}g Needed
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="50"
                step="5"
                value={simProteinDeficit}
                onChange={(e) => setSimProteinDeficit(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>15g (Light gap)</span>
                <span>35g (Standard)</span>
                <span>50g (Heavy workout)</span>
              </div>
            </div>

            {/* Weather Toggle */}
            <div className="bg-white/80 p-5 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                Simulate Local Weather & Temperature
              </span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => setSimClimate('hot')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    simClimate === 'hot'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <div className="text-left">
                    <div>32°C Hot & Sunny</div>
                    <span className="text-[10px] text-amber-700 font-normal">Cooling foods focus</span>
                  </div>
                </button>

                <button
                  onClick={() => setSimClimate('cold')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    simClimate === 'cold'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  <div className="text-left">
                    <div>16°C Chilly / Rain</div>
                    <span className="text-[10px] text-blue-700 font-normal">Warming foods focus</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Suggestions Output Card */}
          <div className="mt-4 pt-4 border-t border-slate-200/70">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Generated Recommendations to Bridge {simProteinDeficit}g Protein:
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                100% {simDiet === 'vegan' ? 'Vegan' : 'Vegetarian'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simDishes.map((dish, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{dish.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap">
                        {dish.climate}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{dish.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700">+{dish.protein}g Protein</span>
                    <span className="text-slate-400 font-medium">{dish.calories} kcal</span>
                    <button
                      onClick={onLaunchDemo}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Log this</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: 4 Core Pillars */}
      <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Engineered For Everyday Life
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
            Why Standard Diet Apps Fail You
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Most trackers act as passive ledgers. Nouri is an active recommendation engine that works around your body, climate, and kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Adaptive Climate Engine</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              When temperatures soar past 30°C, your digestion slows down and dehydration accelerates.
              Nouri automatically injects a <strong className="text-slate-900">+300ml to +600ml thermal hydration buffer</strong>{' '}
              and suggests cooling foods like spiced buttermilk (chaas), curd, and sprouted moong.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Precision Deficit Balancer</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Never wonder <em>"What should I cook for dinner to hit my protein?"</em> again.
              Nouri calculates your remaining macro gap at 6:00 PM and offers actionable, high-protein recipes
              that cleanly bridge your goals without spilling over your calorie budget.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5">
              <Droplet className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Fluid Hydration Station</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Track water in seconds with one-tap increments (+250ml cup, +500ml bottle).
              Includes native Web Notifications to send friendly desktop prompts so you never forget to drink during long work hours.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Authentic Regional Palettes</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              No generic kale smoothies or unattainable western ingredients. Nouri embraces the authentic science of
              <strong> South Indian</strong>, <strong>North Indian</strong>, and <strong>Mediterranean</strong> staples:
              millets, lentils, paneer, sprouts, and curd pachadis.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">The Nouri Difference</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              See why active recommendation solves what passive logging broke.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <span className="text-rose-400 font-bold uppercase text-[11px] block mb-3">
                ❌ Traditional Calorie Counters
              </span>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Only tells you what you ate, leaving you stranded on how to fix deficits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Pollutes vegetarian search results with non-veg and chicken items.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span>
                  <span>Ignores weather completely—giving identical water targets in 42°C heat and winter.</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-400/30">
              <span className="text-emerald-400 font-bold uppercase text-[11px] block mb-3">
                ✨ Nouri Smart Companion
              </span>
              <ul className="space-y-3 text-emerald-100">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Active Balancer:</strong> Tells you exactly what to cook to hit remaining macros.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Strict Diet Enforcement:</strong> Zero non-veg items ever shown to vegetarians.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Climate Sync:</strong> Real-time temperature integration and cooling/warming food focus.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={onLaunchDemo}
              disabled={isDemoLoading}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Dashboard Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-2 font-extrabold text-slate-800 text-sm">
          <span>Nouri</span>
          <span>•</span>
          <span className="font-normal text-slate-500">Intelligent Climate-Aware Nutrition</span>
        </div>
        <p>Built with Next.js, Prisma, and Open-Meteo. Tailored for personal wellness and regional cooking.</p>
      </footer>
    </div>
  );
};
