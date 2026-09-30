import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageHub } from '../../types';
import { 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Phone, 
  PlusCircle, 
  Navigation,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const StorageFinder: React.FC = () => {
  const { hubs, openBookingModal, theme } = useApp();
  const isDark = theme === 'dark';

  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [sortOption, setSortOption] = useState<'distance' | 'price' | 'capacity'>('distance');

  const filteredHubs = hubs
    .filter(hub => {
      const matchesDistrict = districtFilter === 'All' || hub.district === districtFilter;
      return matchesDistrict;
    })
    .sort((a, b) => {
      if (sortOption === 'distance') return a.distanceKm - b.distanceKm;
      if (sortOption === 'price') return a.pricingPerQuintalDay - b.pricingPerQuintalDay;
      if (sortOption === 'capacity') return b.availableCapacityQuintals - a.availableCapacityQuintals;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border-slate-800'
          : 'bg-gradient-to-r from-emerald-50 via-white to-cyan-50 border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Dark Storage & Cold Hub Finder
            </h2>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Discover verified dark chambers and precision refrigerated silos across Maharashtra’s agri-corridors.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* District Pills */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            {['All', 'Pune', 'Nashik', 'Satara'].map(d => (
              <button
                key={d}
                onClick={() => setDistrictFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  districtFilter === d
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value as any)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700 shadow-2xs'
            }`}
          >
            <option value="distance">Sort by Distance</option>
            <option value="price">Sort by Price (Lowest)</option>
            <option value="capacity">Sort by Available Capacity</option>
          </select>
        </div>
      </div>

      {/* Map Simulation & Radar Hubs Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Simulated Radar Map (4 cols) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Decorative radar background */}
          <div className="relative w-full aspect-square rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-4 rounded-full border border-emerald-500/20" />
            <div className="absolute inset-14 rounded-full border border-emerald-500/20" />
            <div className="absolute inset-24 rounded-full border border-emerald-500/30" />
            <div className="absolute inset-32 rounded-full border border-emerald-500/40" />

            <div className="absolute w-full h-[1px] bg-emerald-500/20" />
            <div className="absolute h-full w-[1px] bg-emerald-500/20" />

            {/* Center Pulsing Dot */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-300 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-500/40 mt-1 shadow">
                Farmer Node
              </span>
            </div>

            {/* Radar Sweep Effect */}
            <div
              className="absolute inset-0 origin-center bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none"
              style={{
                clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)',
                animation: 'spin 6s linear infinite'
              }}
            />

            {/* Node Pins */}
            {hubs.map((hub, idx) => {
              const offsets = [
                { top: '24%', left: '68%' },
                { top: '18%', left: '32%' },
                { top: '74%', left: '62%' },
                { top: '65%', left: '26%' }
              ];
              const pos = offsets[idx % offsets.length];

              return (
                <div
                  key={hub.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute z-10 group cursor-pointer"
                  onClick={() => openBookingModal(hub)}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                  </span>
                  <div className="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 p-2 rounded-lg text-[10px] text-white whitespace-nowrap shadow-xl z-20">
                    <strong>{hub.name}</strong>
                    <div className="text-slate-400">{hub.distanceKm} km • ₹{hub.pricingPerQuintalDay}/qtl/day</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 pt-3 border-t text-xs flex items-center justify-between ${
            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
          }`}>
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-500" />
              Sensor Mesh Coverage: 120km
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">4 Active Nodes</span>
          </div>
        </div>

        {/* Right: Storage Nodes List Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className={`flex items-center justify-between text-xs ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Showing {filteredHubs.length} Dark Storage Hubs</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Certified Ozone & Dehumidified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHubs.map(hub => {
              const capacityPercent = Math.round(
                ((hub.totalCapacityQuintals - hub.availableCapacityQuintals) / hub.totalCapacityQuintals) * 100
              );

              return (
                <div
                  key={hub.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 group ${
                    isDark
                      ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
                      : 'bg-white border-slate-200 shadow-sm hover:border-emerald-300'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                          isDark 
                            ? 'bg-slate-800 text-cyan-400 border-slate-700' 
                            : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                        }`}>
                          {hub.district} Agri-Corridor
                        </span>
                        <h4 className={`text-base font-bold mt-1 group-hover:text-emerald-500 transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {hub.name}
                        </h4>
                        <p className={`text-xs flex items-center gap-1 mt-0.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {hub.location}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                          ₹{hub.pricingPerQuintalDay}
                        </span>
                        <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          /qtl / day
                        </span>
                      </div>
                    </div>

                    {/* Features badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        <ShieldCheck className="w-3 h-3" /> Dark Chamber Certified
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                      }`}>
                        <Zap className="w-3 h-3" /> {hub.powerBackupHrs}h Generator Backup
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        <Cpu className="w-3 h-3" /> {hub.activeSensorsCount} IoT Telemetry Nodes
                      </span>
                    </div>

                    {/* Live Capacity Bar */}
                    <div className={`mt-4 p-3 rounded-xl border space-y-1.5 ${
                      isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Available Free Volume
                        </span>
                        <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {hub.availableCapacityQuintals} / {hub.totalCapacityQuintals} Qtl
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${100 - capacityPercent}%` }}
                        />
                      </div>
                      <div className={`flex items-center justify-between text-[10px] ${
                        isDark ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                        <span>Distance: <strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>{hub.distanceKm} km away</strong></span>
                        <span>Facility Rating: <strong className="text-amber-500">★ {hub.rating}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`flex items-center gap-2 pt-2 border-t ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <a
                      href={`tel:${hub.contactPhone}`}
                      className={`p-2 rounded-xl transition-colors ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Call Warehouse Manager"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openBookingModal(hub)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Request Storage Bay</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
