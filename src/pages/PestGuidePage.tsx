import React, { useState, useMemo } from 'react';
import { PEST_AND_DISEASE_DATA } from '../data/pests';
import { PestDisease } from '../types';
import { EducationalDisclaimer } from '../components/common/EducationalDisclaimer';
import {
  Bug,
  Search,
  Filter,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  Leaf,
  X,
  CloudRain,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';

export const PestGuidePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<PestDisease | null>(null);

  // Quick symptom shortcut
  const [quickSymptom, setQuickSymptom] = useState<string>('');

  const cropList = useMemo(() => {
    const crops = new Set<string>();
    PEST_AND_DISEASE_DATA.forEach((item) => {
      item.cropsAffected.forEach((c) => crops.add(c));
    });
    return ['All', ...Array.from(crops).sort()];
  }, []);

  const filteredItems = useMemo(() => {
    return PEST_AND_DISEASE_DATA.filter((item) => {
      // Search query filter
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keySymptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Quick symptom filter
      const matchesQuickSymptom =
        quickSymptom === '' ||
        item.keySymptoms.some((s) => s.toLowerCase().includes(quickSymptom.toLowerCase()));

      // Crop filter
      const matchesCrop =
        selectedCrop === 'All' ||
        item.cropsAffected.some((c) => c.toLowerCase() === selectedCrop.toLowerCase());

      // Severity filter
      const matchesSeverity =
        selectedSeverity === 'All' || item.severity === selectedSeverity;

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesQuickSymptom && matchesCrop && matchesSeverity && matchesCategory;
    });
  }, [searchQuery, quickSymptom, selectedCrop, selectedSeverity, selectedCategory]);

  const severityBadgeClass = (sev: PestDisease['severity']) => {
    switch (sev) {
      case 'Critical':
        return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
      case 'High':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'Moderate':
        return 'text-yellow-300 bg-yellow-950/60 border-yellow-500/40';
      case 'Low':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-[#0c2419] via-[#091b13] to-[#081711] p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30">
              <Bug className="w-3.5 h-3.5" />
              <span>Plant Pathology & IPM Knowledgebase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display">
              Pest & Disease Diagnostic Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Explore 15 field pathogens, insect vectors, and nutritional disorders. Diagnose early foliar symptoms, execute preventive cultural practices, and apply certified biological and chemical treatments.
            </p>
          </div>

          <div className="md:col-span-4 hidden md:block">
            <div className="rounded-xl overflow-hidden border border-emerald-500/25 shadow-lg aspect-[4/3] bg-[#0c2419]">
              <img
                src="/src/assets/images/crop_health_inspection_1792651060974.jpg"
                alt="Close-up botanical inspection of crop foliage"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      <EducationalDisclaimer variant="banner" />

      {/* Search & Filter Deck */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pathogen name, scientific taxonomy, or symptom (e.g., 'wilting', 'halo', 'rot')..."
            className="w-full bg-[#071911] border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Crop Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Host Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-[#071911] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              {cropList.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Host Crops' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Outbreak Threat Severity
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-[#071911] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="All">All Severity Levels</option>
              <option value="Critical">Critical (Immediate Loss)</option>
              <option value="High">High (Severe Yield Cut)</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low (Manageable)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Biological Classification
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#071911] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="All">All Pathogen Classes</option>
              <option value="Fungal">Fungal Blight / Mildew</option>
              <option value="Insect Pest">Insect Pest</option>
              <option value="Bacterial">Bacterial Inoculum</option>
              <option value="Nutritional Defect">Nutritional & Abiotic</option>
            </select>
          </div>
        </div>

        {/* Quick Diagnostic Symptoms Selector */}
        <div className="pt-2 border-t border-emerald-500/10 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] mr-1">Quick Symptoms:</span>
          {['', 'wilting', 'yellowing', 'pustules', 'webbing', 'frass', 'lesions', 'calcium'].map((sym) => (
            <button
              key={sym || 'all'}
              onClick={() => setQuickSymptom(sym)}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                quickSymptom === sym
                  ? 'bg-emerald-400 text-emerald-950 font-bold'
                  : 'bg-emerald-950/40 border border-emerald-500/20 text-slate-300 hover:text-white'
              }`}
            >
              {sym || 'Any Symptom'}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredItems.length} of {PEST_AND_DISEASE_DATA.length} Diagnostic Profiles</span>
          {(searchQuery || selectedCrop !== 'All' || selectedSeverity !== 'All' || selectedCategory !== 'All' || quickSymptom) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCrop('All');
                setSelectedSeverity('All');
                setSelectedCategory('All');
                setQuickSymptom('');
              }}
              className="text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-emerald-500/20 space-y-3">
            <Bug className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-display font-semibold text-white text-base">No Pathogens Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No entries match your current search terms or filters. Try adjusting your search query or reset the filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="glass-panel glass-card-hover rounded-2xl p-5 border border-emerald-500/20 cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Category & Severity */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider ${severityBadgeClass(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  {/* Title & Scientific Name */}
                  <div>
                    <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs italic text-emerald-400/80 mt-0.5 font-mono">
                      {item.scientificName}
                    </p>
                  </div>

                  {/* Primary Symptom Preview */}
                  <div className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {item.keySymptoms[0]}
                  </div>

                  {/* Host Crops Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.cropsAffected.slice(0, 3).map((crop) => (
                      <span
                        key={crop}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#071a11] text-emerald-300 border border-emerald-500/20"
                      >
                        {crop}
                      </span>
                    ))}
                    {item.cropsAffected.length > 3 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{item.cropsAffected.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-emerald-500/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">View Remediation Protocol</span>
                  <div className="flex items-center text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-panel p-6 sm:p-8 rounded-2xl max-w-2xl w-full border border-emerald-500/30 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-emerald-500/20 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border uppercase tracking-wider ${severityBadgeClass(
                      activeModalItem.severity
                    )}`}
                  >
                    {activeModalItem.severity} Risk
                  </span>
                  <span className="text-xs text-slate-400">{activeModalItem.category}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white font-display">
                  {activeModalItem.name}
                </h2>
                <div className="text-xs italic text-emerald-400 font-mono mt-0.5">
                  {activeModalItem.scientificName}
                </div>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-950/60 transition-colors"
                aria-label="Close diagnostic modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Weather Risk Trigger */}
            <div className="p-3.5 rounded-xl bg-[#092217] border border-emerald-500/20 flex items-start gap-2.5 text-xs">
              <CloudRain className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sky-300 block mb-0.5">Atmospheric Spread Factor</span>
                <span className="text-slate-300">{activeModalItem.spreadRiskWeather}</span>
              </div>
            </div>

            {/* Affected Crops */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Susceptible Host Species
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {activeModalItem.cropsAffected.map((crop) => (
                  <span
                    key={crop}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#081e14] border border-emerald-500/25 text-emerald-300"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            {/* Symptoms Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Primary Diagnostic Symptoms</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeModalItem.keySymptoms.map((sym, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">▪</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention Protocols */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Cultural Prevention & Sanitation</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeModalItem.prevention.map((prev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">▪</span>
                    <span>{prev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organic Remediation */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>Organic & Biological Controls (IPM Preferred)</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeModalItem.organicTreatment.map((org, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-lime-400 mt-0.5">▪</span>
                    <span>{org}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chemical Fallback */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Emergency Chemical Interventions (Registered Actives)</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeModalItem.chemicalTreatment.map((chem, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">▪</span>
                    <span>{chem}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-emerald-500/20 flex justify-end">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
