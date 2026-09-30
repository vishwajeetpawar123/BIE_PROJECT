import React from 'react';
import { useApp } from '../context/AppContext';
import { FarmerTab, StorageOwnerTab } from '../types';
import { 
  LayoutDashboard, 
  FlaskConical, 
  MapPin, 
  Sprout, 
  TrendingUp, 
  Building2, 
  Sliders, 
  Inbox, 
  BarChart3,
  BadgeAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    role, 
    farmerTab, 
    setFarmerTab, 
    storageOwnerTab, 
    setStorageOwnerTab,
    bookingRequests,
    facilityStats
  } = useApp();

  const pendingRequestsCount = bookingRequests.filter(r => r.status === 'pending').length;

  const farmerNavItems: { id: FarmerTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Overview Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'decay_simulator',
      label: 'Crop Decay Simulator',
      icon: <FlaskConical className="w-4 h-4" />,
      badge: 'AI Core'
    },
    {
      id: 'storage_finder',
      label: 'Dark Storage Finder',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      id: 'lifecycle',
      label: 'Cultivation Lifecycle',
      icon: <Sprout className="w-4 h-4" />
    },
    {
      id: 'market_trends',
      label: 'Market Trends & Arbitrage',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: 'APMC'
    }
  ];

  const ownerNavItems: { id: StorageOwnerTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'facility_overview',
      label: 'Warehouse Overview',
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'telemetry_control',
      label: 'Live Telemetry & Control',
      icon: <Sliders className="w-4 h-4" />,
      badge: facilityStats.alertCount > 0 ? `${facilityStats.alertCount} Alert` : 'Live'
    },
    {
      id: 'booking_requests',
      label: 'Space Requests & Bookings',
      icon: <Inbox className="w-4 h-4" />,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending` : undefined
    },
    {
      id: 'occupancy_analytics',
      label: 'Occupancy Analytics',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-slate-950/60 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-3 lg:p-4">
      {/* Role Context Chip */}
      <div className="hidden lg:flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Current Context
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
          role === 'farmer'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
        }`}>
          {role === 'farmer' ? '🌾 Farmer View' : '🏭 Storage Node'}
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
        {role === 'farmer' ? (
          farmerNavItems.map(item => {
            const isActive = farmerTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFarmerTab(item.id)}
                className={`flex-shrink-0 lg:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })
        ) : (
          ownerNavItems.map(item => {
            const isActive = storageOwnerTab === item.id;
            const isAlert = item.id === 'telemetry_control' && facilityStats.alertCount > 0;
            const isPending = item.id === 'booking_requests' && pendingRequestsCount > 0;

            return (
              <button
                key={item.id}
                onClick={() => setStorageOwnerTab(item.id)}
                className={`flex-shrink-0 lg:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    isAlert
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : isPending
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })
        )}
      </nav>

      {/* Facility Quick Telemetry Summary on desktop for Storage Owner */}
      {role === 'storage_owner' && (
        <div className="hidden lg:block mt-8 p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Facility Capacity</span>
            <span className="font-mono font-bold text-white">
              {facilityStats.occupancyPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${facilityStats.occupancyPercent}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bays: <strong className="text-white">{facilityStats.activeBaysCount}/{facilityStats.totalBaysCount} Active</strong></span>
            <span>Est: <strong className="text-emerald-400">₹{(facilityStats.monthlyRevenueEstimate / 100000).toFixed(1)}L/mo</strong></span>
          </div>
        </div>
      )}

      {/* Regional Maharashtra Weather Digest */}
      <div className="hidden lg:block mt-auto pt-6 text-[11px] text-slate-500 border-t border-slate-800/60">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-400">Pune Agrimet Grid</span>
          <span className="text-emerald-400 font-mono">27°C • 62% RH</span>
        </div>
        <p className="leading-relaxed">
          IMD Advisory: Clear skies expected. Optimum window for harvesting and dark vault pre-cooling.
        </p>
      </div>
    </aside>
  );
};
