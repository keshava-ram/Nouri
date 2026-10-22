'use client';

import React from 'react';
import { Activity, Droplets, Flame, TrendingUp } from 'lucide-react';

type Day = { date: string; calories: number; protein: number; waterMl: number };

interface WeeklyTrendsProps {
  daily: Day[];
  targets: { calories: number; protein: number; waterMl: number };
  isLoading: boolean;
  error?: string;
}

const chart = { left: 44, right: 664, top: 18, bottom: 170 };
const yFor = (percent: number) => chart.bottom - (Math.min(150, percent) / 150) * (chart.bottom - chart.top);

export const WeeklyTrends: React.FC<WeeklyTrendsProps> = ({ daily, targets, isLoading, error }) => {
  const xFor = (index: number) => chart.left + (index * (chart.right - chart.left)) / 6;
  const series = [
    { key: 'calories', label: 'Calories', color: '#f59e0b', target: targets.calories, icon: Flame },
    { key: 'protein', label: 'Protein', color: '#059669', target: targets.protein, icon: Activity },
    { key: 'waterMl', label: 'Water', color: '#0891b2', target: targets.waterMl, icon: Droplets },
  ] as const;
  const valueOf = (day: Day, key: typeof series[number]['key']) => day[key];
  const averages = {
    calories: daily.length ? Math.round(daily.reduce((sum, day) => sum + day.calories, 0) / 7) : 0,
    protein: daily.length ? Math.round((daily.reduce((sum, day) => sum + day.protein, 0) / 7) * 10) / 10 : 0,
    waterMl: daily.length ? Math.round(daily.reduce((sum, day) => sum + day.waterMl, 0) / 7) : 0,
  };
  const hasEntries = daily.some((day) => day.calories > 0 || day.protein > 0 || day.waterMl > 0);
  const proteinPct = targets.protein ? Math.round((averages.protein / targets.protein) * 100) : 0;
  const insight = !hasEntries
    ? 'Log meals and water to see how your week is going.'
    : proteinPct >= 90
      ? `You averaged ${proteinPct}% of your protein target this week. Nice consistency.`
      : `You averaged ${proteinPct}% of your protein target. A protein-rich meal can help close the gap.`;

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6" aria-labelledby="weekly-trends-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700"><TrendingUp className="h-4 w-4" /> Your progress</p>
          <h2 id="weekly-trends-title" className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">Weekly nutrition trends</h2>
          <p className="mt-1 text-xs text-slate-500">Daily intake as a share of your targets</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-600">
          {series.map(({ key, label, color }) => <span key={key} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{label}</span>)}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg viewBox="0 0 700 212" role="img" aria-label="Line chart showing daily calorie, protein, and water intake as a percentage of target for the last seven days" className="min-w-[560px] w-full">
          {[0, 50, 100, 150].map((tick) => {
            const y = yFor(tick);
            return <g key={tick}><line x1={chart.left} x2={chart.right} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray={tick === 100 ? '0' : '4 5'} /><text x={chart.left - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">{tick}%</text></g>;
          })}
          {series.map(({ key, color, target }) => {
            const points = daily.map((day, index) => `${xFor(index)},${yFor(target ? (valueOf(day, key) / target) * 100 : 0)}`).join(' ');
            return <g key={key}><polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{daily.map((day, index) => {
              const value = valueOf(day, key);
              const x = xFor(index);
              const y = yFor(target ? (value / target) * 100 : 0);
              return <circle key={`${key}-${day.date}`} cx={x} cy={y} r="4" fill={color} stroke="white" strokeWidth="2"><title>{`${day.date}: ${value} ${key === 'calories' ? 'kcal' : key === 'protein' ? 'g protein' : 'ml water'}`}</title></circle>;
            })}</g>;
          })}
          {daily.map((day, index) => <text key={day.date} x={xFor(index)} y="195" textAnchor="middle" fill="#64748b" fontSize="10">{new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' })}</text>)}
        </svg>
      </div>

      {error ? <p role="status" className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">{error}</p> : null}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {series.map(({ key, label, color, target, icon: Icon }) => <div key={key} className="rounded-2xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500"><Icon className="h-3.5 w-3.5" style={{ color }} />Avg. {label}</div>
          <p className="mt-1 text-lg font-extrabold text-slate-900">{isLoading ? '—' : key === 'waterMl' ? `${averages.waterMl.toLocaleString()} ml` : key === 'calories' ? `${averages.calories.toLocaleString()} kcal` : `${averages.protein} g`}</p>
          <p className="text-[10px] text-slate-500">{target ? `${Math.round(((averages[key] || 0) / target) * 100)}% of daily target` : 'Target unavailable'}</p>
        </div>)}
      </div>
      <p className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-xs leading-relaxed text-emerald-900">{isLoading ? 'Updating your weekly summary…' : insight}</p>
    </section>
  );
};
