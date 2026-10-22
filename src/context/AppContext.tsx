import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  AppSettings,
  FarmerProfile,
  FarmState,
  FarmPlot,
  Achievement,
} from '../types';
import { safeGetItem, safeSetItem, safeClearAll } from '../utils/storage';
import { playSound } from '../utils/audio';
import { FARM_CROPS } from '../data/crops';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  SETTINGS: 'agrisense_settings_v1',
  PROFILE: 'agrisense_profile_v1',
  FARM: 'agrisense_farm_v1',
  ACHIEVEMENTS: 'agrisense_achievements_v1',
  STATS: 'agrisense_stats_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  landUnit: 'acres',
  tempUnit: 'C',
  soundEnabled: true,
  theme: 'dark',
};

const DEFAULT_PROFILE: FarmerProfile = {
  name: 'Elena Rostova',
  farmName: 'Verdant Ridge Agri-Lab',
  location: 'Temperate Loam Valley',
  farmSize: 50,
  sizeUnit: 'acres',
  favoriteCrops: ['wheat', 'tomato', 'corn'],
  avatarId: 'avatar-1',
  bio: 'Precision agronomist evaluating closed-loop hydroponics, climate-stress mitigation, and soil moisture telemetry.',
};

function createInitialPlots(size: number = 8): FarmPlot[] {
  const plots: FarmPlot[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      plots.push({
        id: y * size + x,
        x,
        y,
        cropId: null,
        cropName: null,
        stage: 'empty',
        daysPlanted: 0,
        waterLevel: 50,
        fertilized: false,
        health: 100,
      });
    }
  }
  return plots;
}

const DEFAULT_FARM: FarmState = {
  gridSize: 8,
  plots: createInitialPlots(8),
  day: 1,
  coins: 150,
  weatherCondition: 'Sunny',
  totalHarvested: 0,
  totalCoinsEarned: 0,
};

interface AppContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  profile: FarmerProfile;
  updateProfile: (profile: FarmerProfile) => void;
  farm: FarmState;
  selectedCropId: string;
  setSelectedCropId: (id: string) => void;
  activeTool: 'plant' | 'water' | 'fertilize' | 'harvest' | 'clear';
  setActiveTool: (tool: 'plant' | 'water' | 'fertilize' | 'harvest' | 'clear') => void;
  plantPlot: (plotId: number, cropId?: string) => void;
  waterPlot: (plotId: number) => void;
  fertilizePlot: (plotId: number) => void;
  harvestPlot: (plotId: number) => void;
  advanceDay: (days?: number) => void;
  bulkPlant: (cropId: string) => void;
  bulkWater: () => void;
  bulkHarvest: () => void;
  resetFarm: () => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  recordCropPlannerRun: () => void;
  recordWeatherSimRun: (isExtreme: boolean) => void;
  exportAllData: () => string;
  importAllData: (jsonStr: string) => { success: boolean; message: string };
  resetAllData: () => void;
  notification: string | null;
  clearNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() =>
    safeGetItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  const [profile, setProfile] = useState<FarmerProfile>(() =>
    safeGetItem<FarmerProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE)
  );

  const [farm, setFarm] = useState<FarmState>(() =>
    safeGetItem<FarmState>(STORAGE_KEYS.FARM, DEFAULT_FARM)
  );

  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    safeGetItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS)
  );

  const [stats, setStats] = useState<{ plannerRuns: number; extremeWeatherRuns: number }>(() =>
    safeGetItem(STORAGE_KEYS.STATS, { plannerRuns: 0, extremeWeatherRuns: 0 })
  );

  const [selectedCropId, setSelectedCropId] = useState<string>('wheat');
  const [activeTool, setActiveTool] = useState<'plant' | 'water' | 'fertilize' | 'harvest' | 'clear'>('plant');
  const [notification, setNotification] = useState<string | null>(null);

  const clearNotification = () => setNotification(null);

  // Sync theme with DOM
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Persist settings
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // Persist profile
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  // Persist farm
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.FARM, farm);
  }, [farm]);

  // Persist achievements
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  }, [achievements]);

  // Persist stats
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.STATS, stats);
  }, [stats]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleTheme = () => {
    playSound('click', settings.soundEnabled);
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const toggleSound = () => {
    setSettings((prev) => {
      const next = !prev.soundEnabled;
      if (next) playSound('click', true);
      return { ...prev, soundEnabled: next };
    });
  };

  const updateProfile = (newProfile: FarmerProfile) => {
    playSound('click', settings.soundEnabled);
    setProfile(newProfile);
    setNotification('Farmer Profile saved successfully.');
  };

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const existing = prev.find((a) => a.id === id);
      if (existing && !existing.unlocked) {
        playSound('achievement', settings.soundEnabled);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
          });
        } catch {
          // ignore
        }
        setNotification(`Achievement Unlocked: ${existing.title}!`);
        return prev.map((a) =>
          a.id === id
            ? { ...a, unlocked: true, progress: a.maxProgress, unlockedAt: new Date().toLocaleDateString() }
            : a
        );
      }
      return prev;
    });
  }, [settings.soundEnabled]);

  const updateAchievementProgress = useCallback((id: string, progressDelta: number, isAbsolute: boolean = false) => {
    setAchievements((prev) => {
      let changed = false;
      const next = prev.map((a) => {
        if (a.id === id) {
          const current = a.progress;
          const newProgress = isAbsolute ? progressDelta : current + progressDelta;
          const capped = Math.min(a.maxProgress, Math.max(0, newProgress));
          if (capped >= a.maxProgress && !a.unlocked) {
            changed = true;
            playSound('achievement', settings.soundEnabled);
            setNotification(`Achievement Unlocked: ${a.title}!`);
            try {
              confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
            } catch {
              // fallback
            }
            return {
              ...a,
              progress: capped,
              unlocked: true,
              unlockedAt: new Date().toLocaleDateString(),
            };
          }
          return { ...a, progress: capped };
        }
        return a;
      });
      return changed ? next : next;
    });
  }, [settings.soundEnabled]);

  // Check biodiversity achievement whenever plots change
  useEffect(() => {
    const activeCropIds = new Set(
      farm.plots.filter((p) => p.cropId && p.stage !== 'empty' && p.stage !== 'withered').map((p) => p.cropId)
    );
    updateAchievementProgress('biodiverse-acreage', activeCropIds.size, true);
  }, [farm.plots, updateAchievementProgress]);

  // Check coin achievement
  useEffect(() => {
    updateAchievementProgress('market-mogul', farm.coins, true);
  }, [farm.coins, updateAchievementProgress]);

  const plantPlot = (plotId: number, cropIdToPlant?: string) => {
    const targetCropId = cropIdToPlant || selectedCropId;
    const cropConfig = FARM_CROPS.find((c) => c.id === targetCropId);
    if (!cropConfig) return;

    if (farm.coins < cropConfig.seedCost) {
      playSound('alert', settings.soundEnabled);
      setNotification(`Need ${cropConfig.seedCost} coins to plant ${cropConfig.name}. Balance: ${farm.coins} coins.`);
      return;
    }

    setFarm((prev) => {
      const targetPlot = prev.plots.find((p) => p.id === plotId);
      if (!targetPlot || (targetPlot.stage !== 'empty' && targetPlot.stage !== 'withered')) {
        return prev;
      }

      playSound('plant', settings.soundEnabled);
      const nextPlots = prev.plots.map((p) =>
        p.id === plotId
          ? {
              ...p,
              cropId: cropConfig.id,
              cropName: cropConfig.name,
              stage: 'seedling' as const,
              daysPlanted: 0,
              waterLevel: Math.max(40, p.waterLevel),
              fertilized: false,
              health: 100,
            }
          : p
      );

      return {
        ...prev,
        coins: prev.coins - cropConfig.seedCost,
        plots: nextPlots,
      };
    });
  };

  const waterPlot = (plotId: number) => {
    playSound('water', settings.soundEnabled);
    setFarm((prev) => ({
      ...prev,
      plots: prev.plots.map((p) =>
        p.id === plotId ? { ...p, waterLevel: Math.min(100, p.waterLevel + 40) } : p
      ),
    }));
  };

  const fertilizePlot = (plotId: number) => {
    if (farm.coins < 5) {
      playSound('alert', settings.soundEnabled);
      setNotification('Fertilizer requires 5 coins.');
      return;
    }
    playSound('click', settings.soundEnabled);
    setFarm((prev) => ({
      ...prev,
      coins: prev.coins - 5,
      plots: prev.plots.map((p) =>
        p.id === plotId ? { ...p, fertilized: true, health: Math.min(100, p.health + 20) } : p
      ),
    }));
  };

  const harvestPlot = (plotId: number) => {
    const plot = farm.plots.find((p) => p.id === plotId);
    if (!plot || plot.stage !== 'harvest_ready') return;

    const cropConfig = FARM_CROPS.find((c) => c.id === plot.cropId);
    const baseSale = cropConfig ? cropConfig.salePrice : 25;
    // Health and fertilization bonus
    const qualityMultiplier = (plot.health / 100) * (plot.fertilized ? 1.25 : 1.0);
    const earned = Math.round(baseSale * qualityMultiplier);

    playSound('harvest', settings.soundEnabled);

    setFarm((prev) => ({
      ...prev,
      coins: prev.coins + earned,
      totalHarvested: prev.totalHarvested + 1,
      totalCoinsEarned: prev.totalCoinsEarned + earned,
      plots: prev.plots.map((p) =>
        p.id === plotId
          ? {
              ...p,
              cropId: null,
              cropName: null,
              stage: 'empty' as const,
              daysPlanted: 0,
              waterLevel: 40,
              fertilized: false,
              health: 100,
            }
          : p
      ),
    }));

    updateAchievementProgress('first-harvest', 1);
    updateAchievementProgress('green-thumb', 1);
    updateAchievementProgress('master-harvester', 1);
  };

  const advanceDay = (daysCount: number = 1) => {
    playSound('click', settings.soundEnabled);

    setFarm((prev) => {
      const nextDay = prev.day + daysCount;

      // Random weather cycle
      const weatherRoll = Math.random();
      let nextWeather: FarmState['weatherCondition'] = 'Sunny';
      if (weatherRoll < 0.25) nextWeather = 'Rainy';
      else if (weatherRoll < 0.45) nextWeather = 'Overcast';
      else if (weatherRoll > 0.85) nextWeather = 'Heatwave';

      const nextPlots = prev.plots.map((plot) => {
        if (plot.stage === 'empty') {
          // Soil slowly stabilizes moisture
          const naturalWater = nextWeather === 'Rainy' ? 70 : Math.max(20, plot.waterLevel - 5 * daysCount);
          return { ...plot, waterLevel: naturalWater };
        }

        if (plot.stage === 'withered') {
          return plot;
        }

        const cropConfig = FARM_CROPS.find((c) => c.id === plot.cropId);
        const waterDemand = cropConfig ? cropConfig.waterNeed : 20;

        let currentWater = plot.waterLevel;
        if (nextWeather === 'Rainy') {
          currentWater = Math.min(100, currentWater + 35 * daysCount);
        } else if (nextWeather === 'Heatwave') {
          currentWater = Math.max(0, currentWater - (waterDemand * 1.5) * daysCount);
        } else {
          currentWater = Math.max(0, currentWater - waterDemand * daysCount);
        }

        // Health check: drought or waterlogged
        let health = plot.health;
        if (currentWater < 15) {
          health = Math.max(0, health - 25 * daysCount);
        } else if (currentWater > 90) {
          health = Math.max(0, health - 15 * daysCount);
        } else {
          health = Math.min(100, health + 10 * daysCount);
        }

        if (health <= 0) {
          return {
            ...plot,
            stage: 'withered' as const,
            health: 0,
            waterLevel: currentWater,
          };
        }

        const daysPlanted = plot.daysPlanted + daysCount;
        const totalReqDays = cropConfig ? cropConfig.growthDays : 5;

        let nextStage: FarmPlot['stage'] = plot.stage;
        const growthFraction = daysPlanted / totalReqDays;

        if (growthFraction >= 1.0) {
          nextStage = 'harvest_ready';
        } else if (growthFraction >= 0.6) {
          nextStage = 'mature';
        } else if (growthFraction >= 0.25) {
          nextStage = 'vegetative';
        } else {
          nextStage = 'seedling';
        }

        return {
          ...plot,
          daysPlanted,
          waterLevel: currentWater,
          health,
          stage: nextStage,
        };
      });

      return {
        ...prev,
        day: nextDay,
        weatherCondition: nextWeather,
        plots: nextPlots,
      };
    });
  };

  const bulkPlant = (cropId: string) => {
    const cropConfig = FARM_CROPS.find((c) => c.id === cropId);
    if (!cropConfig) return;

    setFarm((prev) => {
      const emptyPlots = prev.plots.filter((p) => p.stage === 'empty');
      if (emptyPlots.length === 0) {
        setNotification('No empty plots available to plant.');
        return prev;
      }

      const affordableCount = Math.floor(prev.coins / cropConfig.seedCost);
      if (affordableCount <= 0) {
        playSound('alert', settings.soundEnabled);
        setNotification(`Not enough coins to plant ${cropConfig.name}. Need ${cropConfig.seedCost} per plot.`);
        return prev;
      }

      const toPlantCount = Math.min(emptyPlots.length, affordableCount);
      let remainingToPlant = toPlantCount;
      const totalCost = toPlantCount * cropConfig.seedCost;

      playSound('plant', settings.soundEnabled);
      const nextPlots = prev.plots.map((p) => {
        if (p.stage === 'empty' && remainingToPlant > 0) {
          remainingToPlant--;
          return {
            ...p,
            cropId: cropConfig.id,
            cropName: cropConfig.name,
            stage: 'seedling' as const,
            daysPlanted: 0,
            waterLevel: Math.max(40, p.waterLevel),
            fertilized: false,
            health: 100,
          };
        }
        return p;
      });

      setNotification(`Planted ${toPlantCount} ${cropConfig.name} plots for ${totalCost} coins.`);
      return {
        ...prev,
        coins: prev.coins - totalCost,
        plots: nextPlots,
      };
    });
  };

  const bulkWater = () => {
    playSound('water', settings.soundEnabled);
    setFarm((prev) => ({
      ...prev,
      plots: prev.plots.map((p) => ({
        ...p,
        waterLevel: Math.min(100, p.waterLevel + 40),
      })),
    }));
    setNotification('Irrigated all 64 plots with uniform moisture.');
  };

  const bulkHarvest = () => {
    setFarm((prev) => {
      const harvestable = prev.plots.filter((p) => p.stage === 'harvest_ready');
      if (harvestable.length === 0) {
        setNotification('No mature crops ready for harvest yet.');
        return prev;
      }

      let totalEarned = 0;
      harvestable.forEach((p) => {
        const cropConfig = FARM_CROPS.find((c) => c.id === p.cropId);
        const base = cropConfig ? cropConfig.salePrice : 25;
        const mult = (p.health / 100) * (p.fertilized ? 1.25 : 1.0);
        totalEarned += Math.round(base * mult);
      });

      playSound('harvest', settings.soundEnabled);

      const nextPlots = prev.plots.map((p) => {
        if (p.stage === 'harvest_ready') {
          return {
            ...p,
            cropId: null,
            cropName: null,
            stage: 'empty' as const,
            daysPlanted: 0,
            waterLevel: 40,
            fertilized: false,
            health: 100,
          };
        }
        return p;
      });

      setNotification(`Harvested ${harvestable.length} crops for +${totalEarned} coins!`);

      return {
        ...prev,
        coins: prev.coins + totalEarned,
        totalHarvested: prev.totalHarvested + harvestable.length,
        totalCoinsEarned: prev.totalCoinsEarned + totalEarned,
        plots: nextPlots,
      };
    });

    updateAchievementProgress('first-harvest', 1);
    updateAchievementProgress('green-thumb', 1);
    updateAchievementProgress('master-harvester', 1);
  };

  const resetFarm = () => {
    playSound('click', settings.soundEnabled);
    setFarm({
      ...DEFAULT_FARM,
      plots: createInitialPlots(8),
    });
    setNotification('Farm plots reset to default state.');
  };

  const recordCropPlannerRun = () => {
    setStats((prev) => {
      const nextRuns = prev.plannerRuns + 1;
      updateAchievementProgress('agronomist', nextRuns, true);
      return { ...prev, plannerRuns: nextRuns };
    });
  };

  const recordWeatherSimRun = (isExtreme: boolean) => {
    if (isExtreme) {
      setStats((prev) => {
        const nextRuns = prev.extremeWeatherRuns + 1;
        unlockAchievement('weather-resilient');
        return { ...prev, extremeWeatherRuns: nextRuns };
      });
    }
  };

  const exportAllData = (): string => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      profile,
      farm,
      achievements,
      stats,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importAllData = (jsonStr: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON file format.' };
      }

      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.profile) setProfile(parsed.profile);
      if (parsed.farm && Array.isArray(parsed.farm.plots)) setFarm(parsed.farm);
      if (parsed.achievements && Array.isArray(parsed.achievements)) setAchievements(parsed.achievements);
      if (parsed.stats) setStats(parsed.stats);

      playSound('achievement', settings.soundEnabled);
      return { success: true, message: 'Agricultural lab database imported successfully.' };
    } catch (e: unknown) {
      const err = e as Error;
      return { success: false, message: `Parse error: ${err.message}` };
    }
  };

  const resetAllData = () => {
    safeClearAll();
    setSettings(DEFAULT_SETTINGS);
    setProfile(DEFAULT_PROFILE);
    setFarm(DEFAULT_FARM);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setStats({ plannerRuns: 0, extremeWeatherRuns: 0 });
    playSound('click', true);
    setNotification('All laboratory records and virtual farm data have been reset to factory defaults.');
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        toggleTheme,
        toggleSound,
        profile,
        updateProfile,
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
        achievements,
        unlockAchievement,
        recordCropPlannerRun,
        recordWeatherSimRun,
        exportAllData,
        importAllData,
        resetAllData,
        notification,
        clearNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
