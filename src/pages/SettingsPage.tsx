import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EducationalDisclaimer } from '../components/common/EducationalDisclaimer';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Maximize2,
  Thermometer,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Trash2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    toggleTheme,
    toggleSound,
    exportAllData,
    importAllData,
    resetAllData,
  } = useApp();

  const [importJsonText, setImportJsonText] = useState('');
  const [importFeedback, setImportFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Handle Export Download
  const handleDownloadExport = () => {
    const jsonString = exportAllData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agrisense_lab_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Copy to Clipboard
  const handleCopyExport = async () => {
    try {
      const jsonString = exportAllData();
      await navigator.clipboard.writeText(jsonString);
      setCopiedExport(true);
      setTimeout(() => setCopiedExport(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Handle File Upload for Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
      const res = importAllData(content);
      setImportFeedback(res);
    };
    reader.readAsText(file);
  };

  // Handle Text Import
  const handleTextImport = () => {
    if (!importJsonText.trim()) {
      setImportFeedback({ success: false, message: 'Please paste valid JSON data before importing.' });
      return;
    }
    const res = importAllData(importJsonText);
    setImportFeedback(res);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Preferences & Data Portability</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display">
          Settings & Data Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Configure measurement standards, audio feedback, export and restore your entire agricultural simulation database.
        </p>
      </div>

      <EducationalDisclaimer variant="banner" />

      {/* Preferences Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit Preferences Card */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-5">
          <div className="border-b border-emerald-500/15 pb-2">
            <h2 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-emerald-400" />
              <span>Scientific Measurement Units</span>
            </h2>
            <p className="text-xs text-slate-400">Toggle imperial or metric calculations across all pages</p>
          </div>

          {/* Land Unit */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Land Area Measurement
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ landUnit: 'acres' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                  settings.landUnit === 'acres'
                    ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                    : 'bg-[#081e14] border-emerald-500/15 text-slate-400 hover:text-white'
                }`}
              >
                Acres (Imperial)
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ landUnit: 'hectares' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                  settings.landUnit === 'hectares'
                    ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                    : 'bg-[#081e14] border-emerald-500/15 text-slate-400 hover:text-white'
                }`}
              >
                Hectares (Metric ha)
              </button>
            </div>
          </div>

          {/* Temperature Unit */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Thermal Calibration
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ tempUnit: 'C' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                  settings.tempUnit === 'C'
                    ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                    : 'bg-[#081e14] border-emerald-500/15 text-slate-400 hover:text-white'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ tempUnit: 'F' })}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                  settings.tempUnit === 'F'
                    ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                    : 'bg-[#081e14] border-emerald-500/15 text-slate-400 hover:text-white'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>
        </div>

        {/* Audio & Visual Theme */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-5">
          <div className="border-b border-emerald-500/15 pb-2">
            <h2 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-sky-400" />
              <span>Audio & Visual Environment</span>
            </h2>
            <p className="text-xs text-slate-400">Audio synthesis and dark/light theme controls</p>
          </div>

          {/* Audio Synthesizer */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#081e14] border border-emerald-500/15">
            <div>
              <div className="text-xs font-semibold text-white">Synthesizer Sound Effects</div>
              <div className="text-[11px] text-slate-400">
                Auditory chimes for planting, watering, and harvest milestones
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border transition-colors ${
                settings.soundEnabled
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-700 text-slate-500'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Theme Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#081e14] border border-emerald-500/15">
            <div>
              <div className="text-xs font-semibold text-white">Display Theme Mode</div>
              <div className="text-[11px] text-slate-400">
                Current: {settings.theme === 'dark' ? 'Forest Dark Mode' : 'Sunlight Light Mode'}
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-950/60 text-slate-200 hover:text-white transition-colors"
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Data Backup & Portability Lab */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/25 space-y-6">
        <div className="border-b border-emerald-500/15 pb-3">
          <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Data Lab: JSON Export & Import</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Export complete state as JSON to move between devices, or restore an existing backup
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Box */}
          <div className="p-4 rounded-xl bg-[#071911] border border-emerald-500/20 space-y-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Agricultural Database</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Downloads a snapshot containing your 64 farm field plots, unlocked achievements, coin balance, and farmer profile credentials.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={handleDownloadExport}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON Backup</span>
              </button>
              <button
                onClick={handleCopyExport}
                className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/25 text-slate-200 text-xs transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedExport ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>

          {/* Import Box */}
          <div className="p-4 rounded-xl bg-[#071911] border border-emerald-500/20 space-y-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-sky-400" />
              <span>Restore from Backup</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload a previously exported JSON backup file or paste the JSON text directly.
            </p>

            <div className="space-y-2">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 cursor-pointer"
              />

              <textarea
                rows={2}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Or paste raw JSON string here..."
                className="w-full bg-[#05140d] border border-emerald-500/25 rounded-xl p-2 text-[11px] text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />

              <button
                onClick={handleTextImport}
                className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Validate & Import</span>
              </button>
            </div>

            {importFeedback && (
              <div
                className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${
                  importFeedback.success
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                }`}
              >
                {importFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{importFeedback.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-950/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2 text-rose-400">
              <Trash2 className="w-4 h-4" />
              <span>Laboratory Factory Reset</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-lg">
              Permanently purges all localStorage keys: field plot grid, coin balance, achievement progress, and farmer profile credentials.
            </p>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors whitespace-nowrap shadow-md shadow-rose-950"
          >
            Reset All Records
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-rose-500/40 space-y-4">
            <h3 className="font-display font-bold text-white text-lg flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Confirm Complete Laboratory Reset?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure? This cannot be undone. All virtual farm plots, coin balances, achievement badges, and customized profile notes will be erased and returned to factory state.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-emerald-950/60 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
