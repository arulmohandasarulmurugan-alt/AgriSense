export type SoilType = 'Loamy' | 'Clay' | 'Sandy' | 'Silt' | 'Peaty' | 'Chalky';
export type Season = 'Spring' | 'Summer' | 'Monsoon' | 'Autumn' | 'Winter';
export type ClimateRegion = 'Temperate' | 'Arid / Semi-Arid' | 'Tropical' | 'Mediterranean' | 'Continental';
export type WaterAvailability = 'Low (Drought-prone)' | 'Moderate' | 'Abundant (Irrigated)';

export interface CropRecommendation {
  id: string;
  name: string;
  category: 'Cereal' | 'Vegetable' | 'Legume' | 'Cash Crop' | 'Fiber';
  suitabilityScore: number; // 0 - 100
  expectedYield: string; // e.g. "4.8 tons/ha" or "1.9 tons/acre"
  growthDurationDays: number;
  waterDemand: 'Low' | 'Medium' | 'High';
  idealPh: string;
  soilMatch: number; // 0-100
  climateMatch: number; // 0-100
  waterMatch: number; // 0-100
  reason: string;
  bestPractices: string[];
}

export type PlotStage = 'empty' | 'seedling' | 'vegetative' | 'mature' | 'harvest_ready' | 'withered';

export interface FarmPlot {
  id: number;
  x: number;
  y: number;
  cropId: string | null;
  cropName: string | null;
  stage: PlotStage;
  daysPlanted: number;
  waterLevel: number; // 0 - 100
  fertilized: boolean;
  health: number; // 0 - 100
}

export interface FarmState {
  gridSize: number; // 8 = 8x8
  plots: FarmPlot[];
  day: number;
  coins: number;
  weatherCondition: 'Sunny' | 'Overcast' | 'Rainy' | 'Heatwave';
  totalHarvested: number;
  totalCoinsEarned: number;
}

export interface FarmerProfile {
  name: string;
  farmName: string;
  location: string;
  farmSize: number;
  sizeUnit: 'acres' | 'hectares';
  favoriteCrops: string[];
  avatarId: string;
  bio: string;
}

export interface AppSettings {
  landUnit: 'acres' | 'hectares';
  tempUnit: 'C' | 'F';
  soundEnabled: boolean;
  theme: 'dark' | 'light';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export interface PestDisease {
  id: string;
  name: string;
  scientificName: string;
  category: 'Fungal' | 'Insect Pest' | 'Bacterial' | 'Viral' | 'Nutritional Defect';
  cropsAffected: string[];
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  keySymptoms: string[];
  prevention: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  spreadRiskWeather: string;
}

export interface MarketCrop {
  id: string;
  name: string;
  category: string;
  currentPrice: number; // USD per ton or bushel
  prevPrice: number;
  priceUnit: string;
  volatility: 'Low' | 'Medium' | 'High';
  bestTimeToSell: string;
  seasonalPeakMonth: string;
  historicalPrices: { month: string; price: number }[];
  estimatedCostPerUnit: number;
  averageYieldPerUnit: number; // per acre or hectare
}

export interface WeatherSimParams {
  rainfallMm: number; // 0 - 300 mm/month
  temperatureC: number; // 5 - 45 °C
  humidityPct: number; // 10 - 100 %
  irrigationPct: number; // 0 - 100 %
  selectedCropId: string;
}
