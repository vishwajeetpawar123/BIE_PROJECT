import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CROPS_DATA } from '../../data/mockData';
import { 
  Sliders, 
  Thermometer, 
  Droplets, 
  Activity, 
  Fan, 
  Sparkles, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw,
  ShieldAlert,
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
    telemetryLogs 
  } = useApp();

  const currentBay = bays.find(b => b.id === selectedBayId) || bays[0];
  const crop = currentBay.currentCrop ? CROPS_DATA[currentBay.currentCrop] : null;

  // Local override controls initialized from bay's current targets
  const [targetTemp, setTargetTemp] = useState<number>(currentBay.targetTemp);
  const [targetHumidity, setTargetHumidity] = useState<number>(currentBay.targetHumidity);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sync inputs when selected bay changes
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Live Telemetry & Climate Override Control
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
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
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {b.bayNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Control Console (6 cols) & Real-time Log Stream (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Manual Override Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                  {currentBay.bayNumber} Console
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {currentBay.name}
                </h3>
              </div>

              {crop && (
                <button
                  onClick={handleResetToCropIdeal}
                  className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Set Crop Ideal</span>
                </button>
              )}
            </div>

            {/* Current vs Target Readings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">
                  Temperature Status
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-black font-mono text-white flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    {currentBay.currentTemp}°C
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Target: <strong className="text-cyan-400">{currentBay.targetTemp}°C</strong>
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">
                  Relative Humidity Status
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-black font-mono text-white flex items-center gap-1">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    {currentBay.currentHumidity}%
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Target: <strong className="text-cyan-400">{currentBay.targetHumidity}%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Temperature Override Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  Override Target Temperature
                </span>
                <span className="font-mono font-bold text-base text-cyan-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
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
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Override Target Relative Humidity
                </span>
                <span className="font-mono font-bold text-base text-cyan-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
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
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-cyan-500/25 scale-[1.01]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {hasUnsavedChanges ? 'Apply & Lock Climate Override' : 'Climate Setpoint Synchronized'}
            </button>

            {/* Emergency & HVAC System Toggles */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Chamber Hardware & Sub-System Overrides:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleBayEmergencyMode(currentBay.id, 'rapid_freeze')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    currentBay.compressorMode === 'rapid_freeze'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Zap className="w-4 h-4 text-rose-400" />
                  <span>Rapid Pre-Cool (Boost)</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleBayEmergencyMode(currentBay.id, 'aeration')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    currentBay.compressorMode === 'aeration'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span>High-Flow Aeration</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleOzoneGenerator(currentBay.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    currentBay.ozoneGeneratorActive
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Ozone Micro-Dosing: {currentBay.ozoneGeneratorActive ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleBayEmergencyMode(currentBay.id, 'dehumidifying')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    currentBay.compressorMode === 'dehumidifying'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Droplets className="w-4 h-4 text-amber-400" />
                  <span>Active Condensation Purge</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry Stream & System Logs (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Sensor Telemetry & Automation Feed
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                MQTT Stream @ 1Hz
              </span>
            </div>

            {/* Live Feed Container */}
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
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : isOverride
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                        : isCorrective
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span className="font-bold text-white">
                        Bay: {log.bayId.toUpperCase()} • {log.timestamp}
                      </span>
                      <span className="font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {log.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-slate-200 font-medium">
                      {log.actionTaken}
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
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
