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
  CheckCircle2, 
  Sliders, 
  ChevronRight,
  Fan
} from 'lucide-react';

export const WarehouseOverview: React.FC = () => {
  const { 
    bays, 
    facilityStats, 
    setStorageOwnerTab, 
    setSelectedBayId,
    theme 
  } = useApp();

  const isDark = theme === 'dark';

  const handleBayInspect = (bayId: string) => {
    setSelectedBayId(bayId);
    setStorageOwnerTab('telemetry_control');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border-cyan-500/30'
          : 'bg-gradient-to-r from-cyan-50 via-white to-indigo-50 border-cyan-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Warehouse Facility Control Center
            </h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              isDark 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
                : 'bg-cyan-100 text-cyan-800 border-cyan-300'
            }`}>
              Facility: Sahyadri Dark Vault 01
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Chakan Agri-Corridor, Pune • Automated HVAC & Nitrogen/Ozone containment systems.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setStorageOwnerTab('booking_requests')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
            }`}
          >
            <span>Review Space Bookings</span>
            <ChevronRight className="w-4 h-4 text-cyan-500" />
          </button>
          <button
            onClick={() => setStorageOwnerTab('telemetry_control')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Climate Override Panel</span>
          </button>
        </div>
      </div>

      {/* Facility KPIs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Facility Capacity */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/30' 
            : 'bg-white border-slate-200 shadow-sm hover:border-cyan-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Facility Capacity
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {facilityStats.occupancyPercent}%
            <span className={`text-xs font-sans font-normal ml-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Occupied
            </span>
          </div>
          <div className={`mt-2 w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${facilityStats.occupancyPercent}%` }}
            />
          </div>
          <p className={`text-[11px] mt-2 font-mono ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            {facilityStats.totalOccupied} / {facilityStats.totalCapacity} Quintals
          </p>
        </div>

        {/* Active Bays */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/30' 
            : 'bg-white border-slate-200 shadow-sm hover:border-emerald-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Active Storage Bays
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {facilityStats.activeBaysCount}
            <span className={`text-xs font-sans font-normal ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              / {facilityStats.totalBaysCount} Bays
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{facilityStats.totalBaysCount - facilityStats.activeBaysCount} Bays Available for Intake</span>
          </p>
        </div>

        {/* Monthly Revenue Generated */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/30' 
            : 'bg-white border-slate-200 shadow-sm hover:border-amber-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Monthly Revenue
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            ₹{(facilityStats.monthlyRevenueEstimate / 100000).toFixed(2)}{' '}
            <span className={`text-xs font-sans font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Lakhs
            </span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Avg storage billing: ₹3.6/qtl/day
          </p>
        </div>

        {/* Environmental Stability Index */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/30' 
            : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Stability Index
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>98.4%</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
              isDark 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-800' 
                : 'bg-cyan-50 text-cyan-700 border-cyan-200'
            }`}>
              High
            </span>
          </div>
          <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {facilityStats.alertCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-bold">
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
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>Dark Storage Bays Grid</span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border font-semibold ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {bays.length} Chambers Monitored
              </span>
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Click any bay to open its live telemetry and manual climate override controls
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal
            </span>
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" /> Alert Drift
            </span>
            <span className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Available
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
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:scale-[1.01] ${
                  isDark
                    ? isWarning
                      ? 'bg-slate-900/90 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : isAvailable
                      ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                      : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40'
                    : isWarning
                    ? 'bg-white border-amber-300 shadow-md shadow-amber-100'
                    : isAvailable
                    ? 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                    : 'bg-white border-slate-200 shadow-sm hover:border-cyan-300'
                }`}
              >
                <div>
                  {/* Bay Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        {bay.bayNumber}
                      </span>
                      <h4 className={`text-sm font-bold transition-colors ${
                        isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-cyan-600'
                      }`}>
                        {bay.name.split('(')[0]}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isWarning
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400 animate-pulse'
                        : isAvailable
                        ? isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                    }`}>
                      {bay.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Commodity Stored */}
                  <div className={`p-2.5 rounded-xl border mb-3 text-xs ${
                    isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {crop ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Stored Commodity
                          </span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                            {bay.occupiedQuintals}/{bay.totalCapacityQuintals} Qtl
                          </span>
                        </div>
                        <div className={`font-bold mt-0.5 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {crop.name}
                        </div>
                        <div className={`text-[10px] truncate mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          Farmer: {bay.storedFarmerName}
                        </div>
                      </div>
                    ) : (
                      <div className={`py-2 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Chamber Empty • Ready for Load ({bay.totalCapacityQuintals} Qtl)
                      </div>
                    )}
                  </div>

                  {/* Telemetry Readouts */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className={`p-2 rounded-xl border ${
                      isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Temp</span>
                        <span className="font-mono text-[9px] text-slate-400">T: {bay.targetTemp}°</span>
                      </div>
                      <div className={`font-mono font-bold text-sm mt-0.5 flex items-center gap-1 ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                        {bay.currentTemp}°C
                      </div>
                    </div>

                    <div className={`p-2 rounded-xl border ${
                      isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Humidity</span>
                        <span className="font-mono text-[9px] text-slate-400">T: {bay.targetHumidity}%</span>
                      </div>
                      <div className={`font-mono font-bold text-sm mt-0.5 flex items-center gap-1 ${
                        isWarning ? 'text-amber-600 dark:text-amber-400' : isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                        {bay.currentHumidity}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className={`pt-2 border-t flex items-center justify-between text-xs ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`text-[10px] flex items-center gap-1 font-mono ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    <Fan className={`w-3 h-3 ${bay.compressorMode === 'cooling' ? 'animate-spin text-cyan-500' : 'text-slate-400'}`} />
                    {bay.compressorMode}
                  </span>
                  <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
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
