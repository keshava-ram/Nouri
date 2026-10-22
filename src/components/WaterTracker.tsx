'use client';

import React, { useState } from 'react';
import { Droplet, Plus, Sparkles, BellRing } from 'lucide-react';
import { triggerWaterReminder } from '@/lib/notifications';

interface WaterTrackerProps {
  currentMl: number;
  baseTargetMl: number;
  bonusMl: number;
  onLogWater: (amountMl: number) => Promise<void>;
  climateAdvice?: string;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  currentMl,
  baseTargetMl,
  bonusMl,
  onLogWater,
  climateAdvice,
}) => {
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [customMl, setCustomMl] = useState<string>('');
  const [showCustom, setShowCustom] = useState(false);

  const effectiveTarget = baseTargetMl + bonusMl;
  const percentage = Math.min(100, Math.round((currentMl / effectiveTarget) * 100));

  const handleQuickAdd = async (amount: number) => {
    try {
      setLoadingAmount(amount);
      await onLogWater(amount);
    } finally {
      setLoadingAmount(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMl, 10);
    if (!isNaN(val) && val > 0) {
      await handleQuickAdd(val);
      setCustomMl('');
      setShowCustom(false);
    }
  };

  const handleTestReminder = () => {
    triggerWaterReminder(currentMl, effectiveTarget, climateAdvice);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600">
              <Droplet className="w-5 h-5 fill-cyan-500 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daily Hydration Station</h3>
              <p className="text-xs text-slate-500">Track and optimize water intake</p>
            </div>
          </div>

          <button
            onClick={handleTestReminder}
            title="Send desktop water reminder prompt"
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors cursor-pointer"
          >
            <BellRing className="w-3 h-3 text-cyan-600" />
            <span>Remind Me</span>
          </button>
        </div>

        {/* Big visual number */}
        <div className="mt-5 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-cyan-900 tracking-tight">{currentMl}</span>
              <span className="text-sm font-semibold text-slate-400">/ {effectiveTarget} ml</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentMl >= effectiveTarget ? (
                <span className="text-emerald-600 font-semibold">Daily hydration target met! 💧</span>
              ) : (
                <span>{effectiveTarget - currentMl} ml remaining to hydrate</span>
              )}
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold text-cyan-600">{percentage}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Climate bonus note */}
        {bonusMl > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span>Target includes <strong>+{bonusMl}ml</strong> for today's temperature/weather.</span>
          </div>
        )}
      </div>

      {/* Quick Add Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          One-Tap Log
        </span>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleQuickAdd(250)}
            disabled={loadingAmount !== null}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mb-0.5 text-cyan-600" />
            <span>250ml</span>
            <span className="text-[10px] text-slate-400 font-normal">Glass</span>
          </button>

          <button
            onClick={() => handleQuickAdd(500)}
            disabled={loadingAmount !== null}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mb-0.5 text-cyan-600" />
            <span>500ml</span>
            <span className="text-[10px] text-slate-400 font-normal">Bottle</span>
          </button>

          <button
            onClick={() => handleQuickAdd(750)}
            disabled={loadingAmount !== null}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mb-0.5 text-cyan-600" />
            <span>750ml</span>
            <span className="text-[10px] text-slate-400 font-normal">Flask</span>
          </button>

          <button
            onClick={() => setShowCustom(!showCustom)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 transition-all cursor-pointer"
          >
            <span className="text-base leading-none mb-0.5">⋯</span>
            <span>Custom</span>
            <span className="text-[10px] text-slate-400 font-normal">Enter</span>
          </button>
        </div>

        {showCustom && (
          <form onSubmit={handleCustomSubmit} className="mt-3 flex gap-2">
            <input
              type="number"
              placeholder="e.g. 350"
              value={customMl}
              onChange={(e) => setCustomMl(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg cursor-pointer"
            >
              Add ml
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
