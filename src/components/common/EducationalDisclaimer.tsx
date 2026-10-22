import React from 'react';
import { Info } from 'lucide-react';

interface Props {
  className?: string;
  variant?: 'subtle' | 'banner';
}

export const EducationalDisclaimer: React.FC<Props> = ({ className = '', variant = 'subtle' }) => {
  if (variant === 'banner') {
    return (
      <div className={`flex items-center justify-between gap-3 px-4 py-2 bg-emerald-950/40 border border-emerald-500/20 text-emerald-200/90 text-xs rounded-lg ${className}`}>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>All figures are simulated for educational purposes, not real agronomic advice.</span>
        </div>
        <span className="text-emerald-400/60 hidden sm:inline text-[11px]">Academic & Research Simulation</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-xs text-slate-400/80 ${className}`}>
      <Info className="w-3.5 h-3.5 text-emerald-500/80 shrink-0" aria-hidden="true" />
      <span>All figures are simulated for educational purposes, not real agronomic advice.</span>
    </div>
  );
};
