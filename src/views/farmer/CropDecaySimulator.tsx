import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CROPS_DATA } from '../../data/mockData';
import { CropId } from '../../types';
import { HealthGauge } from '../../components/HealthGauge';
import { DecayPredictorChart } from '../../components/DecayPredictorChart';
import { 
  FlaskConical, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw,
  PackagePlus,
  ShieldAlert,
  Flame,
  Bug
} from 'lucide-react';

export const CropDecaySimulator: React.FC = () => {
  const { 
    selectedSimulatorCrop, 
    setSelectedSimulatorCrop, 
    openBookingModal, 
    setFarmerTab 
  } = useApp();

  const currentCrop = CROPS_DATA[selectedSimulatorCrop] || CROPS_DATA.onion;

  // Simulator parameter states
  const [temperature, setTemperature] = useState<number>(currentCrop.idealTemp);
  const [humidity, setHumidity] = useState<number>(currentCrop.idealHumidity);

  // When switching crop, reset sliders to that crop's defaults
  const handleCropSelect = (cropId: CropId) => {
    setSelectedSimulatorCrop(cropId);
    const newCrop = CROPS_DATA[cropId];
    setTemperature(newCrop.idealTemp);
    setHumidity(newCrop.idealHumidity);
  };

  // Preset quick configurations
  const applyPreset = (preset: 'optimal' | 'monsoon' | 'summer') => {
    if (preset === 'optimal') {
      setTemperature(currentCrop.idealTemp);
      setHumidity(currentCrop.idealHumidity);
    } else if (preset === 'monsoon') {
      setTemperature(30);
      setHumidity(86);
    } else if (preset === 'summer') {
      setTemperature(38);
      setHumidity(35);
    }
  };

  // Dynamic calculations
  const tempDeviation = Math.abs(temperature - currentCrop.idealTemp);
  const humDeviation = Math.abs(humidity - currentCrop.idealHumidity);

  // Health Score (0 - 100)
  // Penalizes temperature and humidity divergences
  const tempPenalty = tempDeviation * (temperature > currentCrop.idealTemp ? 3.5 : 2.5) * currentCrop.decayFactorTemp;
  const humPenalty = humDeviation * 1.8 * currentCrop.decayFactorHumidity;
  const healthScore = Math.max(8, Math.min(100, Math.round(100 - tempPenalty - humPenalty)));

  // Simulated Shelf-Life in Days
  const decayRate = 1.0 + (Math.max(0, temperature - currentCrop.idealTemp) * 0.08 * currentCrop.decayFactorTemp) + (humDeviation * 0.03 * currentCrop.decayFactorHumidity);
  const simulatedShelfLifeDays = Math.max(2, Math.round(currentCrop.maxShelfLifeColdStorageDays / decayRate));

  // Risk Thresholds & Banners
  const isHighMoldRisk = humidity >= currentCrop.moldRiskHumidityThreshold;
  const isSproutingRisk = temperature >= currentCrop.sproutingTempThreshold;
  const isChillingInjury = selectedSimulatorCrop === 'tomato' && temperature < 8;
  const isSweeteningRisk = selectedSimulatorCrop === 'potato' && temperature < 5;
  const isDesiccationRisk = humidity < 50 && ['onion', 'potato', 'tomato', 'pomegranate'].includes(selectedSimulatorCrop);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <FlaskConical className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Crop Longevity & Storage Decay Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate micro-climate variances on crop respiration, dormancy break, fungal mold onset, and shelf-life countdown.
          </p>
        </div>

        {/* Commodity Crop Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {Object.values(CROPS_DATA).map(c => {
            const isSelected = selectedSimulatorCrop === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCropSelect(c.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {c.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Micro-Climate Controls</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                    Live Reactivity
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust bay parameters to inspect physiological impact
                </p>
              </div>

              {/* Reset to Optimal */}
              <button
                onClick={() => applyPreset('optimal')}
                title="Reset to crop optimal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Climate Presets:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('optimal')}
                  className={`p-2 rounded-xl text-[11px] font-semibold border transition-all text-center cursor-pointer ${
                    temperature === currentCrop.idealTemp && humidity === currentCrop.idealHumidity
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-400" />
                  Dark Vault Optimal
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('monsoon')}
                  className="p-2 rounded-xl text-[11px] font-semibold border bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200 transition-all text-center cursor-pointer"
                >
                  <Droplets className="w-3.5 h-3.5 mx-auto mb-1 text-cyan-400" />
                  Monsoon Ambient
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('summer')}
                  className="p-2 rounded-xl text-[11px] font-semibold border bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200 transition-all text-center cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 mx-auto mb-1 text-rose-400" />
                  Summer Heat
                </button>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  Storage Temperature
                </span>
                <span className="font-mono font-bold text-base text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                  {temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={temperature}
                onChange={e => setTemperature(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10°C (Cold Chain)</span>
                <span className="text-emerald-400 font-semibold">
                  Ideal: {currentCrop.idealTemp}°C
                </span>
                <span>40°C (Extreme Heat)</span>
              </div>
            </div>

            {/* Humidity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Relative Humidity (RH)
                </span>
                <span className="font-mono font-bold text-base text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                  {humidity}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                step="1"
                value={humidity}
                onChange={e => setHumidity(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>20% (Dry Arid)</span>
                <span className="text-cyan-400 font-semibold">
                  Ideal: {currentCrop.idealHumidity}% RH
                </span>
                <span>90% (Saturated)</span>
              </div>
            </div>

            {/* Dynamic Crop Physiology Summary */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
                Target Physiology: {currentCrop.name}
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {currentCrop.description}
              </p>
            </div>
          </div>

          {/* Action CTA: Book Bay with These Settings */}
          <button
            onClick={() => openBookingModal()}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Reserve Dark Bay with These Parameters</span>
          </button>
        </div>

        {/* Right Column: Gauges, Curves & Warning Banners (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Row: Radial Health Gauge + Key Metrics */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Health Gauge */}
            <div className="flex justify-center border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
              <HealthGauge
                score={healthScore}
                label="Crop Longevity Index"
                size={190}
                subtext="Real-time biological vitality rating"
              />
            </div>

            {/* Shelf-Life Countdown Cards */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Projected Shelf-Life
                </span>
                <div className="text-2xl font-black font-mono text-white mt-0.5">
                  {simulatedShelfLifeDays}{' '}
                  <span className="text-xs text-slate-400 font-sans font-normal">Days</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>Standard Open Shed: {currentCrop.standardShelfLifeDays}d</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    Max: {currentCrop.maxShelfLifeColdStorageDays}d
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Estimated Financial Value Retention
                </span>
                <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                  ₹{Math.round((currentCrop.marketPricePerQtl * (healthScore / 100))).toLocaleString()}{' '}
                  <span className="text-xs text-slate-400 font-sans font-normal">/ Quintal</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Baseline Mandi modal: ₹{currentCrop.marketPricePerQtl}/qtl
                </p>
              </div>
            </div>
          </div>

          {/* Threshold Alert Banners */}
          <div className="space-y-2">
            {isHighMoldRisk && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-rose-300">
                    High Fungal Mold Risk Threshold Tripped!
                  </h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                    At {humidity}% RH (above safe {currentCrop.moldRiskHumidityThreshold}% threshold), surface spores (Aspergillus niger / Botrytis) proliferate rapidly within 72 hours. Dark storage active dehumidification is strictly recommended.
                  </p>
                </div>
              </div>
            )}

            {isSproutingRisk && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-300">
                    Sprout Dormancy Break Alert
                  </h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                    Temperature of {temperature}°C exceeds {currentCrop.sproutingTempThreshold}°C sprout trigger threshold. Internal cytokinin enzymes will break dormancy, producing shoots that rapidly deplete bulb nutrients.
                  </p>
                </div>
              </div>
            )}

            {isChillingInjury && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3 text-xs">
                <AlertTriangle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-cyan-300">
                    Chilling Injury Warning (Sub-optimal Low Temp)
                  </h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                    Tomatoes stored below 10°C suffer membrane rupture, watery breakdown, and failure to ripen upon market transfer.
                  </p>
                </div>
              </div>
            )}

            {!isHighMoldRisk && !isSproutingRisk && !isChillingInjury && healthScore > 80 && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-300">
                    Optimal Preservation Envelope Achieved
                  </h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                    Simulated temperature and humidity perfectly align with {currentCrop.name} bio-dormancy standards. Minimum metabolic respiration locked.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Predictive Curve Line Chart */}
          <DecayPredictorChart
            crop={currentCrop}
            currentTemp={temperature}
            currentHumidity={humidity}
            healthScore={healthScore}
            simulatedShelfLifeDays={simulatedShelfLifeDays}
          />
        </div>
      </div>
    </div>
  );
};
