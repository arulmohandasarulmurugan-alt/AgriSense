import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-3xl">
        🌾
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Error 404: Fallow Field
        </span>
        <h1 className="text-3xl font-extrabold text-white font-display">
          Uncharted Acreage
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          The requested coordinate or agricultural laboratory route does not exist or has been rotated to fallow rest.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-colors shadow-md shadow-emerald-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Overview</span>
        </Link>
        <Link
          to="/farm"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 text-slate-200 border border-emerald-500/30 text-xs font-medium transition-colors"
        >
          <Sprout className="w-4 h-4 text-lime-400" />
          <span>Go to Virtual Farm</span>
        </Link>
      </div>
    </div>
  );
};
