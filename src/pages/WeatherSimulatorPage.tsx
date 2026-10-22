import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EducationalDisclaimer } from '../components/common/EducationalDisclaimer';
import { FARM_CROPS } from '../data/crops';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CloudRain,
  Thermometer,
  Droplets,
  Sliders,
  Gauge,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Zap,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface SimulationPoint {
  day: number;
  soilMoisture: number; // percentage
  cropDemand: number; // percentage
  stressLevel: number;
}

export const WeatherSimulatorPage: React.FC = () => {
  const { settings, recordWeatherSimRun, unlockAchievement } = useApp();
  const [searchParams] = useSearchParams();

  // Crop selection
  const initialCropId = searchParams.get('crop') || 'wheat';
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId);

  // Sliders state
  const [rainfallMm, setRainfallMm] = useState<number>(65);
  const [temperatureC, setTemperatureC] = useState<number>(23);
  const [humidityPct, setHumidityPct] = useState<number>(55);
  const [irrigationPct, setIrrigationPct] = useState<number>(40);

  const selectedCrop = FARM_CROPS.find((c) => c.id === selectedCropId) || FARM_CROPS[0];

  // Temperature unit display helper
  const displayTemp = (celsius: number) => {
    if (settings.tempUnit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  // Agronomic mathematical model calculations
  const simResults = useMemo(() => {
    // 1. Evapotranspiration ET0 approximation (Hargreaves-Samani proxy)
    // Higher temp & lower humidity increase vapor pressure deficit (VPD)
    const vpd = ((100 - humidityPct) / 100) * (0.61078 * Math.exp((17.27 * temperatureC) / (temperatureC + 237.3)));
    const baseEt0 = Math.max(1.5, (0.0023 * (temperatureC + 17.8) * Math.sqrt(28)) + vpd * 1.8); // mm/day
    const monthlyCropNeedMm = baseEt0 * 30 * (selectedCrop.waterNeed / 20);

    // 2. Total water provided
    const irrigationMm = (irrigationPct / 100) * 140; // max 140mm supplemental
    const totalWaterMm = rainfallMm + irrigationMm;

    // 3. Water-stress ratio
    const waterRatio = totalWaterMm / monthlyCropNeedMm; // 1.0 is exact match

    let stressCategory: 'Severe Deficit' | 'Mild Deficit' | 'Optimal' | 'Over-Saturated';
    let stressScore: number; // 0 to 100 (100 is best)
    let yieldPredictionPct: number;
    let adviceTitle: string;
    let adviceText: string;

    if (waterRatio < 0.45) {
      stressCategory = 'Severe Deficit';
      stressScore = Math.max(10, Math.round(waterRatio * 100));
      yieldPredictionPct = Math.max(15, Math.round(waterRatio * 85));
      adviceTitle = 'Extreme Drought Stress Imminent';
      adviceText = `Water supply (${Math.round(totalWaterMm)} mm) falls critically short of ${selectedCrop.name}'s demand (${Math.round(monthlyCropNeedMm)} mm). Stomata will close, triggering premature flowering or blossom drop. Immediately increase supplemental drip irrigation by at least 35% and apply organic mulch.`;
    } else if (waterRatio < 0.8) {
      stressCategory = 'Mild Deficit';
      stressScore = Math.round(50 + (waterRatio - 0.45) * 100);
      yieldPredictionPct = Math.round(60 + (waterRatio - 0.45) * 60);
      adviceTitle = 'Moderate Soil Moisture Deficit';
      adviceText = `Slight vegetative growth deceleration detected. Recommended to increase irrigation during critical vegetative-to-anthesis transition to prevent kernel filling reductions.`;
    } else if (waterRatio <= 1.25) {
      stressCategory = 'Optimal';
      stressScore = Math.min(99, Math.round(90 + (1 - Math.abs(1.0 - waterRatio)) * 10));
      yieldPredictionPct = Math.min(98, Math.round(88 + (1 - Math.abs(1.0 - waterRatio)) * 10));
      adviceTitle = 'Ideal Hydration Equilibrium';
      adviceText = `Total moisture supply matches ${selectedCrop.name}'s evapotranspiration envelope. Root aeration and nutrient uptake are operating at peak efficiency. Maintain current scheduled irrigation intervals.`;
    } else {
      stressCategory = 'Over-Saturated';
      const excess = waterRatio - 1.25;
      stressScore = Math.max(20, Math.round(80 - excess * 50));
      yieldPredictionPct = Math.max(25, Math.round(85 - excess * 60));
      adviceTitle = 'Waterlogging & Anaerobic Root Hazard';
      adviceText = `Soil pores are flooded (${Math.round(totalWaterMm)} mm vs ${Math.round(monthlyCropNeedMm)} mm required). Oxygen deprivation at the rhizosphere encourages Pythium damping-off and root asphyxiation. Cut irrigation to 0% and check ditch drainage.`;
    }

    return {
      monthlyCropNeedMm: Math.round(monthlyCropNeedMm),
      totalWaterMm: Math.round(totalWaterMm),
      waterRatio: parseFloat(waterRatio.toFixed(2)),
      stressCategory,
      stressScore,
      yieldPredictionPct,
      adviceTitle,
      adviceText,
    };
  }, [rainfallMm, temperatureC, humidityPct, irrigationPct, selectedCrop]);

  // Unlock "Water Wise" achievement when in optimal state
  useEffect(() => {
    if (simResults.stressCategory === 'Optimal' && simResults.yieldPredictionPct >= 90) {
      unlockAchievement('water-wise');
    }
  }, [simResults, unlockAchievement]);

  // Generate 30-day simulated moisture curve for the chart
  const chartData: SimulationPoint[] = useMemo(() => {
    const points: SimulationPoint[] = [];
    let currentSoil = 60; // start at 60% field capacity

    const dailyRain = rainfallMm / 30;
    const dailyIrrigation = ((irrigationPct / 100) * 140) / 30;
    const dailyDemand = simResults.monthlyCropNeedMm / 30;

    for (let day = 1; day <= 30; day++) {
      // Simulate periodic rainfall events rather than pure flat line
      const rainEvent = day % 6 === 0 ? dailyRain * 3.5 : day % 7 === 0 ? dailyRain * 2.0 : dailyRain * 0.3;
      const irrigationEvent = day % 3 === 0 ? dailyIrrigation * 3 : 0;
      const input = rainEvent + irrigationEvent;
      const consumption = dailyDemand * (1 + (Math.sin(day / 4) * 0.15));

      currentSoil = Math.max(10, Math.min(100, currentSoil + (input - consumption) * 3));

      points.push({
        day,
        soilMoisture: Math.round(currentSoil),
        cropDemand: Math.round(Math.min(95, 45 + dailyDemand * 8)),
        stressLevel: Math.round(Math.max(0, 100 - currentSoil)),
      });
    }
    return points;
  }, [rainfallMm, irrigationPct, simResults.monthlyCropNeedMm]);

  // Scenario Presets
  const applyPreset = (preset: 'drought' | 'monsoon' | 'optimal' | 'heatwave') => {
    if (preset === 'drought') {
      setRainfallMm(12);
      setTemperatureC(37);
      setHumidityPct(22);
      setIrrigationPct(15);
      recordWeatherSimRun(true);
    } else if (preset === 'monsoon') {
      setRainfallMm(250);
      setTemperatureC(26);
      setHumidityPct(92);
      setIrrigationPct(5);
      recordWeatherSimRun(false);
    } else if (preset === 'optimal') {
      setRainfallMm(70);
      setTemperatureC(22);
      setHumidityPct(60);
      setIrrigationPct(45);
      recordWeatherSimRun(false);
    } else if (preset === 'heatwave') {
      setRainfallMm(15);
      setTemperatureC(42);
      setHumidityPct(28);
      setIrrigationPct(75);
      recordWeatherSimRun(true);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/20 mb-2">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Biophysical Micro-Climate Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display">
            Weather & Irrigation Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manipulate rainfall patterns, temperature extremes, humidity, and supplemental irrigation to measure physiological crop stress and forecast expected yield.
          </p>
        </div>

        {/* Crop Selector Pill */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
          <span className="text-xs text-slate-400 pl-2">Subject Crop:</span>
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="bg-[#071d12] border border-emerald-500/40 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            {FARM_CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.badge} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <EducationalDisclaimer variant="banner" />

      {/* Quick Scenario Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1">Laboratory Stress Scenarios:</span>
        <button
          onClick={() => applyPreset('optimal')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 transition-colors"
        >
          Optimal Balanced
        </button>
        <button
          onClick={() => applyPreset('drought')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 transition-colors"
        >
          Severe Drought (37°C / Low Rain)
        </button>
        <button
          onClick={() => applyPreset('heatwave')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-rose-300 transition-colors"
        >
          Heatwave Crisis (42°C Extreme)
        </button>
        <button
          onClick={() => applyPreset('monsoon')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 transition-colors"
        >
          Monsoon Deluge (250mm Torrent)
        </button>
      </div>

      {/* Main Grid: Controls Left, Live Telemetry & Graph Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Panel (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-emerald-500/25 space-y-6">
          <div className="border-b border-emerald-500/15 pb-2">
            <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Climate Variable Controls</span>
            </h2>
            <p className="text-xs text-slate-400">Drag sliders to modify atmospheric inputs</p>
          </div>

          <div className="space-y-6">
            {/* Slider 1: Rainfall */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  <span>Monthly Natural Rainfall</span>
                </label>
                <span className="font-mono text-sky-400 font-bold">{rainfallMm} mm/mo</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 mm (Desert)</span>
                <span>150 mm (Average)</span>
                <span>300 mm (Flood)</span>
              </div>
            </div>

            {/* Slider 2: Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ambient Temperature</span>
                </label>
                <span className="font-mono text-amber-400 font-bold">{displayTemp(temperatureC)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="1"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{displayTemp(5)} (Chilly)</span>
                <span>{displayTemp(25)} (Mild)</span>
                <span>{displayTemp(45)} (Extreme Heat)</span>
              </div>
            </div>

            {/* Slider 3: Humidity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-teal-400" />
                  <span>Relative Air Humidity</span>
                </label>
                <span className="font-mono text-teal-400 font-bold">{humidityPct}% RH</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={humidityPct}
                onChange={(e) => setHumidityPct(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10% (Arid)</span>
                <span>55% (Moderate)</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            {/* Slider 4: Supplemental Irrigation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-lime-400" />
                  <span>Supplemental Drip Irrigation</span>
                </label>
                <span className="font-mono text-lime-400 font-bold">{irrigationPct}% Intensity</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={irrigationPct}
                onChange={(e) => setIrrigationPct(Number(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Rainfed only)</span>
                <span>50% (Standard Pivot)</span>
                <span>100% (Continuous Flood)</span>
              </div>
            </div>
          </div>

          {/* Model Summary Strip */}
          <div className="p-3.5 rounded-xl bg-[#081e14] border border-emerald-500/15 space-y-2 text-xs">
            <div className="text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
              Calculated Mass Balance
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-400 text-xs">
              <div>Water Delivered: <span className="font-mono text-sky-300 font-bold">{simResults.totalWaterMm} mm</span></div>
              <div>Crop Water Need: <span className="font-mono text-amber-300 font-bold">{simResults.monthlyCropNeedMm} mm</span></div>
            </div>
          </div>
        </div>

        {/* Live Gauges & 30-Day Line Chart (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Telemetry Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Water-Stress Meter */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Water-Stress Status</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    simResults.stressCategory === 'Optimal'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : simResults.stressCategory === 'Mild Deficit'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {simResults.stressCategory}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Hydration Score:</span>
                  <span className="font-mono text-lg font-extrabold text-white">{simResults.stressScore}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      simResults.stressCategory === 'Optimal'
                        ? 'bg-emerald-400'
                        : simResults.stressCategory === 'Mild Deficit'
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${simResults.stressScore}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Supply to demand ratio: <span className="font-mono text-white font-bold">{simResults.waterRatio}x</span>
              </p>
            </div>

            {/* Yield Prediction Gauge */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Yield Prediction</span>
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-lime-400">
                  {simResults.yieldPredictionPct >= 80 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{simResults.yieldPredictionPct}% of Maximum</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Potential Harvest:</span>
                  <span className="font-mono text-lg font-extrabold text-lime-400">
                    {simResults.yieldPredictionPct}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-400 transition-all duration-300"
                    style={{ width: `${simResults.yieldPredictionPct}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Calibrated against {selectedCrop.name} physiological tolerances.
              </p>
            </div>
          </div>

          {/* Dynamic Live Agronomic Advice Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              simResults.stressCategory === 'Optimal'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100'
                : simResults.stressCategory === 'Mild Deficit'
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-100'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-100'
            }`}
          >
            <div className="flex items-start gap-3">
              {simResults.stressCategory === 'Optimal' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm font-display">{simResults.adviceTitle}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{simResults.adviceText}</p>
              </div>
            </div>
          </div>

          {/* 30-Day Simulated Moisture Chart */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/15 pb-3">
              <div>
                <h3 className="font-display font-semibold text-white text-base">
                  30-Day Simulated Moisture Depletion Curve
                </h3>
                <p className="text-xs text-slate-400">
                  Dynamics of soil field capacity (%) vs {selectedCrop.name} water demand over 30 days
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">30 Daily Steps</span>
            </div>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#163827" />
                  <XAxis
                    dataKey="day"
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `Day ${val}`}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#091f16',
                      borderColor: '#10b981',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelFormatter={(val) => `Simulation Day ${val}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="soilMoisture"
                    name="Soil Moisture (% Capacity)"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cropDemand"
                    name="Crop Demand Baseline"
                    stroke="#a3e635"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
