# AgriSense — Smart Farming & Crop Intelligence Lab

> **Tagline:** Grow Smarter. Simulate Before You Sow.

AgriSense is a production-grade, responsive, multi-page agricultural simulation laboratory and crop planning application. Built with React, Vite, Tailwind CSS, React Router, and Recharts, it eliminates guess-work in farming by letting users simulate environmental stressors, plan crop rotations, manage a 64-plot virtual farm, and track agricultural commodity economics before planting in the field.

*Note: All figures are simulated for educational purposes, not real agronomic advice.*

---

## 🌾 Key Simulation Modules

1. **Overview & Agri-Intelligence Lab (Home)**
   - Hero banner with high-resolution smart agriculture greenhouse imagery.
   - Live telemetry stats counters (virtual harvests, field capacity, lifetime coin yields).
   - Rotating daily "Farm Tip" cards with scientific agronomy advice.
   - Quick launch triggers into all specialized simulation suites.

2. **Crop Suitability Planner (`/planner`)**
   - Calibrates 5 environmental variables: Soil Type, Sowing Season, Climate Region, Water Availability, and Planned Acreage.
   - Transparent rules-based mathematical scoring engine:
     $$\text{Suitability} = (\text{Soil} \times 30\%) + (\text{Season} \times 25\%) + (\text{Region} \times 25\%) + (\text{Water} \times 20\%)$$
   - Outputs top 3 ranked crops with yield projections (t/acre or t/ha), growth cycle duration, best practices, and direct actions to plant in the Virtual Farm or simulate in the Weather Lab.

3. **Virtual 8×8 Farm Field (`/farm`)**
   - 64 interactive plots with simulated growth stages: *Empty Fallow Soil*, *Seedling*, *Vegetative*, *Mature*, *Harvest-Ready*, and *Withered*.
   - Cultivar seed catalog: Wheat, Sweet Corn, Vine Tomato, Paddy Rice, Russet Potato, Crisp Carrot, Oil Sunflower, and Fiber Cotton.
   - Dynamic moisture evaporation and climate cycles (Sunny, Overcast, Rainy, Heatwave).
   - Plot telemetry inspector and bulk actions (*Plant All Empty*, *Water All Plots*, *Harvest All Ready*).
   - Audio feedback synthesizer (Web Audio API) for planting, watering, and harvesting.

4. **Weather & Irrigation Simulator (`/simulator`)**
   - Interactive sliders for Monthly Rainfall (0–300 mm), Temperature (5–45°C or °F), Humidity (10–100% RH), and Drip Irrigation (0–100%).
   - Dynamic Hargreaves-Samani evapotranspiration ($ET_0$) calculation.
   - Real-time Water-Stress Gauge, Yield Prediction meter, and adaptive agronomic advice callout.
   - 30-Day Simulated Soil Moisture Profile chart powered by Recharts.
   - Scenario presets: *Severe Drought*, *Monsoon Deluge*, *Optimal Balanced*, and *Heatwave Crisis*.

5. **Pest & Pathogen Diagnostic Guide (`/pests`)**
   - Searchable database of 15 major agricultural pests, fungi, bacteria, and physiological disorders (Late Blight, Fall Armyworm, Aphids, Bacterial Wilt, Stem Rust, etc.).
   - Multi-filtering by host crop, biological classification, outbreak threat severity, and quick symptom tags.
   - In-depth detail modal with symptoms, environmental spread triggers, cultural prevention, organic/biological IPM remedies, and registered chemical options.

6. **Commodity Market Dashboard (`/market`)**
   - Interactive price trend charts for 8 benchmark agricultural commodities.
   - Synchronized 2-crop comparison line chart over 3M, 6M, and 12M time horizons.
   - Best-time-to-sell indicator based on historical seasonal supply dips.
   - Field Profit & Revenue Calculator (Seed, Fertilizer, Water, Labor costs vs Gross Yield = Net Profit & ROI %).

7. **Farmer Profile & Accreditations (`/profile`)**
   - Customizable farmer persona, location, farm size, favorite cultivars, and avatar choices.
   - Gamified Achievement Progression System: *First Harvest*, *Green Thumb*, *Master Harvester*, *Water Wise*, *Market Mogul*, *Precision Agronomist*, *Crisis Simulator*, and *Agro-Biodiversity*.

8. **Settings & Data Lab (`/settings`)**
   - Measurement unit toggles (Acres/Hectares, °C/°F).
   - Audio synthesizer toggle and Forest Dark / Sunlight Light theme modes.
   - Complete JSON Export & Import with schema validation.
   - Factory reset with confirmation modal.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 with custom glassmorphism utilities and responsive breakpoints (360px mobile, 768px tablet, 1280px+ desktop)
- **Routing:** React Router v7 (`react-router-dom`) with `public/_redirects` for single-page app (SPA) fallback
- **Data Visualization:** Recharts for responsive line graphs
- **Icons:** Lucide React
- **Audio:** Web Audio API sound synthesis (zero external audio file dependencies)
- **Persistence:** LocalStorage with universal `try/catch` error boundaries (`src/utils/storage.ts`)

---

## 🚀 Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

3. **Validate and build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Production Deployment

- **Netlify / Vercel / Cloud Run:**
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - SPA Routing: Ensured by `/public/_redirects` mapping `/* /index.html 200`.
