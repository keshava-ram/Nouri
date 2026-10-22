import type { Metadata } from 'next';
import './globals.css';
import { InteractiveBackground } from '@/components/InteractiveBackground';

export const metadata: Metadata = {
  title: 'Nouri - Climate-Aware Nutrition & Hydration Companion',
  description:
    'Track daily macros, balance protein deficits, monitor hydration with smart reminders, and receive climate-aligned meal suggestions tailored to your region.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f1f7f4] text-slate-900 relative selection:bg-emerald-500/20 selection:text-emerald-900">
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
