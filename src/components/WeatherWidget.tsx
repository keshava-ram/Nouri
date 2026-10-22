'use client';

import React from 'react';
import { Sun, CloudRain, Cloud, Thermometer, Droplet, Sparkles, MapPin } from 'lucide-react';
import { WeatherInfo } from '@/lib/weather';

interface WeatherWidgetProps {
  weather: WeatherInfo | null;
  city?: string;
  onEditLocation?: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, city = 'Hyderabad', onEditLocation }) => {
  if (!weather) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse h-32 flex items-center justify-center">
        <span className="text-xs text-slate-400">Loading climate intelligence...</span>
      </div>
    );
  }

  const getTheme = () => {
    if (weather.climateCategory === 'cooling') {
      return {
        bg: 'from-amber-500/10 via-orange-500/5 to-emerald-500/5',
        border: 'border-amber-200',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
        iconColor: 'text-amber-500',
      };
    }
    if (weather.climateCategory === 'warming') {
      return {
        bg: 'from-blue-500/10 via-indigo-500/5 to-teal-500/5',
        border: 'border-blue-200',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
        iconColor: 'text-blue-500',
      };
    }
    return {
      bg: 'from-emerald-500/10 via-teal-500/5 to-slate-500/5',
      border: 'border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconColor: 'text-emerald-500',
    };
  };

  const theme = getTheme();

  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${theme.bg} border ${theme.border} relative overflow-hidden shadow-xs`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
            {weather.isRainy ? (
              <CloudRain className="w-6 h-6 text-blue-500" />
            ) : weather.condition.toLowerCase().includes('cloud') ? (
              <Cloud className="w-6 h-6 text-slate-500" />
            ) : (
              <Sun className={`w-6 h-6 ${theme.iconColor}`} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">{city}</h3>
              {onEditLocation && (
                <button
                  onClick={onEditLocation}
                  className="text-slate-400 hover:text-emerald-700 transition-colors p-0.5 cursor-pointer"
                  title="Change location or use GPS"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              )}
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
                {weather.climateLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-slate-400" /> Feels like {weather.apparentTemperature}°C
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-blue-400" /> {weather.humidity}% Humidity
              </span>
            </div>
          </div>
        </div>

        {weather.hydrationBonusMl > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-xl border border-amber-200/60 text-xs font-medium text-amber-900 self-start sm:self-auto">
            <span className="text-amber-600 font-bold">+{weather.hydrationBonusMl}ml</span>
            <span>Thermal Hydration Buffer Added</span>
          </div>
        )}
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-start gap-2 text-xs text-slate-700">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900">Climate Nutrition Tip:</strong> {weather.advice}
        </p>
      </div>
    </div>
  );
};
