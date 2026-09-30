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
    bays, 
    setFarmerTab, 
    openBookingModal, 
    setSelectedSimulatorCrop 
  } = useApp();

  // Aggregate farmer metrics
  const totalQuintals = storedBatches.reduce((acc, b) => acc + b.quantityQuintals, 0);
  const avgShelfLife = storedBatches.length > 0
    ? Math.round(storedBatches.reduce((acc, b) => acc + b.shelfLifeRemainingDays, 0) / storedBatches.length)
    : 0;
  const avgQuality = storedBatches.length > 0
    ? Math.round(storedBatches.reduce((acc, b) => acc + b.qualityIndex, 0) / storedBatches.length)
    : 0;
  const totalValue = storedBatches.reduce((acc, b) => acc + b.depositValueTotal, 0);

  // Active warnings / alerts
  const warningBatches = storedBatches.filter(b => b.status === 'warning' || b.qualityIndex < 80);

  const handleSimulateBatch = (cropId: any) => {
    setSelectedSimulatorCrop(cropId);
    setFarmerTab('decay_simulator');
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900/60 p-5 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              Kisan Seva Dashboard
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Producer: Ramesh Patil
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time IoT dark vault telemetry for your stored lots in Pune & Nashik hubs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFarmerTab('decay_simulator')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>Decay Simulator</span>
          </button>
          <button
            onClick={() => openBookingModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Request Storage Bay</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quintals */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Stored</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {totalQuintals}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">Quintals</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 3 active dark bays</p>
        </div>

        {/* Avg Shelf Life */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Avg. Shelf Life</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {avgShelfLife}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">Days Remaining</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>+90 days vs open shed</span>
          </p>
        </div>

        {/* Quality Index */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Quality Health Index</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white flex items-center gap-2">
            <span>{avgQuality}%</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Grade A
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero fungal mold spread</p>
        </div>

        {/* Holding Valuation */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Holding Asset Value</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            ₹{(totalValue / 100000).toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">Lakhs</span>
          </div>
          <p className="text-[11px] text-amber-400/90 mt-1 font-medium">
            Projected APMC +28% gain
          </p>
        </div>
      </div>

      {/* Quick Alerts Panel */}
      {warningBatches.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5 flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-amber-300">
                  Humidity Spike Warning Detected in Pune North Storage
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80">
                  Bay B-4 • Auto Correction Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Relative humidity spiked to <strong>74.5% RH</strong> (exceeding safe onion threshold of 72%). Warehouse automated dehumidification and secondary condensation cooling systems were triggered 3 minutes ago.
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedSimulatorCrop('onion');
                    setFarmerTab('decay_simulator');
                  }}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-4"
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
            <h3 className="text-base font-bold text-white">
              Active Stored Commodity Lots ({storedBatches.length})
            </h3>
            <p className="text-xs text-slate-400">
              Live IoT monitoring of cold room parameters & health indices
            </p>
          </div>
          <button
            onClick={() => setFarmerTab('storage_finder')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Find Nearby Dark Storage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storedBatches.map(batch => {
            const crop = CROPS_DATA[batch.cropId];
            const isWarning = batch.status === 'warning' || batch.qualityIndex < 80;

            return (
              <div
                key={batch.id}
                className={`p-4 rounded-2xl bg-slate-900/90 border transition-all duration-200 flex flex-col justify-between ${
                  isWarning 
                    ? 'border-amber-500/50 shadow-md shadow-amber-500/10' 
                    : 'border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div>
                  {/* Top: Crop info and Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Lot #{batch.id}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {batch.cropName}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {batch.hubName} ({batch.bayNumber})
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {isWarning ? 'Attention Required' : 'Optimal Dormant'}
                    </span>
                  </div>

                  {/* Quantity & Deposit Value */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px]">Volume</span>
                      <div className="font-mono font-bold text-white">
                        {batch.quantityQuintals} Quintals
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Current Asset Val</span>
                      <div className="font-mono font-bold text-emerald-400">
                        ₹{batch.depositValueTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Status Bar */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <Thermometer className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Temperature</span>
                        <span className="font-mono font-bold text-slate-200">
                          {batch.currentTemp}°C
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <Droplets className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Humidity</span>
                        <span className={`font-mono font-bold ${batch.currentHumidity > 72 && batch.cropId === 'onion' ? 'text-amber-400' : 'text-slate-200'}`}>
                          {batch.currentHumidity}% RH
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quality & Shelf Life Countdown */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Quality Health Score</span>
                      <span className={`font-mono font-bold ${batch.qualityIndex < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {batch.qualityIndex}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          batch.qualityIndex < 80 ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${batch.qualityIndex}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Entered: {batch.entryDate}</span>
                      <span>
                        Est. Expiry: <strong className="text-slate-300">{batch.shelfLifeRemainingDays}d left</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <button
                  onClick={() => handleSimulateBatch(batch.cropId)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Run Longevity Simulation</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
