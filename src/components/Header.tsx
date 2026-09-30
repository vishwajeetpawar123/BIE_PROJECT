import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  Warehouse, 
  Activity, 
  Bell, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X,
  ChevronRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    notifications, 
    dismissNotification, 
    clearAllNotifications, 
    resetToDefaults,
    setFarmerTab,
    setStorageOwnerTab
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleToggle = (targetRole: 'farmer' | 'storage_owner') => {
    setRole(targetRole);
  };

  const handleNotificationClick = (linkTab?: string) => {
    setIsNotifOpen(false);
    if (!linkTab) return;
    if (role === 'farmer') {
      if (['overview', 'decay_simulator', 'storage_finder', 'lifecycle', 'market_trends'].includes(linkTab)) {
        setFarmerTab(linkTab as any);
      }
    } else {
      if (['facility_overview', 'telemetry_control', 'booking_requests', 'occupancy_analytics'].includes(linkTab)) {
        setStorageOwnerTab(linkTab as any);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Branding & Live Regional Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 ${
              role === 'farmer' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 glow-emerald' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 glow-cyan'
            }`}>
              {role === 'farmer' ? (
                <Sprout className="w-6 h-6 animate-pulse" />
              ) : (
                <Warehouse className="w-6 h-6 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  KisanSeva <span className={role === 'farmer' ? 'text-emerald-400' : 'text-cyan-400'}>AI</span>
                </h1>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  v2.4 IoT
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  Pune Hub • Edge Node Active <span className="font-mono text-[11px] text-emerald-400/90 ml-1">18ms</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: High-Visibility Role Toggle Switch */}
        <div className="flex items-center justify-center">
          <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner flex items-center gap-1">
            <button
              onClick={() => handleRoleToggle('farmer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                role === 'farmer'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base">🌾</span>
              <span>Farmer Portal</span>
              {role === 'farmer' && (
                <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => handleRoleToggle('storage_owner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                role === 'storage_owner'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base">🏭</span>
              <span>Dark Storage Owner Portal</span>
              {role === 'storage_owner' && (
                <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Right: Quick Controls & Notification Feed */}
        <div className="flex items-center gap-2 justify-end">
          {/* Reset Demo Data */}
          <button
            onClick={resetToDefaults}
            title="Reset platform demo data"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Live Telemetry & Alerts ({notifications.length})
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">
                      No recent notifications
                    </p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.linkTab)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors relative group ${
                          n.type === 'warning' || n.type === 'alert'
                            ? 'bg-amber-500/10 border-amber-500/25 hover:bg-amber-500/15'
                            : n.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/25 hover:bg-emerald-500/15'
                            : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                            {n.type === 'warning' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            ) : n.type === 'success' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            )}
                            <span className="truncate">{n.title}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(n.id);
                            }}
                            className="text-slate-500 hover:text-slate-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-500 border-t border-slate-800/60">
                          <span>{n.timestamp}</span>
                          {n.linkTab && (
                            <span className="flex items-center text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                              Open View <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
