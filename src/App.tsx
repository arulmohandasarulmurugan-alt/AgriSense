/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { CropPlannerPage } from './pages/CropPlannerPage';
import { VirtualFarmPage } from './pages/VirtualFarmPage';
import { WeatherSimulatorPage } from './pages/WeatherSimulatorPage';
import { PestGuidePage } from './pages/PestGuidePage';
import { MarketDashboardPage } from './pages/MarketDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#081711] text-slate-100 transition-colors duration-200">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/planner" element={<CropPlannerPage />} />
              <Route path="/farm" element={<VirtualFarmPage />} />
              <Route path="/simulator" element={<WeatherSimulatorPage />} />
              <Route path="/pests" element={<PestGuidePage />} />
              <Route path="/market" element={<MarketDashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
