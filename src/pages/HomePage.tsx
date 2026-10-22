import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EducationalDisclaimer } from '../components/common/EducationalDisclaimer';
import {
  Sprout,
  CloudRain,
  Compass,
  TrendingUp,
  Bug,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  Coins,
  Calendar,
} from 'lucide-react';

const FARM_TIPS = [
  {
    title: 'Moisture Retention Through Mulching',
    category: 'Soil Health',
    text: 'Applying a 5-8 cm organic straw mulch layer reduces evapotranspiration by up to 35%, preserving root-zone moisture during high-heat periods.',
  },
  {
    title: 'Precision Drip vs. Overhead Sprinklers',
    category: 'Water Conservation',
    text: 'Drip lines deliver water directly to root crowns at 90-95% efficiency, while overhead sprinklers lose 20-30% of water volume to wind drift and evaporation.',
  },
  {
    title: 'Crop Rotation with Legumes',
    category: 'Nutrient Cycling',
    text: 'Rotating heavy nitrogen consumers like maize with chickpeas or soybeans naturally fixes 50-120 kg of atmospheric nitrogen per hectare into the soil profile.',
  },
  {
    title: 'Scouting for Early Pest Thresholds',
    category: 'Integrated Pest Management',
    text: 'Inspect the undersides of young leaves weekly. Intervening at the economic injury threshold with neem extracts stops catastrophic colonial outbreaks.',
  },
  {
    title: 'Strategic Pre-Harvest Market Timing',
    category: 'Commodity Economics',
    text: 'Historical grain prices often peak 30-45 days before peak local harvest season when regional cold storage bins reach their lowest annual reserves.',
  },
];

export const HomePage: React.FC = () => {
  const { farm } = useApp();
  const [tipIndex, setTipIndex] = useState(0);

  const currentTip = FARM_TIPS[tipIndex];

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % FARM_TIPS.length);
  };

  const occupiedPlotsCount = farm.plots.filter((p) => p.stage !== 'empty' && p.stage !== 'withered').length;
  const maturePlotsCount = farm.plots.filter((p) => p.stage === 'harvest_ready').length;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#0a2217] via-[#091b13] to-[#07160f] p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Interactive Crop Intelligence Lab</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.15] text-balance">
                Grow Smarter. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-300">
                  Simulate Before You Sow.
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                AgriSense unites mathematical agronomy, real-time climate stress simulation, virtual grid farming, and market trend forecasts to optimize your agricultural yield before putting a single seed in the ground.
              </p>
            </div>

            {/* Three Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-semibold text-sm transition-all shadow-md shadow-emerald-950/50 hover:shadow-emerald-500/20"
              >
                <Compass className="w-4 h-4" />
                <span>Launch Crop Planner</span>
              </Link>

              <Link
                to="/farm"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#143527] hover:bg-[#1a4533] text-emerald-300 border border-emerald-500/30 font-medium text-sm transition-all hover:border-emerald-400/60"
              >
                <Sprout className="w-4 h-4 text-lime-400" />
                <span>Enter Virtual Farm</span>
              </Link>

              <Link
                to="/simulator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-slate-200 border border-slate-700 font-medium text-sm transition-all"
              >
                <CloudRain className="w-4 h-4 text-sky-400" />
                <span>Weather Simulator</span>
              </Link>
            </div>

            <div className="pt-2">
              <EducationalDisclaimer />
            </div>
          </div>

          {/* Hero Right Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl aspect-[16/10] bg-[#0c2419]">
              <img
                src="/src/assets/images/agrisense_hero_farm_1792651061032.jpg"
                alt="Automated agricultural smart greenhouse with misting sensors and crops"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Resilient styled fallback per section 3E
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06140e] via-transparent to-transparent opacity-80" />

              {/* Inset Farm Status Overlay */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#091f16]/90 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Active Field</div>
                    <div className="font-semibold text-white">Day {farm.day} · {farm.weatherCondition}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-slate-400 text-[10px]">Plots Occupied</div>
                    <div className="font-mono text-emerald-300 font-bold">{occupiedPlotsCount} / 64</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-[10px]">Treasury</div>
                    <div className="font-mono text-amber-300 font-bold flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {farm.coins}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-emerald-500/15">
          <div className="text-slate-400 text-xs font-medium">Virtual Harvests</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 tabular-nums">
            {farm.totalHarvested}
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
            <span>+{farm.totalHarvested * 4.2} kg simulated grain</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-emerald-500/15">
          <div className="text-slate-400 text-xs font-medium">Field Capacity</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-lime-400 font-mono mt-1 tabular-nums">
            {Math.round((occupiedPlotsCount / 64) * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {occupiedPlotsCount} active / {maturePlotsCount} ready
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-emerald-500/15">
          <div className="text-slate-400 text-xs font-medium">Accumulated Revenue</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono mt-1 tabular-nums">
            {farm.totalCoinsEarned} <span className="text-xs text-amber-400/80 font-sans">coins</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Lifetime farm yield profit
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-emerald-500/15">
          <div className="text-slate-400 text-xs font-medium">Diagnostic Species</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono mt-1 tabular-nums">
            15+
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pests & diseases cataloged
          </div>
        </div>
      </section>

      {/* Daily Farm Tip Card */}
      <section className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-[#0d281a]/80 to-[#071911]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-white text-base">Agronomy Tip of the Day</h3>
                <span className="text-xs text-emerald-400 font-medium bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                  {currentTip.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Scientific insights for sustainable, high-yield agriculture</p>
            </div>
          </div>

          <button
            onClick={nextTip}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/40 border border-emerald-500/30 text-xs text-emerald-200 transition-colors w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Next Tip</span>
          </button>
        </div>

        <div className="pt-4">
          <h4 className="font-semibold text-emerald-300 text-sm mb-1">{currentTip.title}</h4>
          <p className="text-slate-300 text-sm leading-relaxed">{currentTip.text}</p>
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Featured Agriculture Labs</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Explore our suite of specialized interactive simulation modules</p>
          </div>
          <span className="text-xs text-emerald-400/70 font-mono">Simulate · Plan · Harvest</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tool 1: Crop Planner */}
          <div className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-emerald-500/20 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-emerald-950 transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white group-hover:text-emerald-300 transition-colors">
                  Crop Suitability Planner
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Input your soil type, season, climate region, water accessibility, and acreage. Our rules-based agronomic algorithm matches optimal cultivars with transparent fitness scores.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-emerald-950/80 flex items-center justify-between">
              <span className="text-xs text-emerald-400/80 font-medium">10+ Crop Profiles</span>
              <Link
                to="/planner"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 group-hover:translate-x-1 transition-transform"
              >
                <span>Calculate</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tool 2: Virtual Farm */}
          <div className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-emerald-500/20 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:bg-lime-400 group-hover:text-emerald-950 transition-colors">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white group-hover:text-lime-300 transition-colors">
                  Virtual 8x8 Farm Field
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Cultivate crops across a 64-plot simulated field. Manage hydration, fertilize soil, advance through weather days, harvest mature produce, and grow your farm coin balance.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-emerald-950/80 flex items-center justify-between">
              <span className="text-xs text-lime-400/80 font-medium">Interactive Grid Engine</span>
              <Link
                to="/farm"
                className="inline-flex items-center gap-1 text-xs font-semibold text-lime-300 group-hover:translate-x-1 transition-transform"
              >
                <span>Play Now</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tool 3: Weather Simulator */}
          <div className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-emerald-500/20 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-400 group-hover:text-emerald-950 transition-colors">
                <CloudRain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white group-hover:text-sky-300 transition-colors">
                  Weather & Irrigation Lab
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Manipulate rainfall, temperature, atmospheric humidity, and supplemental irrigation. Live water-stress gauge and dynamic 30-day soil moisture depletion curve.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-emerald-950/80 flex items-center justify-between">
              <span className="text-xs text-sky-400/80 font-medium">Real-time Stress Index</span>
              <Link
                to="/simulator"
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 group-hover:translate-x-1 transition-transform"
              >
                <span>Simulate</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tool 4: Pest Guide */}
          <div className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-emerald-500/20 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:bg-rose-400 group-hover:text-emerald-950 transition-colors">
                <Bug className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white group-hover:text-rose-300 transition-colors">
                  Pest & Disease Diagnostic
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Searchable database of 15 major agricultural blights and insects. Detailed symptom breakdowns, bio-organic remediation, and preventive crop rotation schedules.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-emerald-950/80 flex items-center justify-between">
              <span className="text-xs text-rose-400/80 font-medium">15 Detailed Profiles</span>
              <Link
                to="/pests"
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 group-hover:translate-x-1 transition-transform"
              >
                <span>Diagnose</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tool 5: Market Intelligence */}
          <div className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-emerald-500/20 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white group-hover:text-amber-300 transition-colors">
                  Market Trends & Profit Lab
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Track price trajectories across 8 major commodities, compare two crops on synchronized charts, spot seasonal peak selling months, and calculate net profit ROI.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-emerald-950/80 flex items-center justify-between">
              <span className="text-xs text-amber-400/80 font-medium">8 Commodity Indexes</span>
              <Link
                to="/market"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 group-hover:translate-x-1 transition-transform"
              >
                <span>Analyze</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tool 6: Profile & Badges */}
          <div className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-emerald-500/20 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-400 group-hover:text-emerald-950 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white group-hover:text-teal-300 transition-colors">
                  Farmer Profile & Badges
                </h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Track your tenure achievements like First Harvest and Water Wise. Customize your agronomic bio, favorite crop cultivars, and farm identity in localStorage.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-emerald-950/80 flex items-center justify-between">
              <span className="text-xs text-teal-400/80 font-medium">Gamified Progression</span>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-300 group-hover:translate-x-1 transition-transform"
              >
                <span>View Profile</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Guarantee Banner */}
      <section className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/50 via-[#0a2016] to-emerald-950/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-white text-lg">Ready to seed your first virtual plot?</h3>
          <p className="text-slate-300 text-xs sm:text-sm">
            Experiment risk-free with soil hydration schedules, test drought stress, and forecast commodity market profit.
          </p>
        </div>
        <Link
          to="/farm"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-sm transition-all whitespace-nowrap shadow-lg shadow-emerald-950"
        >
          <span>Open Virtual Farm</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
