'use client';

import React from 'react';
import { Droplets, Flame, User as UserIcon, Bell, LogOut, Sun, CloudRain, Cloud } from 'lucide-react';
import { requestNotificationPermission } from '@/lib/notifications';

interface NavbarProps {
  user: any | null;
  weather?: any;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  weather,
  onOpenProfile,
  onOpenAuth,
  onLogout,
}) => {
  const [notifState, setNotifState] = React.useState<NotificationPermission | 'unsupported'>('default');

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifState(Notification.permission);
    } else {
      setNotifState('unsupported');
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifState(granted ? 'granted' : 'denied');
  };

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="w-4 h-4 text-amber-500" />;
    if (weather.isRainy) return <CloudRain className="w-4 h-4 text-blue-500" />;
    if (weather.condition.toLowerCase().includes('cloud')) return <Cloud className="w-4 h-4 text-slate-500" />;
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <span className="font-bold text-xl tracking-tight">N</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Nouri
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Climate Balanced
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Intelligent Nutrition & Hydration Companion</p>
          </div>
        </div>

        {/* Center / Weather snippet */}
        {weather && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200 text-xs font-medium text-slate-700">
            {getWeatherIcon()}
            <span>{weather.temperature}°C</span>
            <span className="text-slate-400">•</span>
            <span>{user?.city || 'Local'} ({weather.condition})</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-600 capitalize">{weather.climateCategory} Food Focus</span>
          </div>
        )}

        {/* Right action controls */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          {notifState !== 'granted' && notifState !== 'unsupported' && (
            <button
              onClick={handleEnableNotifications}
              title="Enable Hydration & Meal Reminders"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 animate-pulse text-teal-600" />
              <span className="hidden sm:inline">Enable Reminders</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
              </button>

              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
