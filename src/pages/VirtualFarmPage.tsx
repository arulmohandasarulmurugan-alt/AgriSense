import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FARM_CROPS } from '../data/crops';
import { FarmPlot } from '../types';
import { EducationalDisclaimer } from '../components/common/EducationalDisclaimer';
import {
  Sprout,
  Droplets,
  Sparkles,
  Scissors,
  RotateCcw,
  Sun,
  CloudRain,
  Cloud,
  Flame,
  Coins,
  Calendar,
  CheckCircle2,
  Trash2,
  FastForward,
  Info,
} from 'lucide-react';

export const VirtualFarmPage: React.FC = () => {
  const {
    farm,
    selectedCropId,
    setSelectedCropId,
    activeTool,
    setActiveTool,
    plantPlot,
    waterPlot,
    fertilizePlot,
    harvestPlot,
    advanceDay,
    bulkPlant,
    bulkWater,
    bulkHarvest,
    resetFarm,
    notification,
    clearNotification,
  } = useApp();

  const [inspectedPlot, setInspectedPlot] = useState<FarmPlot | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const selectedCrop = FARM_CROPS.find((c) => c.id === selectedCropId) || FARM_CROPS[0];

  const handlePlotClick = (plot: FarmPlot) => {
    setInspectedPlot(plot);

    if (activeTool === 'plant') {
      if (plot.stage === 'empty' || plot.stage === 'withered') {
        plantPlot(plot.id, selectedCropId);
      }
    } else if (activeTool === 'water') {
      waterPlot(plot.id);
    } else if (activeTool === 'fertilize') {
      fertilizePlot(plot.id);
    } else if (activeTool === 'harvest') {
      if (plot.stage === 'harvest_ready') {
        harvestPlot(plot.id);
      }
    } else if (activeTool === 'clear') {
      if (plot.stage === 'withered' || plot.stage !== 'empty') {
        // Clear plot
        plantPlot(plot.id, selectedCropId); // will clean and plant
      }
    }
  };

  const weatherIcons: Record<typeof farm.weatherCondition, React.ReactNode> = {
    Sunny: <Sun className="w-4 h-4 text-amber-400" />,
    Overcast: <Cloud className="w-4 h-4 text-slate-300" />,
    Rainy: <CloudRain className="w-4 h-4 text-sky-400" />,
    Heatwave: <Flame className="w-4 h-4 text-rose-400" />,
  };

  const harvestableCount = farm.plots.filter((p) => p.stage === 'harvest_ready').length;
  const witheredCount = farm.plots.filter((p) => p.stage === 'withered').length;
  const growingCount = farm.plots.filter((p) => p.stage !== 'empty' && p.stage !== 'withered' && p.stage !== 'harvest_ready').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
            <Sprout className="w-3.5 h-3.5" />
            <span>Virtual Grid Cultivator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            8×8 Precision Farm Field
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Plant seeds, manage soil moisture, track simulated day cycles, and harvest for market profit.
          </p>
        </div>

        {/* Live Farm Dashboard Ticker */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Day & Weather */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-xs">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Timeline</div>
              <div className="font-mono font-bold text-white">Day {farm.day}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-xs">
            {weatherIcons[farm.weatherCondition]}
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Climate</div>
              <div className="font-semibold text-white">{farm.weatherCondition}</div>
            </div>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs">
            <Coins className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-amber-400/80 uppercase tracking-wider">Farm Treasury</div>
              <div className="font-mono font-bold text-amber-300 text-sm tabular-nums">
                {farm.coins} Coins
              </div>
            </div>
          </div>
        </div>
      </div>

      <EducationalDisclaimer variant="banner" />

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-400/40 text-emerald-200 text-xs shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={clearNotification}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Interactive Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Farm Grid (7 Cols on large screen) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#091f16] border border-emerald-500/20">
            {/* Tool Mode Buttons */}
            <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Farming Actions">
              <button
                onClick={() => setActiveTool('plant')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTool === 'plant'
                    ? 'bg-emerald-400 text-emerald-950 shadow-sm'
                    : 'bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-500/20'
                }`}
                title="Click empty tiles to plant selected crop"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Plant ({selectedCrop.name})</span>
              </button>

              <button
                onClick={() => setActiveTool('water')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTool === 'water'
                    ? 'bg-sky-400 text-sky-950 shadow-sm'
                    : 'bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-500/20'
                }`}
                title="Click tiles to water (+40% moisture)"
              >
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Water</span>
              </button>

              <button
                onClick={() => setActiveTool('fertilize')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTool === 'fertilize'
                    ? 'bg-amber-400 text-amber-950 shadow-sm'
                    : 'bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-500/20'
                }`}
                title="Click plots to add fertilizer (5 coins, +25% yield bonus)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Fertilize (5¢)</span>
              </button>

              <button
                onClick={() => setActiveTool('harvest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTool === 'harvest'
                    ? 'bg-lime-400 text-emerald-950 shadow-sm'
                    : 'bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-500/20'
                }`}
                title="Click glowing harvest-ready crops to collect coins"
              >
                <Scissors className="w-3.5 h-3.5 text-lime-400" />
                <span>Harvest ({harvestableCount})</span>
              </button>
            </div>

            {/* Advance Day Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => advanceDay(1)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold transition-colors"
                title="Advance simulation by 1 Day"
              >
                <span>Next Day</span>
                <FastForward className="w-3 h-3" />
              </button>

              <button
                onClick={() => advanceDay(7)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/20 text-slate-300 text-xs transition-colors"
                title="Fast forward 1 week (7 Days)"
              >
                <span>+7 Days</span>
              </button>
            </div>
          </div>

          {/* The 8x8 Grid Canvas */}
          <div className="p-3 sm:p-5 rounded-2xl bg-[#06180f] border-2 border-emerald-500/25 shadow-2xl">
            <div className="grid grid-cols-8 gap-1 sm:gap-2 aspect-square w-full">
              {farm.plots.map((plot) => {
                const cropConfig = FARM_CROPS.find((c) => c.id === plot.cropId);
                const isHarvestReady = plot.stage === 'harvest_ready';
                const isWithered = plot.stage === 'withered';
                const isInspected = inspectedPlot?.id === plot.id;

                // Color of the soil based on moisture
                const moistureBg =
                  plot.waterLevel > 65
                    ? 'bg-[#1b2b20]'
                    : plot.waterLevel > 25
                    ? 'bg-[#21241a]'
                    : 'bg-[#292218]';

                return (
                  <button
                    key={plot.id}
                    onClick={() => handlePlotClick(plot)}
                    className={`relative rounded-lg p-0.5 flex flex-col items-center justify-center transition-all ${moistureBg} border ${
                      isInspected
                        ? 'border-white ring-2 ring-emerald-400 z-10 scale-105'
                        : isHarvestReady
                        ? 'border-amber-400/80 bg-amber-950/30 animate-pulse'
                        : isWithered
                        ? 'border-rose-900/60 opacity-60'
                        : 'border-emerald-500/15 hover:border-emerald-400/60'
                    }`}
                    title={`Plot #${plot.id + 1} (${plot.stage}) - Moisture: ${plot.waterLevel}%`}
                    aria-label={`Plot ${plot.id + 1}, ${plot.stage}, ${plot.cropName || 'Empty'}`}
                  >
                    {/* Render visual icon or emoji based on stage */}
                    {plot.stage === 'empty' && (
                      <span className="text-slate-600/40 text-[10px] select-none">·</span>
                    )}

                    {plot.stage === 'seedling' && (
                      <span className="text-xs sm:text-base select-none">🌱</span>
                    )}

                    {plot.stage === 'vegetative' && (
                      <span className="text-xs sm:text-base select-none">🌿</span>
                    )}

                    {plot.stage === 'mature' && (
                      <span className="text-sm sm:text-xl select-none">{cropConfig?.badge || '🌾'}</span>
                    )}

                    {plot.stage === 'harvest_ready' && (
                      <div className="flex flex-col items-center">
                        <span className="text-sm sm:text-2xl transform scale-110 drop-shadow-md select-none">
                          {cropConfig?.badge || '✨'}
                        </span>
                        <span className="text-[8px] font-bold text-amber-300 font-mono hidden sm:inline">
                          Ready
                        </span>
                      </div>
                    )}

                    {plot.stage === 'withered' && (
                      <span className="text-xs sm:text-sm select-none grayscale">🥀</span>
                    )}

                    {/* Moisture Bar Indicator at bottom */}
                    <div className="absolute bottom-0.5 left-1 right-1 h-0.5 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          plot.waterLevel > 60
                            ? 'bg-sky-400'
                            : plot.waterLevel > 20
                            ? 'bg-emerald-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${plot.waterLevel}%` }}
                      />
                    </div>

                    {/* Fertilizer indicator dot */}
                    {plot.fertilized && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bulk Operations Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs">
            <span className="text-slate-400 font-medium">Bulk Field Actions:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => bulkPlant(selectedCropId)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 transition-colors"
              >
                Plant All Empty ({selectedCrop.name})
              </button>
              <button
                onClick={bulkWater}
                className="px-2.5 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/30 text-sky-200 transition-colors"
              >
                Water All Plots
              </button>
              <button
                onClick={bulkHarvest}
                disabled={harvestableCount === 0}
                className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
                  harvestableCount > 0
                    ? 'bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold border-lime-400 shadow-sm'
                    : 'bg-slate-800/40 text-slate-500 border-slate-700/40 cursor-not-allowed'
                }`}
              >
                Harvest All Ready ({harvestableCount})
              </button>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                title="Reset Farm Field"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Crop Selector & Plot Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Crop Selector Card */}
          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/25 space-y-4">
            <div className="border-b border-emerald-500/15 pb-2">
              <h2 className="font-display font-bold text-white text-base">Select Seed Stock</h2>
              <p className="text-xs text-slate-400">Choose cultivar to sow onto grid plots</p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {FARM_CROPS.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCropId(crop.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedCropId === crop.id
                      ? 'bg-emerald-500/20 border-emerald-400 ring-1 ring-emerald-400'
                      : 'bg-[#081f15]/60 border-emerald-500/15 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{crop.badge}</span>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {crop.seedCost}¢
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="font-semibold text-white text-xs">{crop.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {crop.growthDays}d · Sells for {crop.salePrice}¢
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Crop Summary */}
            <div className="p-3.5 rounded-xl bg-[#081e14] border border-emerald-500/15 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-emerald-300">{selectedCrop.badge} {selectedCrop.name} Profile:</span>
                <span className="text-amber-400 font-mono">ROI: ~{Math.round(((selectedCrop.salePrice - selectedCrop.seedCost) / selectedCrop.seedCost) * 100)}%</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{selectedCrop.description}</p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-slate-400">
                <div>Cost: <span className="font-mono text-white font-bold">{selectedCrop.seedCost}¢</span></div>
                <div>Yield: <span className="font-mono text-white font-bold">{selectedCrop.salePrice}¢</span></div>
                <div>Cycle: <span className="font-mono text-white font-bold">{selectedCrop.growthDays} Days</span></div>
              </div>
            </div>
          </div>

          {/* Inspected Plot Telemetry Card */}
          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/25 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
              <h3 className="font-display font-semibold text-white text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Plot Telemetry Inspector</span>
              </h3>
              {inspectedPlot && (
                <span className="text-xs font-mono text-emerald-400">
                  Plot #{inspectedPlot.id + 1} ({inspectedPlot.x + 1}, {inspectedPlot.y + 1})
                </span>
              )}
            </div>

            {inspectedPlot ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-[#071911] border border-emerald-500/15">
                    <span className="text-slate-400 text-[10px] block">Crop Cultivar</span>
                    <span className="font-semibold text-white text-xs">
                      {inspectedPlot.cropName || 'Fallow Soil'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#071911] border border-emerald-500/15">
                    <span className="text-slate-400 text-[10px] block">Growth Stage</span>
                    <span className="font-semibold text-emerald-300 capitalize text-xs">
                      {inspectedPlot.stage.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {inspectedPlot.stage !== 'empty' && (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Soil Moisture:</span>
                        <span className="font-mono text-sky-400 font-bold">{inspectedPlot.waterLevel}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            inspectedPlot.waterLevel > 65
                              ? 'bg-sky-400'
                              : inspectedPlot.waterLevel > 25
                              ? 'bg-emerald-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${inspectedPlot.waterLevel}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Plant Vitality:</span>
                        <span className="font-mono text-emerald-400 font-bold">{inspectedPlot.health}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400"
                          style={{ width: `${inspectedPlot.health}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Fertilized: {inspectedPlot.fertilized ? '✅ Yes (+25% bonus)' : '❌ None'}</span>
                      <span>Days in Soil: {inspectedPlot.daysPlanted}</span>
                    </div>

                    {inspectedPlot.stage === 'harvest_ready' && (
                      <button
                        onClick={() => harvestPlot(inspectedPlot.id)}
                        className="w-full py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Harvest This Crop Now</span>
                      </button>
                    )}
                  </>
                )}

                {inspectedPlot.stage === 'empty' && (
                  <button
                    onClick={() => plantPlot(inspectedPlot.id, selectedCropId)}
                    className="w-full py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-colors"
                  >
                    Plant {selectedCrop.name} Here ({selectedCrop.seedCost}¢)
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                Click any of the 64 field plots to inspect detailed moisture, root health, and growth metrics.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-rose-500/30 space-y-4">
            <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <span>Reset Virtual Farm Field?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will clear all 64 plots back to unseeded fallow soil and restore starting coins to 150. Your achievements and profile will remain intact.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-emerald-950/60 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetFarm();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-colors"
              >
                Yes, Reset Farm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
