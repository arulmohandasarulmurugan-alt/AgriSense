import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FarmerProfile } from '../types';
import { EducationalDisclaimer } from '../components/common/EducationalDisclaimer';
import {
  User,
  ShieldCheck,
  Award,
  Sprout,
  Coins,
  Calendar,
  Save,
  CheckCircle2,
  Lock,
  Layers,
  MapPin,
  Maximize2,
} from 'lucide-react';

const AVATAR_OPTIONS = [
  { id: 'avatar-1', label: 'Precision Agronomist', emoji: '🧑‍🌾', role: 'Telemetry & Soil Sensor Specialist' },
  { id: 'avatar-2', label: 'Hydroponics Engineer', emoji: '👩‍🔬', role: 'Closed-Loop Nutrient Architect' },
  { id: 'avatar-3', label: 'Master Permaculturist', emoji: '👨‍🌾', role: 'Regenerative Polyculture Lead' },
  { id: 'avatar-4', label: 'Agri-Tech Roboticist', emoji: '🤖', role: 'Autonomous Rover & Drone Pilot' },
  { id: 'avatar-5', label: 'Microbial Ecologist', emoji: '🧬', role: 'Rhizosphere Biome Researcher' },
  { id: 'avatar-6', label: 'Orchard & Vineyardist', emoji: '🍇', role: 'Canopy & Microclimate Specialist' },
];

const CROP_OPTIONS = [
  { id: 'wheat', name: 'Wheat' },
  { id: 'corn', name: 'Corn' },
  { id: 'tomato', name: 'Tomato' },
  { id: 'rice', name: 'Rice' },
  { id: 'potato', name: 'Potato' },
  { id: 'carrot', name: 'Carrot' },
  { id: 'sunflower', name: 'Sunflower' },
  { id: 'cotton', name: 'Cotton' },
  { id: 'soybean', name: 'Soybean' },
];

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, achievements, farm, settings, notification } = useApp();

  const [formData, setFormData] = useState<FarmerProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleFavoriteCrop = (cropId: string) => {
    setFormData((prev) => {
      const exists = prev.favoriteCrops.includes(cropId);
      const nextCrops = exists
        ? prev.favoriteCrops.filter((c) => c !== cropId)
        : [...prev.favoriteCrops, cropId];
      return { ...prev, favoriteCrops: nextCrops };
    });
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === formData.avatarId) || AVATAR_OPTIONS[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-950/60 px-3 py-1 rounded-full border border-teal-500/20 mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Personnel & Accreditation Dossier</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display">
          Farmer Profile & Laboratory Achievements
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Manage your agricultural persona, credential preferences, favorite cultivars, and review earned simulation badges.
        </p>
      </div>

      <EducationalDisclaimer variant="banner" />

      {/* Quick Career Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-emerald-500/15">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulation Days</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {farm.day}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/15">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Sprout className="w-3.5 h-3.5 text-lime-400" />
            <span>Lifetime Harvests</span>
          </div>
          <div className="text-2xl font-bold text-lime-400 font-mono mt-1 tabular-nums">
            {farm.totalHarvested} plots
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/15">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Farm Treasury</span>
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1 tabular-nums">
            {farm.coins} coins
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/15">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Award className="w-3.5 h-3.5 text-teal-400" />
            <span>Accreditations</span>
          </div>
          <div className="text-2xl font-bold text-teal-300 font-mono mt-1 tabular-nums">
            {unlockedCount} / {achievements.length}
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Badges Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Form (6 Cols) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-emerald-500/25 space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
            <div>
              <h2 className="font-display font-bold text-white text-lg">Farmer Persona Details</h2>
              <p className="text-xs text-slate-400">Saved locally in browser storage</p>
            </div>
            <span className="text-2xl">{currentAvatar.emoji}</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Choose Laboratory Avatar
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setFormData({ ...formData, avatarId: av.id })}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      formData.avatarId === av.id
                        ? 'bg-emerald-500/25 border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-[#081f15]/60 border-emerald-500/15 hover:border-emerald-500/40'
                    }`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
                    <span className="text-[11px] font-semibold text-white truncate max-w-full">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Farm Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Farmer / Agronomist Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Farmstead / Research Lab Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Location & Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Geographic Location / Zone
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Farm Size ({settings.landUnit})
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={formData.farmSize}
                  onChange={(e) => setFormData({ ...formData, farmSize: Number(e.target.value) })}
                  className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs font-mono rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Favorite Crops */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Primary Cultivar Focus (Multiselect)
              </label>
              <div className="flex flex-wrap gap-2">
                {CROP_OPTIONS.map((c) => {
                  const isChecked = formData.favoriteCrops.includes(c.id);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleFavoriteCrop(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isChecked
                          ? 'bg-emerald-400 text-emerald-950 font-bold border-emerald-400 shadow-sm'
                          : 'bg-[#081e14]/60 border-emerald-500/20 text-slate-300 hover:border-emerald-500/40'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Agronomic Mission & Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-[#071911] border border-emerald-500/30 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            {savedSuccess && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-400/40 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Profile updated and committed to local storage!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-950"
            >
              <Save className="w-4 h-4" />
              <span>Save Farmer Profile</span>
            </button>
          </form>
        </div>

        {/* Achievements Showcase (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
            <div>
              <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <span>Earned Accreditations & Badges</span>
              </h2>
              <p className="text-xs text-slate-400">Unlock milestones through simulation & farming</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {unlockedCount} / {achievements.length} Unlocked
            </span>
          </div>

          <div className="space-y-3">
            {achievements.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  item.unlocked
                    ? 'glass-panel border-emerald-400/40 bg-gradient-to-r from-[#0d2a1c] to-[#081c13]'
                    : 'bg-[#06160e]/50 border-emerald-500/10 opacity-70'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    item.unlocked
                      ? 'bg-emerald-400/20 border border-emerald-400/50'
                      : 'bg-slate-800/40 border border-slate-700/40 grayscale'
                  }`}
                >
                  {item.unlocked ? item.icon : <Lock className="w-4 h-4 text-slate-500" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold text-xs font-display ${
                        item.unlocked ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {item.title}
                    </h3>
                    {item.unlocked && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Unlocked {item.unlockedAt || 'Today'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                  {/* Progress Bar */}
                  <div className="pt-1.5 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Progress</span>
                      <span>
                        {item.progress} / {item.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.unlocked ? 'bg-emerald-400' : 'bg-slate-600'}`}
                        style={{
                          width: `${Math.min(100, (item.progress / item.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
