'use client';

import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onAuthSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [regionCuisine, setRegionCuisine] = useState('South Indian');
  const [dietType, setDietType] = useState('vegetarian');
  const [city, setCity] = useState('Hyderabad');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login'
        ? { email, password }
        : { name, email, password, gender, age: Number(age), weightKg: Number(weightKg), heightCm: Number(heightCm), activityLevel, goal, regionCuisine, dietType, city };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Register or login demo account
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
        // If demo already exists, log in
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'demo@nouri.app', password: 'Password123!' }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          onAuthSuccess(loginData.user);
          onClose();
          return;
        }
      } else {
        const data = await res.json();
        onAuthSuccess(data.user);
        onClose();
        return;
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              N
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {tab === 'login' ? 'Sign In to Nouri' : 'Create Your Nouri Account'}
              </h3>
              <p className="text-xs text-slate-500">Personalized climate & nutrition tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 my-4">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              tab === 'login' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              tab === 'register' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aditi Sharma"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {tab === 'register' && (
            <>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 space-y-3">
              <p className="text-xs font-bold text-emerald-900">Your health profile <span className="font-normal text-emerald-700">— used to personalize your daily targets</span></p>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-semibold text-slate-700">Sex
                  <select required value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="" disabled>Select</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-700">Age (years)
                  <input required type="number" min="13" max="120" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 28" className="mt-1 w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </label>
                <label className="text-xs font-semibold text-slate-700">Weight (kg)
                  <input required type="number" min="25" max="350" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g. 65" className="mt-1 w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </label>
                <label className="text-xs font-semibold text-slate-700">Height (cm)
                  <input required type="number" min="100" max="250" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g. 170" className="mt-1 w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-semibold text-slate-700">Activity level
                  <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="mt-1 w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="sedentary">Sedentary</option><option value="light">Light (1–2 workouts/wk)</option><option value="moderate">Moderate (3–5 workouts/wk)</option><option value="active">Active (6–7 workouts/wk)</option><option value="very_active">Very active</option></select>
                </label>
                <label className="text-xs font-semibold text-slate-700">Goal
                  <select value={goal} onChange={(e) => setGoal(e.target.value)} className="mt-1 w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="lose_fat">Lose fat</option><option value="maintain">Maintain</option><option value="build_muscle">Build muscle</option></select>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Regional Cuisine</label>
                <select
                  value={regionCuisine}
                  onChange={(e) => setRegionCuisine(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="South Indian">South Indian</option>
                  <option value="North Indian">North Indian</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="East Asian">East Asian</option>
                  <option value="Continental">Continental</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Diet Type</label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>
            </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer mt-2"
          >
            {loading ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Complete Setup & Sign In'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Testing Nouri?</span>
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>1-Click Demo Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
