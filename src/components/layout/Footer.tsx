import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { EducationalDisclaimer } from '../common/EducationalDisclaimer';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-emerald-950 bg-[#06120d] text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-white text-base">AgriSense</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Grow Smarter. Simulate Before You Sow. An interactive agricultural intelligence lab for virtual cultivation, soil suitability modeling, and climate resilience.
            </p>
          </div>

          {/* Quick Simulation Labs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">Simulation Labs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/farm" className="hover:text-emerald-300 transition-colors">8x8 Virtual Farm Field</Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-emerald-300 transition-colors">Crop Suitability Planner</Link>
              </li>
              <li>
                <Link to="/simulator" className="hover:text-emerald-300 transition-colors">Weather & Irrigation Stress Lab</Link>
              </li>
            </ul>
          </div>

          {/* Intelligence & Reference */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">Knowledge & Market</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/pests" className="hover:text-emerald-300 transition-colors">Pest & Pathogen Diagnostic Guide</Link>
              </li>
              <li>
                <Link to="/market" className="hover:text-emerald-300 transition-colors">Commodity Price Analytics</Link>
              </li>
              <li>
                <Link to="/market" className="hover:text-emerald-300 transition-colors">Acreage Profitability Calculator</Link>
              </li>
            </ul>
          </div>

          {/* Administration & Storage */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">Settings & Profiles</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/profile" className="hover:text-emerald-300 transition-colors">Farmer Profile & Achievements</Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-emerald-300 transition-colors">Units & Audio Settings</Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-emerald-300 transition-colors">JSON Backup & Restore Lab</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <EducationalDisclaimer />
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} AgriSense Lab. All simulated models powered by client-side agronomic algorithms.
          </div>
        </div>
      </div>
    </footer>
  );
};
