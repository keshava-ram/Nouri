'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { WeatherWidget } from '@/components/WeatherWidget';
import { NutritionalOverview } from '@/components/NutritionalOverview';
import { WeeklyTrends } from '@/components/WeeklyTrends';
import { WaterTracker } from '@/components/WaterTracker';
import { DeficitBalancer } from '@/components/DeficitBalancer';
import { MealList } from '@/components/MealList';
import { MealLoggerModal } from '@/components/MealLoggerModal';
import { ProfileModal } from '@/components/ProfileModal';
import { AuthModal } from '@/components/AuthModal';
import { LandingPage } from '@/components/LandingPage';
import { triggerMealReminder, triggerWaterReminder } from '@/lib/notifications';
import { Calendar, RefreshCw } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Data states
  const [meals, setMeals] = useState<any[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  const [waterMl, setWaterMl] = useState<number>(0);
  const [recommendationData, setRecommendationData] = useState<any | null>(null);
  const [weeklyTrends, setWeeklyTrends] = useState<any[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsError, setTrendsError] = useState('');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [activeLoggerMealType, setActiveLoggerMealType] = useState<string>('BREAKFAST');

  // Load current session user
  const checkUserSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Session check failed', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all daily data
  const refreshDailyData = useCallback(async (date: string) => {
    if (!date) return;
    try {
      setTrendsLoading(true);
      const [mealsRes, waterRes, recRes, trendsRes] = await Promise.all([
        fetch(`/api/meals?date=${date}`),
        fetch(`/api/water?date=${date}`),
        fetch(`/api/recommendations?date=${date}`),
        fetch(`/api/trends?end=${date}`),
      ]);

      if (mealsRes.ok) {
        const mealData = await mealsRes.json();
        setMeals(mealData.meals || []);
        setTotals(mealData.totals || { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
      }

      if (waterRes.ok) {
        const waterData = await waterRes.json();
        setWaterMl(waterData.totalMl || 0);
      }

      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendationData(recData);
      }

      if (trendsRes.ok) {
        const trendsData = await trendsRes.json();
        setWeeklyTrends(trendsData.daily || []);
        setTrendsError('');
      } else {
        setTrendsError('Weekly trends could not be loaded.');
      }
    } catch (err) {
      console.error('Failed to load daily data:', err);
      setTrendsError('Weekly trends could not be loaded.');
    } finally {
      setTrendsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  useEffect(() => {
    if (user && selectedDate) {
      refreshDailyData(selectedDate);
    }
  }, [user, selectedDate, refreshDailyData]);

  // Periodic Reminder Loop (Water & Meal checks)
  useEffect(() => {
    if (!user) return;

    // Check hourly for hydration or meal times
    const checkSchedule = () => {
      const currentHour = new Date().getHours();
      
      // Meal checks
      if (user.mealReminders) {
        if (currentHour === 8 || currentHour === 9) {
          triggerMealReminder('Breakfast');
        } else if (currentHour === 13) {
          triggerMealReminder('Lunch');
        } else if (currentHour === 20) {
          triggerMealReminder('Dinner');
        }
      }
    };

    const interval = setInterval(checkSchedule, 1000 * 60 * 60); // hourly check
    return () => clearInterval(interval);
  }, [user]);

  // Actions
  const handleLogWater = async (amount: number) => {
    try {
      const res = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountMl: amount, date: selectedDate }),
      });
      if (res.ok) {
        const data = await res.json();
        setWaterMl(data.totalMl);
        // Refresh recommendations to update hydration status
        refreshDailyData(selectedDate);
      }
    } catch (e) {
      console.error('Failed to log water', e);
    }
  };

  const handleAddMeal = async (mealData: any) => {
    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mealData, date: selectedDate }),
      });
      if (res.ok) {
        await refreshDailyData(selectedDate);
      }
    } catch (e) {
      console.error('Failed to add meal', e);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      const res = await fetch(`/api/meals?id=${mealId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshDailyData(selectedDate);
      }
    } catch (e) {
      console.error('Failed to delete meal', e);
    }
  };

  const handleQuickLogRecommendedFood = async (food: any, mealType: string) => {
    await handleAddMeal({
      mealType,
      foodName: food.name,
      portionSize: 1.0,
      portionUnit: food.servingSize,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      fiber: food.fiber || 0,
    });
  };

  const handleUpdateProfile = async (formData: any) => {
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      await refreshDailyData(selectedDate);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setMeals([]);
    setTotals({ calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
    setWaterMl(0);
    setRecommendationData(null);
    setWeeklyTrends([]);
  };

  const handleDeleteAccount = async () => {
    const res = await fetch('/api/profile/delete', { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Could not delete account');
    }
    setIsProfileOpen(false);
    setUser(null);
    setMeals([]);
    setTotals({ calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
    setWaterMl(0);
    setRecommendationData(null);
    setWeeklyTrends([]);
  };

  // If loading session
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">Starting Nouri...</span>
        </div>
      </div>
    );
  }

  const handleLaunchDemo = async () => {
    try {
      setIsDemoLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Nouri Explorer',
          email: 'demo@nouri.app',
          password: 'Password123!',
          regionCuisine: 'South Indian',
          dietType: 'vegetarian',
          city: 'Hyderabad',
          gender: 'other', age: 30, weightKg: 70, heightCm: 172,
        }),
      });

      if (!res.ok) {
        // If already created, log in
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'demo@nouri.app', password: 'Password123!' }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          setUser(loginData.user);
        }
      } else {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Demo launch error:', err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  // If not logged in, render the modern fluid landing page
  if (!user) {
    return (
      <>
        <LandingPage
          onOpenAuth={(tab) => {
            setAuthModalTab(tab || 'login');
            setIsAuthOpen(true);
          }}
          onLaunchDemo={handleLaunchDemo}
          isDemoLoading={isDemoLoading}
        />
        <AuthModal
          isOpen={isAuthOpen}
          initialTab={authModalTab}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(loggedUser) => setUser(loggedUser)}
        />
      </>
    );
  }

  // Logged-in Main Dashboard
  return (
    <div className="relative min-h-screen bg-transparent text-slate-900 flex flex-col overflow-hidden">
      <Navbar
        user={user}
        weather={recommendationData?.weather}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => {}}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Control Bar: Date Selector & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Hello, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeting: {user.regionCuisine} cuisine • {user.dietType} • {user.goal?.replace('_', ' ')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => refreshDailyData(selectedDate)}
              title="Refresh today's data"
              className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Climate Widget */}
        <WeatherWidget
          weather={recommendationData?.weather || null}
          city={user.city || 'Hyderabad'}
          onEditLocation={() => setIsProfileOpen(true)}
        />

        {/* Nutritional Overview Cards */}
        <NutritionalOverview
          targets={{
            calories: user.targetCalories,
            protein: user.targetProtein,
            carbs: user.targetCarbs,
            fats: user.targetFats,
          }}
          consumed={totals}
        />

        <WeeklyTrends
          daily={weeklyTrends}
          targets={{ calories: user.targetCalories, protein: user.targetProtein, waterMl: user.targetWaterMl }}
          isLoading={trendsLoading}
          error={trendsError}
        />

        {/* Centerpiece: Smart Deficit Balancer */}
        <DeficitBalancer
          recommendationData={recommendationData}
          onQuickLogFood={handleQuickLogRecommendedFood}
        />

        {/* Dual Section: Water Tracker + Meal Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <WaterTracker
              currentMl={waterMl}
              baseTargetMl={user.targetWaterMl}
              bonusMl={recommendationData?.weather?.hydrationBonusMl || 0}
              onLogWater={handleLogWater}
              climateAdvice={recommendationData?.weather?.advice}
            />
          </div>

          <div className="lg:col-span-2">
            <MealList
              meals={meals}
              onOpenLogger={(mealType) => {
                setActiveLoggerMealType(mealType);
                setIsLoggerOpen(true);
              }}
              onDeleteMeal={handleDeleteMeal}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <MealLoggerModal
        isOpen={isLoggerOpen}
        initialMealType={activeLoggerMealType}
        userDietType={user?.dietType || 'vegetarian'}
        onClose={() => setIsLoggerOpen(false)}
        onAddMeal={handleAddMeal}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        user={user}
        onClose={() => setIsProfileOpen(false)}
        onUpdateProfile={handleUpdateProfile}
        onDeleteAccount={handleDeleteAccount}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(loggedUser) => setUser(loggedUser)}
      />
    </div>
  );
}
