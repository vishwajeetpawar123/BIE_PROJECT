import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CROPS_DATA } from '../../data/mockData';
import { 
  Sliders, 
  Thermometer, 
  Droplets, 
  Sparkles, 
  Zap, 
  RotateCcw,
  Wind
} from 'lucide-react';

export const TelemetryControl: React.FC = () => {
  const { 
    bays, 
    selectedBayId, 
    setSelectedBayId, 
    updateBayClimate, 
    toggleBayEmergencyMode, 
    toggleOzoneGenerator,
    telemetryLogs,
    theme 
  } = useApp();

  const isDark = theme === 'dark';
  const currentBay = bays.find(b => b.id === selectedBayId) || bays[0];
  const crop = currentBay.currentCrop ? CROPS_DATA[currentBay.currentCrop] : null;

  const [targetTemp, setTargetTemp] = useState<number>(currentBay.targetTemp);
  const [targetHumidity, setTargetHumidity] = useState<number>(currentBay.targetHumidity);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  useEffect(() => {
    setTargetTemp(currentBay.targetTemp);
    setTargetHumidity(currentBay.targetHumidity);
    setHasUnsavedChanges(false);
  }, [currentBay.id]);

  const handleApplyOverride = () => {
    updateBayClimate(currentBay.id, targetTemp, targetHumidity);
    setHasUnsavedChanges(false);
  };

  const handleResetToCropIdeal = () => {
    if (crop) {
      setTargetTemp(crop.idealTemp);
      setTargetHumidity(crop.idealHumidity);
      setHasUnsavedChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border-slate-800'
          : 'bg-gradient-to-r from-cyan-50 via-white to-indigo-50 border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
              <Sliders className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Live Telemetry & Climate Override Control
            </h2>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manual setpoint override, dynamic sensor telemetry stream, and automated HVAC modulation.
          </p>
        </div>

        {/* Bay Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {bays.map(b => {
            const isSelected = b.id === currentBay.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBayId(b.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : isDark
                    ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {b.bayNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Control Console & Real-time Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Manual Override Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border space-y-5 transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  isDark ? 'bg-cyan-950 text-cyan-400 border-cyan-800' : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                }`}>
                  {currentBay.bayNumber} Console
                </span>
                <h3 className={`text-base font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentBay.name}
                </h3>
              </div>

              {crop && (
                <button
                  onClick={handleResetToCropIdeal}
                  className="flex items-center gap-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Set Crop Ideal</span>
                </button>
              )}
            </div>

            {/* Current vs Target Readings */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3.5 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[10px] uppercase font-bold ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Temperature Status
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-xl font-black font-mono flex items-center gap-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    {currentBay.currentTemp}°C
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Target: <strong className="text-cyan-600 dark:text-cyan-400">{currentBay.targetTemp}°C</strong>
                  </span>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[10px] uppercase font-bold ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Humidity Status
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-xl font-black font-mono flex items-center gap-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    {currentBay.currentHumidity}%
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Target: <strong className="text-cyan-600 dark:text-cyan-400">{currentBay.targetHumidity}%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Temperature Override Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Thermometer className="w-4 h-4 text-rose-500" />
                  Override Target Temperature
                </span>
                <span className={`font-mono font-bold text-base px-2.5 py-0.5 rounded-lg border text-cyan-600 dark:text-cyan-400 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  {targetTemp}°C
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="25"
                step="0.5"
                value={targetTemp}
                onChange={e => {
                  setTargetTemp(Number(e.target.value));
                  setHasUnsavedChanges(true);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>4°C (Deep Chill)</span>
                <span>25°C (Ambient Aeration)</span>
              </div>
            </div>

            {/* Humidity Override Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  Override Target Relative Humidity
                </span>
                <span className={`font-mono font-bold text-base px-2.5 py-0.5 rounded-lg border text-cyan-600 dark:text-cyan-400 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  {targetHumidity}%
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="1"
                value={targetHumidity}
                onChange={e => {
                  setTargetHumidity(Number(e.target.value));
                  setHasUnsavedChanges(true);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>40% RH (Dry Grains)</span>
                <span>95% RH (Root Tubers)</span>
              </div>
            </div>

            {/* Apply Override Button */}
            <button
              onClick={handleApplyOverride}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-cyan-500/25 scale-[1.01]'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {hasUnsavedChanges ? 'Apply & Lock Climate Override' : 'Climate Setpoint Synchronized'}
            </button>

            {/* Emergency & HVAC System Toggles */}
            <div className={`pt-3 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Chamber Hardware & Sub-System Overrides:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleBayEmergencyMode(currentBay.id, 'rapid_freeze')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    currentBay.compressorMode === 'rapid_freeze'
                      ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-400'
                      : isDark
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Zap className="w-4 h-4 text-rose-500" />
                  <span>Rapid Pre-Cool (Boost)</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleBayEmergencyMode(currentBay.id, 'aeration')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    currentBay.compressorMode === 'aeration'
                      ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-400'
                      : isDark
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Wind className="w-4 h-4 text-cyan-500" />
                  <span>High-Flow Aeration</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleOzoneGenerator(currentBay.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    currentBay.ozoneGeneratorActive
                      ? 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-400'
                      : isDark
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Ozone Guard: {currentBay.ozoneGeneratorActive ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleBayEmergencyMode(currentBay.id, 'dehumidifying')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    currentBay.compressorMode === 'dehumidifying'
                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400'
                      : isDark
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Droplets className="w-4 h-4 text-amber-500" />
                  <span>Condensation Purge</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry Stream */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-2xl border flex flex-col h-full transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b mb-3 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Live Sensor Telemetry & Automation Feed
                </h3>
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                MQTT Stream @ 1Hz
              </span>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {telemetryLogs.map(log => {
                const isWarning = log.type === 'warning';
                const isOverride = log.type === 'override';
                const isCorrective = log.type === 'corrective';

                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                      isWarning
                        ? isDark
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                        : isOverride
                        ? isDark
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                          : 'bg-cyan-50 border-cyan-200 text-cyan-900'
                        : isCorrective
                        ? isDark
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                          : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        : isDark
                        ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Bay: {log.bayId.toUpperCase()} • {log.timestamp}
                      </span>
                      <span className={`font-bold px-1.5 py-0.2 rounded border ${
                        isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
                      }`}>
                        {log.type.toUpperCase()}
                      </span>
                    </div>

                    <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {log.actionTaken}
                    </div>

                    <div className={`mt-2 flex items-center gap-3 text-[10px] font-mono pt-1 border-t ${
                      isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}>
                      <span>Sensor: {log.temp}°C</span>
                      <span>RH: {log.humidity}%</span>
                      <span>CO₂: {log.co2Ppm} ppm</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
