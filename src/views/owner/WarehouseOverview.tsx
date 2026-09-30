import React from 'react';
import { useApp } from '../../context/AppContext';
import { CROPS_DATA } from '../../data/mockData';
import { 
  Building2, 
  Layers, 
  Activity, 
  Coins, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  ChevronRight,
  Fan,
  Wind
} from 'lucide-react';

export const WarehouseOverview: React.FC = () => {
  const { 
    bays, 
    facilityStats, 
    setStorageOwnerTab, 
    setSelectedBayId 
  } = useApp();

  const handleBayInspect = (bayId: string) => {
    setSelectedBayId(bayId);
    setStorageOwnerTab('telemetry_control');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              Warehouse Facility Control Center
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Facility: Sahyadri Dark Vault 01
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chakan Agri-Corridor, Pune • Automated HVAC & Nitrogen/Ozone containment systems.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setStorageOwnerTab('booking_requests')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <span>Review Space Bookings</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={() => setStorageOwnerTab('telemetry_control')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Climate Override Panel</span>
          </button>
        </div>
      </div>

      {/* Facility KPIs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Facility Capacity */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Facility Capacity</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {facilityStats.occupancyPercent}%
            <span className="text-xs text-slate-400 font-sans font-normal ml-2">Occupied</span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${facilityStats.occupancyPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            {facilityStats.totalOccupied} / {facilityStats.totalCapacity} Quintals
          </p>
        </div>

        {/* Active Bays */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Storage Bays</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {facilityStats.activeBaysCount}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">
              / {facilityStats.totalBaysCount} Bays
            </span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{facilityStats.totalBaysCount - facilityStats.activeBaysCount} Bays Available for Intake</span>
          </p>
        </div>

        {/* Monthly Revenue Generated */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Monthly Revenue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            ₹{(facilityStats.monthlyRevenueEstimate / 100000).toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">Lakhs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Avg storage billing: ₹3.6/qtl/day
          </p>
        </div>

        {/* Environmental Stability Index */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Stability Index</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white flex items-center gap-2">
            <span>98.4%</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              High
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {facilityStats.alertCount > 0 ? (
              <span className="text-amber-400 font-semibold">
                ⚠️ {facilityStats.alertCount} Bay needs humidity check
              </span>
            ) : (
              'All bay compressors synchronized'
            )}
          </p>
        </div>
      </div>

      {/* Visual Grid Layout of Storage Bays (Bay 1 to Bay 8) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Dark Storage Bays Grid</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {bays.length} Chambers Monitored
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Click any bay to open its live telemetry and manual climate override controls
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /> Alert Drift
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bays.map(bay => {
            const crop = bay.currentCrop ? CROPS_DATA[bay.currentCrop] : null;
            const isWarning = bay.status === 'warning';
            const isAvailable = bay.status === 'available';

            return (
              <div
                key={bay.id}
                onClick={() => handleBayInspect(bay.id)}
                className={`p-4 rounded-2xl bg-slate-900/90 border transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:scale-[1.01] ${
                  isWarning
                    ? 'border-amber-500/60 shadow-lg shadow-amber-500/10'
                    : isAvailable
                    ? 'border-slate-800/80 hover:border-slate-700 opacity-90'
                    : 'border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  {/* Bay Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        {bay.bayNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {bay.name.split('(')[0]}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : isAvailable
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {bay.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Commodity Stored */}
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 text-xs">
                    {crop ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-[10px]">Stored Commodity</span>
                          <span className="font-mono text-emerald-400 font-bold text-[10px]">
                            {bay.occupiedQuintals}/{bay.totalCapacityQuintals} Qtl
                          </span>
                        </div>
                        <div className="font-bold text-white mt-0.5 truncate">
                          {crop.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          Farmer: {bay.storedFarmerName}
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-center text-slate-500 text-xs">
                        Chamber Empty • Ready for Load ({bay.totalCapacityQuintals} Qtl)
                      </div>
                    )}
                  </div>

                  {/* Telemetry Readouts */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>Temp</span>
                        <span className="font-mono text-[9px] text-slate-500">T: {bay.targetTemp}°</span>
                      </div>
                      <div className="font-mono font-bold text-slate-100 text-sm mt-0.5 flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                        {bay.currentTemp}°C
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>Humidity</span>
                        <span className="font-mono text-[9px] text-slate-500">T: {bay.targetHumidity}%</span>
                      </div>
                      <div className={`font-mono font-bold text-sm mt-0.5 flex items-center gap-1 ${
                        isWarning ? 'text-amber-400' : 'text-slate-100'
                      }`}>
                        <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                        {bay.currentHumidity}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Fan className={`w-3 h-3 ${bay.compressorMode === 'cooling' ? 'animate-spin text-cyan-400' : 'text-slate-600'}`} />
                    {bay.compressorMode}
                  </span>
                  <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    Override Climate <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
