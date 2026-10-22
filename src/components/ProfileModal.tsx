'use client';

import React, { useState, useEffect } from 'react';
import { X, User, HeartPulse, Compass, Bell, Check, Sparkles, MapPin, Navigation, Trash2, AlertTriangle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  user: any;
  onClose: () => void;
  onUpdateProfile: (updatedData: any) => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onUpdateProfile,
  onDeleteAccount,
}) => {
  const [formData, setFormData] = useState<any>({
    gender: 'male',
    age: 25,
    weightKg: 70,
    heightCm: 172,
    activityLevel: 'moderate',
    goal: 'maintain',
    dietType: 'vegetarian',
    regionCuisine: 'South Indian',
    city: 'Hyderabad',
    latitude: 17.3850,
    longitude: 78.4867,
    waterReminders: true,
    mealReminders: true,
    reminderIntervalHours: 2,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        gender: user.gender || 'male',
        age: user.age || 25,
        weightKg: user.weightKg || 70,
        heightCm: user.heightCm || 172,
        activityLevel: user.activityLevel || 'moderate',
        goal: user.goal || 'maintain',
        dietType: user.dietType || 'vegetarian',
        regionCuisine: user.regionCuisine || 'South Indian',
        city: user.city || 'Hyderabad',
        latitude: user.latitude || 17.3850,
        longitude: user.longitude || 78.4867,
        waterReminders: user.waterReminders !== undefined ? user.waterReminders : true,
        mealReminders: user.mealReminders !== undefined ? user.mealReminders : true,
        reminderIntervalHours: user.reminderIntervalHours || 2,
      });
    }
  }, [user, isOpen]);

  const handleDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setDetectingLocation(true);
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
          setFormData((prev: any) => ({
            ...prev,
            city: detectedCity,
            latitude: lat,
            longitude: lng,
          }));
        } catch (err) {
          console.error('Failed to reverse geocode', err);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Could not access your location. Please check browser permissions.');
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onUpdateProfile(formData);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Health & Climate Profile</h3>
              <p className="text-xs text-slate-500">Auto-tunes nutrition targets and recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* Anthropometrics */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Body & Metabolism
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Biological Sex</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Age (years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="sedentary">Sedentary (desk work)</option>
                  <option value="light">Light (1-2 workouts/wk)</option>
                  <option value="moderate">Moderate (3-5 workouts/wk)</option>
                  <option value="active">Active (6-7 workouts/wk)</option>
                  <option value="very_active">Very Active (athlete)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Fitness Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="lose_fat">Fat Loss (Deficit)</option>
                  <option value="maintain">Maintain Healthy Weight</option>
                  <option value="build_muscle">Build Muscle (Surplus)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Regional & Climate Preferences */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Regional & Climate Settings
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Dietary Restriction</label>
                <select
                  value={formData.dietType}
                  onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non-veg">Omnivore (Non-Veg)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Regional Cuisine</label>
                <select
                  value={formData.regionCuisine}
                  onChange={(e) => setFormData({ ...formData, regionCuisine: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="South Indian">South Indian</option>
                  <option value="North Indian">North Indian</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="East Asian">East Asian</option>
                  <option value="Continental">Continental</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">City / Location (for Real-time Weather)</label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 cursor-pointer transition-colors"
                >
                  <Navigation className={`w-3 h-3 ${detectingLocation ? 'animate-spin text-emerald-600' : 'text-emerald-600'}`} />
                  <span>{detectingLocation ? 'Detecting GPS...' : 'Use My Live GPS'}</span>
                </button>
              </div>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Type any city: Mumbai, London, Bengaluru, New York..."
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Open-Meteo auto-resolves your coordinates and local climate.
              </span>
            </div>
          </div>

          {/* Reminder Preferences */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Smart Alerts
            </span>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.waterReminders}
                onChange={(e) => setFormData({ ...formData, waterReminders: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Send periodic hydration reminders</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.mealReminders}
                onChange={(e) => setFormData({ ...formData, mealReminders: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Send meal schedule notifications</span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Targets Recalculated & Saved!</span>
                </>
              ) : isSaving ? (
                <span>Recalculating Targets...</span>
              ) : (
                <span>Save & Recalculate Nutrition Targets</span>
              )}
            </button>
          </div>
        </form>
        {onDeleteAccount && (
          <div className="pt-4 mt-2 border-t border-rose-100">
            {!confirmDelete ? (
              <button type="button" onClick={() => { setConfirmDelete(true); setDeleteError(''); }} className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" /> Delete account
              </button>
            ) : (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                <p className="text-xs font-bold text-rose-900">Permanently delete your account?</p>
                <p className="text-[11px] text-rose-800 mt-1">Your account, meal history, and water logs will be deleted. This cannot be undone.</p>
                {deleteError && <p className="text-xs text-rose-700 mt-2">{deleteError}</p>}
                <div className="flex gap-2 mt-3">
                  <button type="button" disabled={isDeleting} onClick={() => setConfirmDelete(false)} className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 cursor-pointer">Cancel</button>
                  <button type="button" disabled={isDeleting} onClick={async () => { try { setIsDeleting(true); await onDeleteAccount(); } catch (error) { setDeleteError(error instanceof Error ? error.message : 'Could not delete account'); setIsDeleting(false); } }} className="flex-1 rounded-lg bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60 cursor-pointer">{isDeleting ? 'Deleting…' : 'Yes, delete account'}</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
