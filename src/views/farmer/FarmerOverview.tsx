import React from 'react';
import { useApp } from '../../context/AppContext';
import { CROPS_DATA } from '../../data/mockData';
import { 
  Package, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  PlusCircle, 
  FlaskConical, 
  MapPin, 
  Thermometer, 
  Droplets, 
  ExternalLink, 
  ChevronRight 
} from 'lucide-react';

export const FarmerOverview: React.FC = () => {
  const { 
    storedBatches, 
    setFarmerTab, 
    openBookingModal, 
    setSelectedSimulatorCrop,
    theme 
  } = useApp();

  const isDark = theme === 'dark';

  const totalQuintals = storedBatches.reduce((acc, b) => acc + b.quantityQuintals, 0);
  const avgShelfLife = storedBatches.length > 0
    ? Math.round(storedBatches.reduce((acc, b) => acc + b.shelfLifeRemainingDays, 0) / storedBatches.length)
    : 0;
  const avgQuality = storedBatches.length > 0
    ? Math.round(storedBatches.reduce((acc, b) => acc + b.qualityIndex, 0) / storedBatches.length)
    : 0;
  const totalValue = storedBatches.reduce((acc, b) => acc + b.depositValueTotal, 0);

  const warningBatches = storedBatches.filter(b => b.status === 'warning' || b.qualityIndex < 80);

  const handleSimulateBatch = (cropId: any) => {
    setSelectedSimulatorCrop(cropId);
    setFarmerTab('decay_simulator');
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border backdrop-blur-sm transition-colors ${
        isDark
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900/60 border-emerald-500/20 text-white'
          : 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 border-emerald-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight">
              Kisan Seva Dashboard
            </h2>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              isDark
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}>
              Producer: Ramesh Patil
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time IoT dark vault telemetry for your stored lots in Pune & Nashik hubs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFarmerTab('decay_simulator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-emerald-500" />
            <span>Decay Simulator</span>
          </button>
          <button
            onClick={() => openBookingModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Request Storage Bay</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quintals */}
        <div className={`p-4 rounded-2xl border transition-all group ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/30' 
            : 'bg-white border-slate-200 shadow-sm hover:border-emerald-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Stored
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {totalQuintals}{' '}
            <span className={`text-xs font-sans font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Quintals
            </span>
          </div>
          <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Across 3 active dark bays
          </p>
        </div>

        {/* Avg Shelf Life */}
        <div className={`p-4 rounded-2xl border transition-all group ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/30' 
            : 'bg-white border-slate-200 shadow-sm hover:border-cyan-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Avg. Shelf Life
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {avgShelfLife}{' '}
            <span className={`text-xs font-sans font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Days Remaining
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <span>+90 days vs open shed</span>
          </p>
        </div>

        {/* Quality Index */}
        <div className={`p-4 rounded-2xl border transition-all group ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/30' 
            : 'bg-white border-slate-200 shadow-sm hover:border-emerald-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Quality Health Index
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span>{avgQuality}%</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Grade A
            </span>
          </div>
          <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Zero fungal mold spread
          </p>
        </div>

        {/* Holding Valuation */}
        <div className={`p-4 rounded-2xl border transition-all group ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/30' 
            : 'bg-white border-slate-200 shadow-sm hover:border-amber-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Holding Asset Value
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ₹{(totalValue / 100000).toFixed(2)}{' '}
            <span className={`text-xs font-sans font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Lakhs
            </span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">
            Projected APMC +28% gain
          </p>
        </div>
      </div>

      {/* Quick Alerts Panel */}
      {warningBatches.length > 0 && (
        <div className={`p-4 rounded-2xl border ${
          isDark
            ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/30'
            : 'bg-amber-50 border-amber-300 shadow-2xs'
        }`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className={`text-sm font-bold ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                  Humidity Spike Warning Detected in Pune North Storage
                </h4>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  isDark
                    ? 'bg-amber-950 text-amber-300 border-amber-800/80'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  Bay B-4 • Auto Correction Active
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Relative humidity spiked to <strong>74.5% RH</strong> (exceeding safe onion threshold of 72%). Warehouse automated dehumidification and secondary condensation cooling systems were triggered 3 minutes ago.
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedSimulatorCrop('onion');
                    setFarmerTab('decay_simulator');
                  }}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Analyze Mold Risk in Simulator <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Stored Batches Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Active Stored Commodity Lots ({storedBatches.length})
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Live IoT monitoring of cold room parameters & health indices
            </p>
          </div>
          <button
            onClick={() => setFarmerTab('storage_finder')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Find Nearby Dark Storage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storedBatches.map(batch => {
            const isWarning = batch.status === 'warning' || batch.qualityIndex < 80;

            return (
              <div
                key={batch.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isDark
                    ? isWarning 
                      ? 'bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-500/10' 
                      : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
                    : isWarning
                    ? 'bg-white border-amber-300 shadow-md shadow-amber-100'
                    : 'bg-white border-slate-200 shadow-sm hover:border-emerald-300'
                }`}
              >
                <div>
                  {/* Top: Crop info and Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Lot #{batch.id}
                      </span>
                      <h4 className={`text-sm font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {batch.cropName}
                      </h4>
                      <p className={`text-xs flex items-center gap-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {batch.hubName} ({batch.bayNumber})
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      isWarning
                        ? isDark
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                        : isDark
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {isWarning ? 'Attention Required' : 'Optimal Dormant'}
                    </span>
                  </div>

                  {/* Quantity & Deposit Value */}
                  <div className={`grid grid-cols-2 gap-2 p-2.5 rounded-xl border mb-3 text-xs ${
                    isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        Volume
                      </span>
                      <div className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {batch.quantityQuintals} Quintals
                      </div>
                    </div>
                    <div>
                      <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        Current Asset Val
                      </span>
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{batch.depositValueTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Status Bar */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                      isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <Thermometer className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <div>
                        <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Temperature
                        </span>
                        <span className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {batch.currentTemp}°C
                        </span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                      isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <Droplets className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      <div>
                        <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Humidity
                        </span>
                        <span className={`font-mono font-bold ${
                          batch.currentHumidity > 72 && batch.cropId === 'onion' 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {batch.currentHumidity}% RH
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quality & Shelf Life Countdown */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        Quality Health Score
                      </span>
                      <span className={`font-mono font-bold ${
                        batch.qualityIndex < 80 
                          ? 'text-amber-600 dark:text-amber-400' 
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {batch.qualityIndex}%
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          batch.qualityIndex < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${batch.qualityIndex}%` }}
                      />
                    </div>
                    <div className={`flex justify-between text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>Entered: {batch.entryDate}</span>
                      <span>
                        Est: <strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>{batch.shelfLifeRemainingDays}d left</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <button
                  onClick={() => handleSimulateBatch(batch.cropId)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Run Longevity Simulation</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
