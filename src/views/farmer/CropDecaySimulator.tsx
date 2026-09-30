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
  Flame
} from 'lucide-react';

export const CropDecaySimulator: React.FC = () => {
  const { 
    selectedSimulatorCrop, 
    setSelectedSimulatorCrop, 
    openBookingModal,
    theme 
  } = useApp();

  const isDark = theme === 'dark';
  const currentCrop = CROPS_DATA[selectedSimulatorCrop] || CROPS_DATA.onion;

  // Simulator parameter states
  const [temperature, setTemperature] = useState<number>(currentCrop.idealTemp);
  const [humidity, setHumidity] = useState<number>(currentCrop.idealHumidity);

  const handleCropSelect = (cropId: CropId) => {
    setSelectedSimulatorCrop(cropId);
    const newCrop = CROPS_DATA[cropId];
    setTemperature(newCrop.idealTemp);
    setHumidity(newCrop.idealHumidity);
  };

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

  const tempDeviation = Math.abs(temperature - currentCrop.idealTemp);
  const humDeviation = Math.abs(humidity - currentCrop.idealHumidity);

  const tempPenalty = tempDeviation * (temperature > currentCrop.idealTemp ? 3.5 : 2.5) * currentCrop.decayFactorTemp;
  const humPenalty = humDeviation * 1.8 * currentCrop.decayFactorHumidity;
  const healthScore = Math.max(8, Math.min(100, Math.round(100 - tempPenalty - humPenalty)));

  const decayRate = 1.0 + (Math.max(0, temperature - currentCrop.idealTemp) * 0.08 * currentCrop.decayFactorTemp) + (humDeviation * 0.03 * currentCrop.decayFactorHumidity);
  const simulatedShelfLifeDays = Math.max(2, Math.round(currentCrop.maxShelfLifeColdStorageDays / decayRate));

  const isHighMoldRisk = humidity >= currentCrop.moldRiskHumidityThreshold;
  const isSproutingRisk = temperature >= currentCrop.sproutingTempThreshold;
  const isChillingInjury = selectedSimulatorCrop === 'tomato' && temperature < 8;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border-slate-800'
          : 'bg-gradient-to-r from-emerald-50 via-white to-indigo-50 border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              <FlaskConical className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Crop Longevity & Storage Decay Simulator
            </h2>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : isDark
                    ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
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
          <div className={`p-5 rounded-2xl border space-y-6 transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <span>Micro-Climate Controls</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isDark ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    Live Reactivity
                  </span>
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Adjust bay parameters to inspect physiological impact
                </p>
              </div>

              <button
                onClick={() => applyPreset('optimal')}
                title="Reset to crop optimal"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <span className={`text-[11px] font-bold block mb-2 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Climate Presets:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('optimal')}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                    temperature === currentCrop.idealTemp && humidity === currentCrop.idealHumidity
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500 shadow-sm'
                      : isDark
                      ? 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-500" />
                  Dark Vault Optimal
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('monsoon')}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                    isDark
                      ? 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5 mx-auto mb-1 text-cyan-500" />
                  Monsoon Ambient
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('summer')}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                    isDark
                      ? 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 mx-auto mb-1 text-rose-500" />
                  Summer Heat
                </button>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Thermometer className="w-4 h-4 text-rose-500" />
                  Storage Temperature
                </span>
                <span className={`font-mono font-bold text-base px-2.5 py-0.5 rounded-lg border ${
                  isDark
                    ? 'text-white bg-slate-950 border-slate-800'
                    : 'text-slate-900 bg-slate-50 border-slate-200'
                }`}>
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
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Ideal: {currentCrop.idealTemp}°C
                </span>
                <span>40°C (Extreme Heat)</span>
              </div>
            </div>

            {/* Humidity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  Relative Humidity (RH)
                </span>
                <span className={`font-mono font-bold text-base px-2.5 py-0.5 rounded-lg border ${
                  isDark
                    ? 'text-white bg-slate-950 border-slate-800'
                    : 'text-slate-900 bg-slate-50 border-slate-200'
                }`}>
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
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                  Ideal: {currentCrop.idealHumidity}% RH
                </span>
                <span>90% (Saturated)</span>
              </div>
            </div>

            {/* Dynamic Crop Physiology Summary */}
            <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className={`font-bold block text-[11px] uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Target Physiology: {currentCrop.name}
              </span>
              <p className="leading-relaxed text-[11px]">
                {currentCrop.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => openBookingModal()}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Reserve Dark Bay with These Parameters</span>
          </button>
        </div>

        {/* Right Column: Gauges, Curves & Warning Banners (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-5 rounded-2xl border grid grid-cols-1 md:grid-cols-2 gap-4 items-center transition-colors ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex justify-center pb-4 md:pb-0 md:pr-4 border-b md:border-b-0 md:border-r ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <HealthGauge
                score={healthScore}
                label="Crop Longevity Index"
                size={190}
                subtext="Real-time biological vitality rating"
              />
            </div>

            <div className="space-y-3">
              <div className={`p-3.5 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Projected Shelf-Life
                </span>
                <div className={`text-2xl font-black font-mono mt-0.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {simulatedShelfLifeDays}{' '}
                  <span className={`text-xs font-sans font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Days
                  </span>
                </div>
                <div className={`text-[11px] mt-1 flex items-center justify-between ${
                  isDark ? 'text-slate-500' : 'text-slate-500'
                }`}>
                  <span>Open Shed: {currentCrop.standardShelfLifeDays}d</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    Max: {currentCrop.maxShelfLifeColdStorageDays}d
                  </span>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Estimated Financial Value Retention
                </span>
                <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₹{Math.round((currentCrop.marketPricePerQtl * (healthScore / 100))).toLocaleString()}{' '}
                  <span className={`text-xs font-sans font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    / Quintal
                  </span>
                </div>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Baseline Mandi modal: ₹{currentCrop.marketPricePerQtl}/qtl
                </p>
              </div>
            </div>
          </div>

          {/* Threshold Alert Banners */}
          <div className="space-y-2">
            {isHighMoldRisk && (
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                isDark 
                  ? 'bg-rose-500/10 border-rose-500/30' 
                  : 'bg-rose-50 border-rose-200 text-rose-900 shadow-2xs'
              }`}>
                <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-rose-300' : 'text-rose-800'}`}>
                    High Fungal Mold Risk Threshold Tripped!
                  </h4>
                  <p className={`mt-0.5 leading-relaxed text-[11px] ${isDark ? 'text-slate-300' : 'text-rose-700'}`}>
                    At {humidity}% RH (above safe {currentCrop.moldRiskHumidityThreshold}% threshold), surface spores (Aspergillus niger / Botrytis) proliferate rapidly within 72 hours. Dark storage active dehumidification is strictly recommended.
                  </p>
                </div>
              </div>
            )}

            {isSproutingRisk && (
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                isDark 
                  ? 'bg-amber-500/10 border-amber-500/30' 
                  : 'bg-amber-50 border-amber-200 text-amber-900 shadow-2xs'
              }`}>
                <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                    Sprout Dormancy Break Alert
                  </h4>
                  <p className={`mt-0.5 leading-relaxed text-[11px] ${isDark ? 'text-slate-300' : 'text-amber-700'}`}>
                    Temperature of {temperature}°C exceeds {currentCrop.sproutingTempThreshold}°C sprout trigger threshold. Internal cytokinin enzymes will break dormancy, producing shoots that rapidly deplete bulb nutrients.
                  </p>
                </div>
              </div>
            )}

            {isChillingInjury && (
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                isDark 
                  ? 'bg-cyan-500/10 border-cyan-500/30' 
                  : 'bg-cyan-50 border-cyan-200 text-cyan-900 shadow-2xs'
              }`}>
                <AlertTriangle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-cyan-300' : 'text-cyan-800'}`}>
                    Chilling Injury Warning (Sub-optimal Low Temp)
                  </h4>
                  <p className={`mt-0.5 leading-relaxed text-[11px] ${isDark ? 'text-slate-300' : 'text-cyan-700'}`}>
                    Tomatoes stored below 10°C suffer membrane rupture, watery breakdown, and failure to ripen upon market transfer.
                  </p>
                </div>
              </div>
            )}

            {!isHighMoldRisk && !isSproutingRisk && !isChillingInjury && healthScore > 80 && (
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                isDark 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-2xs'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                    Optimal Preservation Envelope Achieved
                  </h4>
                  <p className={`mt-0.5 leading-relaxed text-[11px] ${isDark ? 'text-slate-300' : 'text-emerald-700'}`}>
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
