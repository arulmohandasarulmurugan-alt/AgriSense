import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Menu,
  X,
  Sprout,
  Coins,
  Settings as SettingsIcon,
  User,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, toggleTheme, toggleSound, farm } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/planner', label: 'Crop Planner' },
    { to: '/farm', label: 'Virtual Farm' },
    { to: '/simulator', label: 'Weather Lab' },
    { to: '/pests', label: 'Disease Guide' },
    { to: '/market', label: 'Markets' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/15 bg-[#081711]/90 backdrop-blur-md dark:bg-[#081711]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/25 transition-colors">
            <Sprout className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="font-display font-bold text-lg text-emerald-50">AgriSense</span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Quick Status & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Farm Coin Balance */}
          <Link
            to="/farm"
            title="Current Virtual Farm Coins"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-amber-300 text-xs font-mono font-medium hover:bg-emerald-900/60 transition-colors"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="tabular-nums font-bold">{farm.coins}</span>
          </Link>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={settings.soundEnabled ? 'Mute simulation audio' : 'Unmute simulation audio'}
            aria-label={settings.soundEnabled ? 'Mute audio' : 'Unmute audio'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/20 transition-colors"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle visual theme"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/20 transition-colors"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-400" />
            )}
          </button>

          {/* Profile Shortcut */}
          <Link
            to="/profile"
            title="Farmer Profile & Achievements"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/20 transition-colors"
          >
            <User className="w-4 h-4" />
          </Link>

          {/* Settings Shortcut */}
          <Link
            to="/settings"
            title="Data Lab & Settings"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/20 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </Link>

          {/* Primary CTA */}
          <Link
            to="/farm"
            className="hidden lg:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-emerald-950"
          >
            Launch Farm
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-500/20 bg-[#07150f] px-4 pt-2 pb-6 space-y-1">
          <div className="flex items-center justify-between py-2 border-b border-emerald-900/50 mb-2">
            <span className="text-xs text-slate-400">Simulation Day {farm.day}</span>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{farm.coins} Coins</span>
            </div>
          </div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-300 hover:bg-emerald-900/30 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 flex items-center gap-2">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-slate-200"
            >
              Profile & Badges
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-slate-200"
            >
              Settings & Data
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
