import React, { useState, useMemo } from 'react';
import { MARKET_CROPS_DATA } from '../data/market';
import { MarketCrop } from '../types';
import { useApp } from '../context/AppContext';
import { EducationalDisclaimer } from '../components/common/EducationalDisclaimer';
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
  TrendingUp,
  DollarSign,
  Calendar,
  Layers,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

export const MarketDashboardPage: React.FC = () => {
  const { settings } = useApp();

  // Selected crops for chart
  const [primaryCropId, setPrimaryCropId] = useState<string>('wheat');
  const [compareCropId, setCompareCropId] = useState<string>('corn');
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '12M'>('12M');

  // Profit Calculator State
  const [calcCropId, setCalcCropId] = useState<string>('wheat');
  const [calcAcreage, setCalcAcreage] = useState<string>('30');
  const [calcSeedCostPerUnit, setCalcSeedCostPerUnit] = useState<string>('40');
  const [calcFertilizerCost, setCalcFertilizerCost] = useState<string>('65');
  const [calcIrrigationCost, setCalcIrrigationCost] = useState<string>('30');
  const [calcLaborCost, setCalcLaborCost] = useState<string>('50');

  const primaryCrop = MARKET_CROPS_DATA.find((c) => c.id === primaryCropId) || MARKET_CROPS_DATA[0];
  const compareCrop = MARKET_CROPS_DATA.find((c) => c.id === compareCropId) || MARKET_CROPS_DATA[1];
  const calcCrop = MARKET_CROPS_DATA.find((c) => c.id === calcCropId) || MARKET_CROPS_DATA[0];

  // Prepare synchronized Chart Data
  const chartData = useMemo(() => {
    let rawMonths = primaryCrop.historicalPrices;
    if (timeRange === '3M') rawMonths = rawMonths.slice(9);
    else if (timeRange === '6M') rawMonths = rawMonths.slice(6);

    return rawMonths.map((item, index) => {
      // Find matching month in compare crop
      const compItem = compareCrop.historicalPrices.find((c) => c.month === item.month);
      return {
        month: item.month,
        [primaryCrop.name]: item.price,
        [compareCrop.name]: compItem ? compItem.price : null,
      };
    });
  }, [primaryCrop, compareCrop, timeRange]);

  // Profit calculations
  const profitReport = useMemo(() => {
    const acres = parseFloat(calcAcreage) || 0;
    const seed = parseFloat(calcSeedCostPerUnit) || 0;
    const fert = parseFloat(calcFertilizerCost) || 0;
    const water = parseFloat(calcIrrigationCost) || 0;
    const labor = parseFloat(calcLaborCost) || 0;

    const costPerAcre = seed + fert + water + labor;
    const totalCost = costPerAcre * acres;

    // Expected yield tons
    const totalTons = acres * calcCrop.averageYieldPerUnit;
    const totalRevenue = totalTons * calcCrop.currentPrice;
    const netProfit = totalRevenue - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const breakEvenPrice = totalTons > 0 ? totalCost / totalTons : 0;

    return {
      acres,
      totalCost: Math.round(totalCost),
      totalRevenue: Math.round(totalRevenue),
      netProfit: Math.round(netProfit),
      roi: Math.round(roi),
      breakEvenPrice: breakEvenPrice.toFixed(1),
      totalTons: totalTons.toFixed(1),
    };
  }, [calcAcreage, calcSeedCostPerUnit, calcFertilizerCost, calcIrrigationCost, calcLaborCost, calcCrop]);

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Commodity Analytics & Trade Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display">
            Agricultural Market Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Analyze historical price trends across 8 essential agricultural commodities, synchronize multi-crop comparisons, identify seasonal peak sales windows, and calculate net field ROI.
          </p>
        </div>

        <div className="text-xs text-amber-300/80 bg-amber-950/40 border border-amber-500/30 px-3.5 py-2 rounded-xl">
          Simulated Benchmark Commodities
        </div>
      </div>

      <EducationalDisclaimer variant="banner" />

      {/* 8 Commodities Quick Ticker Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {MARKET_CROPS_DATA.map((crop) => {
          const delta = crop.currentPrice - crop.prevPrice;
          const pct = ((delta / crop.prevPrice) * 100).toFixed(1);
          const isUp = delta >= 0;
          const isSelected = crop.id === primaryCropId;

          return (
            <button
              key={crop.id}
              onClick={() => setPrimaryCropId(crop.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-400 ring-1 ring-emerald-400'
                  : 'glass-panel border-emerald-500/15 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 truncate">{crop.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold flex items-center ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {pct}%
                </span>
              </div>

              <div className="mt-1 font-mono text-base font-bold text-white tabular-nums">
                ${crop.currentPrice.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{crop.priceUnit}</div>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Deck: Chart & Best Time to Sell */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/25 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/15 pb-4">
          {/* Selectors for comparison */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Primary:</span>
              <select
                value={primaryCropId}
                onChange={(e) => setPrimaryCropId(e.target.value)}
                className="bg-[#071911] border border-emerald-500/30 text-white text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                {MARKET_CROPS_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="font-semibold text-sky-400">Compare With:</span>
              <select
                value={compareCropId}
                onChange={(e) => setCompareCropId(e.target.value)}
                className="bg-[#071911] border border-sky-500/30 text-white text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-400"
              >
                {MARKET_CROPS_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time range buttons */}
          <div className="flex items-center gap-1 bg-[#071911] p-1 rounded-lg border border-emerald-500/20 text-xs">
            {(['3M', '6M', '12M'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  timeRange === t
                    ? 'bg-emerald-500/30 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Synchronized Line Chart */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#163827" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={['auto', 'auto']} unit="$" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#091f16',
                  borderColor: '#10b981',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey={primaryCrop.name}
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey={compareCrop.name}
                stroke="#38bdf8"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Best Time to Sell Indicator Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Primary Crop Indicator */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/25 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Best Selling Window: {primaryCrop.name}</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                Peak: {primaryCrop.seasonalPeakMonth}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{primaryCrop.bestTimeToSell}</p>
          </div>

          {/* Compare Crop Indicator */}
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/25 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Best Selling Window: {compareCrop.name}</span>
              </span>
              <span className="font-mono text-sky-400 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/20">
                Peak: {compareCrop.seasonalPeakMonth}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{compareCrop.bestTimeToSell}</p>
          </div>
        </div>
      </div>

      {/* Field Profit & Revenue Calculator */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/25 space-y-6">
        <div className="border-b border-emerald-500/15 pb-3">
          <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <span>Farm Profit & Revenue Calculator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Estimate production expenses against expected harvest yields and current market prices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Crop</label>
                <select
                  value={calcCropId}
                  onChange={(e) => setCalcCropId(e.target.value)}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                >
                  {MARKET_CROPS_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.currentPrice}/t)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cultivated Size ({settings.landUnit})
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="10000"
                  step="0.5"
                  value={calcAcreage}
                  onChange={(e) => setCalcAcreage(e.target.value)}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs font-mono rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Range: 0.1 – 10,000 {settings.landUnit}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Seed Cost ($ / unit)
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcSeedCostPerUnit}
                  onChange={(e) => setCalcSeedCostPerUnit(e.target.value)}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fertilizer ($ / unit)
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcFertilizerCost}
                  onChange={(e) => setCalcFertilizerCost(e.target.value)}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Irrigation & Power ($ / unit)
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcIrrigationCost}
                  onChange={(e) => setCalcIrrigationCost(e.target.value)}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Labor & Machinery ($ / unit)
                </label>
                <input
                  type="number"
                  min="0"
                  value={calcLaborCost}
                  onChange={(e) => setCalcLaborCost(e.target.value)}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Box (6 Cols) */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-gradient-to-br from-[#0c2419] to-[#071810] border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Economic Projection
              </span>
              <span className="font-mono text-xs font-bold text-slate-300">
                Yield: ~{profitReport.totalTons} metric tons
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400">Total Production Cost</span>
                <div className="font-mono text-xl font-bold text-rose-400 tabular-nums">
                  ${profitReport.totalCost.toLocaleString()}
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400">Gross Expected Revenue</span>
                <div className="font-mono text-xl font-bold text-emerald-400 tabular-nums">
                  ${profitReport.totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#06170e] border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Projected Net Profit</span>
                <span
                  className={`font-mono text-2xl font-extrabold tabular-nums ${
                    profitReport.netProfit >= 0 ? 'text-lime-400' : 'text-rose-400'
                  }`}
                >
                  {profitReport.netProfit >= 0 ? '+' : ''}${profitReport.netProfit.toLocaleString()}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Calculated ROI</span>
                <span
                  className={`font-mono text-lg font-bold tabular-nums ${
                    profitReport.roi >= 0 ? 'text-lime-300' : 'text-rose-400'
                  }`}
                >
                  {profitReport.roi}%
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Break-even Price Floor:</span>
              <span className="font-mono font-bold text-white">${profitReport.breakEvenPrice} / ton</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
