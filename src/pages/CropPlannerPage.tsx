import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SoilType, Season, ClimateRegion, WaterAvailability, CropRecommendation } from '../types';
import { calculateCropSuitability } from '../data/crops';
import { EducationalDisclaimer } from '../components/common/EducationalDisclaimer';
import {
  Compass,
  Sprout,
  Droplets,
  Calendar,
  Layers,
  MapPin,
  Maximize2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  Gauge,
  HelpCircle,
} from 'lucide-react';

const SOIL_OPTIONS: { value: SoilType; label: string; desc: string }[] = [
  { value: 'Loamy', label: 'Loamy Soil', desc: 'Ideal blend of sand, silt, and clay. High nutrient density and balanced drainage.' },
  { value: 'Clay', label: 'Clay Heavy', desc: 'Dense texture, high mineral and water retention, slow warm-up in spring.' },
  { value: 'Sandy', label: 'Sandy Soil', desc: 'Coarse particles, fast drainage, aerated, rapid leaching of soluble nutrients.' },
  { value: 'Silt', label: 'Silt Alluvial', desc: 'Smooth fertile sedimentary particles with excellent moisture holding capacity.' },
  { value: 'Peaty', label: 'Peat / Organic', desc: 'High organic carbon matter, acidic pH, spongy spring moisture.' },
  { value: 'Chalky', label: 'Chalky / Alkaline', desc: 'Free-draining limestone base, alkaline pH (>7.5), requires iron chelation.' },
];

const SEASONS: Season[] = ['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'];
const REGIONS: ClimateRegion[] = ['Temperate', 'Arid / Semi-Arid', 'Tropical', 'Mediterranean', 'Continental'];
const WATER_LEVELS: { value: WaterAvailability; label: string; desc: string }[] = [
  { value: 'Low (Drought-prone)', label: 'Low / Rainfed Dryland', desc: 'Restricted moisture, prone to dry spells without borewell backup.' },
  { value: 'Moderate', label: 'Moderate Irrigation', desc: 'Standard periodic rainfall supported by partial drip or canal scheduling.' },
  { value: 'Abundant (Irrigated)', label: 'Abundant / Fully Irrigated', desc: 'Reliable high-capacity aquifers, perennial canals, or automated pivots.' },
];

export const CropPlannerPage: React.FC = () => {
  const { settings, setSelectedCropId, recordCropPlannerRun, setActiveTool } = useApp();
  const navigate = useNavigate();

  // Form states
  const [soil, setSoil] = useState<SoilType>('Loamy');
  const [season, setSeason] = useState<Season>('Spring');
  const [region, setRegion] = useState<ClimateRegion>('Temperate');
  const [water, setWater] = useState<WaterAvailability>('Moderate');
  const [landSize, setLandSize] = useState<string>('25');
  const [formError, setFormError] = useState<string | null>(null);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>(() => {
    return calculateCropSuitability('Loamy', 'Spring', 'Temperate', 'Moderate', 25, settings.landUnit);
  });
  const [showAllResults, setShowAllResults] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSize = parseFloat(landSize);
    if (isNaN(parsedSize) || parsedSize <= 0) {
      setFormError('Please enter a valid positive land size acreage.');
      return;
    }
    if (parsedSize > 10000) {
      setFormError('Maximum simulated acreage is 10,000 units for laboratory computation.');
      return;
    }

    setFormError(null);
    const results = calculateCropSuitability(soil, season, region, water, parsedSize, settings.landUnit);
    setRecommendations(results);
    recordCropPlannerRun();
  };

  const handleSelectForFarm = (cropId: string) => {
    setSelectedCropId(cropId);
    setActiveTool('plant');
    navigate('/farm');
  };

  const handleSelectForWeatherSim = (cropId: string) => {
    navigate(`/simulator?crop=${cropId}`);
  };

  const top3 = recommendations.slice(0, 3);
  const remaining = recommendations.slice(3);

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
          <Compass className="w-3.5 h-3.5" />
          <span>Rules-Based Decision Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display">
          Crop Suitability Planner
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          Calibrate physical agro-climatic parameters to uncover which crops will thrive on your land. Suitability is modeled using transparent weights across soil structure (30%), seasonal cycle (25%), regional climate (25%), and water accessibility (20%).
        </p>
      </div>

      <EducationalDisclaimer variant="banner" />

      {/* Main Grid: Form Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Parameters Form (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-emerald-500/25 space-y-6">
          <div className="border-b border-emerald-500/15 pb-3">
            <h2 className="font-display font-bold text-white text-lg">Farm Site Parameters</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure environmental characteristics</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-5">
            {/* 1. Soil Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary Soil Classification</span>
              </label>
              <select
                value={soil}
                onChange={(e) => setSoil(e.target.value as SoilType)}
                className="w-full bg-[#081f15] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {SOIL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 italic">
                {SOIL_OPTIONS.find((s) => s.value === soil)?.desc}
              </p>
            </div>

            {/* 2. Season */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-lime-400" />
                <span>Sowing Season</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SEASONS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSeason(s)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      season === s
                        ? 'bg-emerald-500/25 border-emerald-400 text-white font-semibold shadow-sm'
                        : 'bg-[#081e14]/60 border-emerald-500/15 text-slate-300 hover:border-emerald-500/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Climate Region */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Geographic & Climate Zone</span>
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as ClimateRegion)}
                className="w-full bg-[#081f15] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Water Availability */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Water & Irrigation Capacity</span>
              </label>
              <div className="space-y-2">
                {WATER_LEVELS.map((w) => (
                  <label
                    key={w.value}
                    onClick={() => setWater(w.value)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      water === w.value
                        ? 'bg-emerald-950/70 border-emerald-400 text-white'
                        : 'bg-[#071911]/40 border-emerald-500/15 text-slate-300 hover:border-emerald-500/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="waterLevel"
                      checked={water === w.value}
                      onChange={() => setWater(w.value)}
                      className="mt-0.5 text-emerald-400 focus:ring-emerald-400"
                    />
                    <div>
                      <div className="text-xs font-semibold">{w.label}</div>
                      <div className="text-[11px] text-slate-400">{w.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Land Size */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Planned Land Acreage</span>
                </div>
                <span className="text-[11px] text-emerald-400 capitalize">In {settings.landUnit}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  max="10000"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full bg-[#081f15] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                  {settings.landUnit}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Allowed range: <strong className="text-emerald-400 font-mono">0.1 – 10,000</strong> {settings.landUnit}</span>
                <span>Step: 0.5</span>
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-sm transition-all shadow-md shadow-emerald-950 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Compute Top Cultivar Recommendations</span>
            </button>
          </form>

          {/* Formula Transparency Card */}
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/15 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Transparent Formula Breakdown</span>
            </div>
            <p>
              Suitability = (Soil × 30%) + (Season × 25%) + (Region × 25%) + (Water × 20%). Output yields are normalized against USDA/FAO regional baseline statistics.
            </p>
          </div>
        </div>

        {/* Recommendations Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <span>Top Recommended Crops</span>
                <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                  {recommendations.length} Scored
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated for {landSize} {settings.landUnit} · {soil} · {season}
              </p>
            </div>
          </div>

          {/* Top 3 Crop Cards */}
          <div className="space-y-4">
            {top3.map((crop, index) => {
              const rankLabels = ['1st Recommendation', '2nd Recommendation', '3rd Recommendation'];
              const scoreBadgeColor =
                crop.suitabilityScore >= 85
                  ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60'
                  : crop.suitabilityScore >= 70
                  ? 'text-lime-300 border-lime-500/30 bg-lime-950/60'
                  : 'text-amber-300 border-amber-500/30 bg-amber-950/60';

              return (
                <div
                  key={crop.id}
                  className="glass-panel rounded-2xl p-6 border border-emerald-500/25 relative overflow-hidden transition-all hover:border-emerald-400/50"
                >
                  {/* Rank Ribbon */}
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                        {rankLabels[index]}
                      </span>
                      <span className="text-xs text-slate-400">Category: {crop.category}</span>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${scoreBadgeColor}`}>
                      <Gauge className="w-3.5 h-3.5" />
                      <span>{crop.suitabilityScore}% Match</span>
                    </div>
                  </div>

                  {/* Crop Title & Reason */}
                  <div className="space-y-1 mb-4">
                    <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-emerald-400" />
                      <span>{crop.name}</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{crop.reason}</p>
                  </div>

                  {/* Key Metrics Strip */}
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#071810]/80 border border-emerald-500/15 mb-4 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Expected Yield</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-300 font-mono mt-0.5">
                        {crop.expectedYield}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Growth Cycle</div>
                      <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{crop.growthDurationDays} Days</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Water Demand</div>
                      <div className="text-xs sm:text-sm font-bold text-sky-300 font-mono mt-0.5">
                        {crop.waterDemand}
                      </div>
                    </div>
                  </div>

                  {/* Weighted Sub-Score Progress Bars */}
                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-semibold text-slate-300">Factor Fitness Breakdown:</div>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Soil ({crop.soilMatch}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${crop.soilMatch}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Climate ({crop.climateMatch}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-lime-400 h-full rounded-full" style={{ width: `${crop.climateMatch}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Water ({crop.waterMatch}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-sky-400 h-full rounded-full" style={{ width: `${crop.waterMatch}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Best Practices Bullets */}
                  <div className="text-xs text-slate-400 space-y-1 mb-5">
                    <div className="font-semibold text-slate-300 text-[11px]">Agronomic Agronomist Advice:</div>
                    <ul className="space-y-1">
                      {crop.bestPractices.map((bp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cross-Lab Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-emerald-500/15">
                    <button
                      onClick={() => handleSelectForFarm(crop.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-colors"
                    >
                      <Sprout className="w-3.5 h-3.5" />
                      <span>Plant in Virtual Farm</span>
                    </button>

                    <button
                      onClick={() => handleSelectForWeatherSim(crop.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/70 text-slate-200 border border-emerald-500/30 text-xs transition-colors"
                    >
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      <span>Simulate in Weather Lab</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show All Other Ranked Crops Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setShowAllResults(!showAllResults)}
              className="w-full py-2.5 rounded-xl border border-emerald-500/25 bg-emerald-950/40 hover:bg-emerald-900/40 text-xs font-semibold text-emerald-300 transition-colors flex items-center justify-center gap-2"
            >
              <span>{showAllResults ? 'Hide Extended Cultivar List' : `View ${remaining.length} Other Evaluated Cultivars`}</span>
            </button>
          </div>

          {showAllResults && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Secondary Cultivar Candidates
              </h4>
              <div className="space-y-2">
                {remaining.map((crop) => (
                  <div
                    key={crop.id}
                    className="glass-panel p-4 rounded-xl border border-emerald-500/15 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-semibold text-white text-sm">{crop.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{crop.reason}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-slate-300">{crop.suitabilityScore}%</div>
                      <button
                        onClick={() => handleSelectForFarm(crop.id)}
                        className="text-[11px] text-emerald-400 hover:underline mt-0.5 block"
                      >
                        Plant
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
