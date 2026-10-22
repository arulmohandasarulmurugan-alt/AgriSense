import { SoilType, Season, ClimateRegion, WaterAvailability, CropRecommendation } from '../types';

export interface FarmCropType {
  id: string;
  name: string;
  seedCost: number; // in virtual coins
  salePrice: number; // in virtual coins
  growthDays: number;
  waterNeed: number; // water consumed per day (1-100)
  color: string;
  badge: string;
  description: string;
}

export const FARM_CROPS: FarmCropType[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    seedCost: 10,
    salePrice: 28,
    growthDays: 4,
    waterNeed: 15,
    color: '#eab308',
    badge: '🌾',
    description: 'Resilient cereal with steady returns and moderate water needs.',
  },
  {
    id: 'corn',
    name: 'Sweet Corn',
    seedCost: 15,
    salePrice: 42,
    growthDays: 5,
    waterNeed: 22,
    color: '#facc15',
    badge: '🌽',
    description: 'High biomass grain thriving under warm sunlight.',
  },
  {
    id: 'tomato',
    name: 'Vine Tomato',
    seedCost: 20,
    salePrice: 65,
    growthDays: 6,
    waterNeed: 28,
    color: '#ef4444',
    badge: '🍅',
    description: 'High-value fruit requiring diligent moisture regulation.',
  },
  {
    id: 'rice',
    name: 'Paddy Rice',
    seedCost: 25,
    salePrice: 75,
    growthDays: 7,
    waterNeed: 40,
    color: '#84cc16',
    badge: '🌱',
    description: 'Submerged cereal crop demanding heavy hydration.',
  },
  {
    id: 'potato',
    name: 'Russet Potato',
    seedCost: 18,
    salePrice: 50,
    growthDays: 5,
    waterNeed: 18,
    color: '#d97706',
    badge: '🥔',
    description: 'Hardy root tuber well suited to loose, well-draining soils.',
  },
  {
    id: 'carrot',
    name: 'Crisp Carrot',
    seedCost: 12,
    salePrice: 35,
    growthDays: 4,
    waterNeed: 14,
    color: '#f97316',
    badge: '🥕',
    description: 'Fast-cycle root vegetable ideal for sandy loam.',
  },
  {
    id: 'sunflower',
    name: 'Oil Sunflower',
    seedCost: 22,
    salePrice: 68,
    growthDays: 6,
    waterNeed: 16,
    color: '#fbbf24',
    badge: '🌻',
    description: 'Deep-rooted oilseed with drought resistance.',
  },
  {
    id: 'cotton',
    name: 'Fiber Cotton',
    seedCost: 30,
    salePrice: 95,
    growthDays: 8,
    waterNeed: 25,
    color: '#38bdf8',
    badge: '☁️',
    description: 'Premium fiber crop flourishing in sunny, long seasons.',
  },
];

interface RawCropRule {
  id: string;
  name: string;
  category: CropRecommendation['category'];
  preferredSoils: Record<SoilType, number>; // 0 to 100
  preferredSeasons: Record<Season, number>;
  preferredRegions: Record<ClimateRegion, number>;
  preferredWater: Record<WaterAvailability, number>;
  baseYieldTonsPerHa: number;
  durationDays: number;
  waterDemand: 'Low' | 'Medium' | 'High';
  idealPh: string;
  reasonTemplate: string;
  bestPractices: string[];
}

export const CROP_RULES: RawCropRule[] = [
  {
    id: 'wheat',
    name: 'Winter / Spring Wheat',
    category: 'Cereal',
    preferredSoils: { Loamy: 100, Clay: 85, Silt: 90, Sandy: 50, Peaty: 45, Chalky: 70 },
    preferredSeasons: { Spring: 90, Winter: 95, Autumn: 85, Summer: 50, Monsoon: 40 },
    preferredRegions: { Temperate: 95, Continental: 90, Mediterranean: 80, 'Arid / Semi-Arid': 60, Tropical: 35 },
    preferredWater: { Moderate: 95, 'Low (Drought-prone)': 70, 'Abundant (Irrigated)': 75 },
    baseYieldTonsPerHa: 4.6,
    durationDays: 120,
    waterDemand: 'Medium',
    idealPh: '6.0 - 7.0',
    reasonTemplate: 'Excels in cool-to-mild climates with loamy or structured silt soils, maintaining resilient yield under moderate watering.',
    bestPractices: ['Maintain uniform seeding depth (3-4 cm)', 'Apply split nitrogen at tillering', 'Monitor for stem rust after rainfall'],
  },
  {
    id: 'maize',
    name: 'Field Maize (Corn)',
    category: 'Cereal',
    preferredSoils: { Loamy: 95, Silt: 90, Clay: 75, Sandy: 60, Peaty: 55, Chalky: 65 },
    preferredSeasons: { Summer: 95, Spring: 85, Monsoon: 80, Autumn: 45, Winter: 20 },
    preferredRegions: { Temperate: 90, Tropical: 85, Continental: 80, Mediterranean: 75, 'Arid / Semi-Arid': 50 },
    preferredWater: { 'Abundant (Irrigated)': 95, Moderate: 85, 'Low (Drought-prone)': 40 },
    baseYieldTonsPerHa: 8.2,
    durationDays: 105,
    waterDemand: 'High',
    idealPh: '5.8 - 6.8',
    reasonTemplate: 'Rapid vegetative growth demands abundant solar radiation and reliable irrigation during the silking stage.',
    bestPractices: ['Pre-irrigate before tasseling', 'Ensure zinc micronutrient availability', 'Keep weed-free in first 30 days'],
  },
  {
    id: 'rice',
    name: 'Paddy Rice',
    category: 'Cereal',
    preferredSoils: { Clay: 98, Silt: 90, Loamy: 75, Peaty: 65, Sandy: 25, Chalky: 30 },
    preferredSeasons: { Monsoon: 100, Summer: 85, Spring: 60, Autumn: 40, Winter: 15 },
    preferredRegions: { Tropical: 100, Temperate: 70, Mediterranean: 65, Continental: 40, 'Arid / Semi-Arid': 20 },
    preferredWater: { 'Abundant (Irrigated)': 100, Moderate: 50, 'Low (Drought-prone)': 15 },
    baseYieldTonsPerHa: 5.8,
    durationDays: 130,
    waterDemand: 'High',
    idealPh: '5.5 - 6.5',
    reasonTemplate: 'Heavy clay soils retain standing water vital for optimal root aeration and pest suppression.',
    bestPractices: ['Maintain 3-5 cm shallow water layer during vegetative growth', 'Alternate wetting and drying (AWD) to cut methane', 'Topdress with potassium at panicle initiation'],
  },
  {
    id: 'soybean',
    name: 'Soybean',
    category: 'Legume',
    preferredSoils: { Loamy: 95, Silt: 85, Clay: 75, Sandy: 60, Peaty: 50, Chalky: 60 },
    preferredSeasons: { Summer: 90, Monsoon: 85, Spring: 75, Autumn: 50, Winter: 20 },
    preferredRegions: { Temperate: 92, Continental: 88, Tropical: 80, Mediterranean: 70, 'Arid / Semi-Arid': 45 },
    preferredWater: { Moderate: 92, 'Abundant (Irrigated)': 85, 'Low (Drought-prone)': 50 },
    baseYieldTonsPerHa: 3.1,
    durationDays: 95,
    waterDemand: 'Medium',
    idealPh: '6.0 - 6.8',
    reasonTemplate: 'Biological nitrogen fixation enriches soil nitrogen while delivering dependable high-protein grain harvests.',
    bestPractices: ['Inoculate seed with Bradyrhizobium', 'Avoid planting in cold soils below 15°C', 'Scout for pod borers at early pod fill'],
  },
  {
    id: 'tomato',
    name: 'Processing Tomato',
    category: 'Vegetable',
    preferredSoils: { Loamy: 98, Sandy: 80, Silt: 85, Clay: 60, Peaty: 55, Chalky: 65 },
    preferredSeasons: { Spring: 90, Summer: 85, Autumn: 70, Winter: 40, Monsoon: 45 },
    preferredRegions: { Mediterranean: 98, Temperate: 85, Tropical: 75, 'Arid / Semi-Arid': 70, Continental: 65 },
    preferredWater: { Moderate: 90, 'Abundant (Irrigated)': 92, 'Low (Drought-prone)': 45 },
    baseYieldTonsPerHa: 38.0,
    durationDays: 85,
    waterDemand: 'Medium',
    idealPh: '6.2 - 6.8',
    reasonTemplate: 'Flourishes in well-drained loams with consistent drip irrigation to avert blossom end rot and foliar blight.',
    bestPractices: ['Use drip irrigation to keep foliage dry', 'Provide calcium balance against blossom rot', 'Trellis or mulch to elevate vines'],
  },
  {
    id: 'potato',
    name: 'Seed Potato',
    category: 'Vegetable',
    preferredSoils: { Sandy: 92, Loamy: 95, Silt: 80, Peaty: 75, Clay: 45, Chalky: 50 },
    preferredSeasons: { Spring: 92, Autumn: 85, Winter: 75, Summer: 50, Monsoon: 40 },
    preferredRegions: { Temperate: 95, Continental: 85, Mediterranean: 80, Tropical: 60, 'Arid / Semi-Arid': 50 },
    preferredWater: { Moderate: 90, 'Abundant (Irrigated)': 85, 'Low (Drought-prone)': 45 },
    baseYieldTonsPerHa: 26.5,
    durationDays: 90,
    waterDemand: 'Medium',
    idealPh: '5.2 - 6.4',
    reasonTemplate: 'Prefers loose, slightly acidic friable soils allowing unimpeded tuber expansion without skin scabbing.',
    bestPractices: ['Ridge soil at 15 cm shoot height to cover tubers', 'Ensure uniform moisture during tuber initiation', 'Prevent waterlogging to stop late blight'],
  },
  {
    id: 'cotton',
    name: 'Upland Cotton',
    category: 'Fiber',
    preferredSoils: { Clay: 85, Loamy: 90, Silt: 80, Sandy: 55, Chalky: 70, Peaty: 40 },
    preferredSeasons: { Summer: 95, Spring: 80, Monsoon: 70, Autumn: 60, Winter: 20 },
    preferredRegions: { 'Arid / Semi-Arid': 92, Tropical: 88, Mediterranean: 85, Temperate: 65, Continental: 50 },
    preferredWater: { Moderate: 85, 'Abundant (Irrigated)': 90, 'Low (Drought-prone)': 65 },
    baseYieldTonsPerHa: 2.2,
    durationDays: 150,
    waterDemand: 'Medium',
    idealPh: '5.8 - 7.5',
    reasonTemplate: 'Loves prolonged heat units and deep root anchoring in warm fertile loams or clays with good subsoil drainage.',
    bestPractices: ['Monitor boll weevil traps weekly', 'Cease excessive watering prior to boll opening', 'Apply defoliant when 60% bolls open'],
  },
  {
    id: 'chickpea',
    name: 'Desi / Kabuli Chickpea',
    category: 'Legume',
    preferredSoils: { Loamy: 90, Sandy: 85, Clay: 75, Chalky: 80, Silt: 75, Peaty: 40 },
    preferredSeasons: { Winter: 95, Autumn: 85, Spring: 75, Summer: 30, Monsoon: 25 },
    preferredRegions: { 'Arid / Semi-Arid': 95, Mediterranean: 90, Continental: 75, Temperate: 70, Tropical: 50 },
    preferredWater: { 'Low (Drought-prone)': 95, Moderate: 80, 'Abundant (Irrigated)': 45 },
    baseYieldTonsPerHa: 1.8,
    durationDays: 100,
    waterDemand: 'Low',
    idealPh: '6.0 - 7.8',
    reasonTemplate: 'Outstanding drought tolerance; thrives on residual soil moisture in cool dry season with low disease pressure.',
    bestPractices: ['Avoid heavy wet soils to eliminate Ascochyta blight', 'Harvest promptly once foliage turns golden bronze', 'Rotate after heavy cereals'],
  },
  {
    id: 'sunflower',
    name: 'Oilseed Sunflower',
    category: 'Cash Crop',
    preferredSoils: { Loamy: 90, Sandy: 85, Clay: 75, Chalky: 80, Silt: 80, Peaty: 50 },
    preferredSeasons: { Summer: 92, Spring: 88, Autumn: 65, Monsoon: 60, Winter: 30 },
    preferredRegions: { 'Arid / Semi-Arid': 92, Continental: 88, Temperate: 85, Mediterranean: 82, Tropical: 70 },
    preferredWater: { 'Low (Drought-prone)': 85, Moderate: 92, 'Abundant (Irrigated)': 80 },
    baseYieldTonsPerHa: 2.4,
    durationDays: 85,
    waterDemand: 'Low',
    idealPh: '6.0 - 7.5',
    reasonTemplate: 'Extensive taproot extracts deep moisture and nutrients, yielding golden seeds rich in heart-healthy oils.',
    bestPractices: ['Protect young seedlings from bird foraging', 'Ensure bee pollinators at anthesis', 'Desiccate heads when back of flower turns yellow-brown'],
  },
  {
    id: 'sugarcane',
    name: 'Cane Sugarcane',
    category: 'Cash Crop',
    preferredSoils: { Loamy: 95, Clay: 85, Silt: 85, Peaty: 65, Sandy: 50, Chalky: 50 },
    preferredSeasons: { Spring: 90, Summer: 92, Monsoon: 95, Autumn: 60, Winter: 40 },
    preferredRegions: { Tropical: 98, Mediterranean: 75, 'Arid / Semi-Arid': 60, Temperate: 40, Continental: 25 },
    preferredWater: { 'Abundant (Irrigated)': 98, Moderate: 70, 'Low (Drought-prone)': 25 },
    baseYieldTonsPerHa: 75.0,
    durationDays: 270,
    waterDemand: 'High',
    idealPh: '6.0 - 7.5',
    reasonTemplate: 'Perennial giant grass converting intense tropical sunshine and continuous irrigation into sucrose.',
    bestPractices: ['Maintain furrow or drip line trash blanket', 'Earthing up at 90 days to prevent lodging', 'Ripening stage requires withholding water for sucrose concentration'],
  },
];

/**
 * Transparent Rules-Based Scoring Formula:
 * Suitability = (SoilMatch * 0.30) + (SeasonMatch * 0.25) + (ClimateMatch * 0.25) + (WaterMatch * 0.20)
 * Modified by land scale factor.
 */
export function calculateCropSuitability(
  soil: SoilType,
  season: Season,
  region: ClimateRegion,
  water: WaterAvailability,
  landSize: number,
  landUnit: 'acres' | 'hectares'
): CropRecommendation[] {
  const scoredCrops = CROP_RULES.map((rule) => {
    const soilScore = rule.preferredSoils[soil] ?? 60;
    const seasonScore = rule.preferredSeasons[season] ?? 60;
    const climateScore = rule.preferredRegions[region] ?? 60;
    const waterScore = rule.preferredWater[water] ?? 60;

    const weightedScore = Math.round(
      soilScore * 0.3 +
      seasonScore * 0.25 +
      climateScore * 0.25 +
      waterScore * 0.2
    );

    // Yield calculation adjusted for land unit and environmental penalty/boost
    const yieldMultiplier = (weightedScore / 100) * 1.05;
    let yieldValue = rule.baseYieldTonsPerHa * yieldMultiplier;
    let yieldStr = '';

    if (landUnit === 'acres') {
      // 1 ha = 2.47105 acres -> tons/acre = tons/ha / 2.471
      const yieldPerAcre = yieldValue / 2.471;
      const totalExpected = yieldPerAcre * landSize;
      yieldStr = `${yieldPerAcre.toFixed(1)} t/acre (Total ~${totalExpected.toFixed(1)} t)`;
    } else {
      const totalExpected = yieldValue * landSize;
      yieldStr = `${yieldValue.toFixed(1)} t/ha (Total ~${totalExpected.toFixed(1)} t)`;
    }

    return {
      id: rule.id,
      name: rule.name,
      category: rule.category,
      suitabilityScore: Math.min(99, Math.max(25, weightedScore)),
      expectedYield: yieldStr,
      growthDurationDays: rule.durationDays,
      waterDemand: rule.waterDemand,
      idealPh: rule.idealPh,
      soilMatch: soilScore,
      climateMatch: climateScore,
      waterMatch: waterScore,
      reason: rule.reasonTemplate,
      bestPractices: rule.bestPractices,
    };
  });

  // Sort descending by suitabilityScore
  return scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
