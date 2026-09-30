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
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    theme,
    toggleTheme,
    notifications, 
    dismissNotification, 
    clearAllNotifications, 
    resetToDefaults,
    setFarmerTab,
    setStorageOwnerTab
  } = useApp();

  const isDark = theme === 'dark';
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
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b px-4 lg:px-8 py-3 transition-colors ${
      isDark 
        ? 'bg-slate-950/85 border-slate-800/80 text-white' 
        : 'bg-white/90 border-slate-200 shadow-2xs text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Branding & Live Regional Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 ${
              role === 'farmer' 
                ? isDark 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 glow-emerald' 
                  : 'bg-emerald-50 border-emerald-300 text-emerald-600 shadow-sm'
                : isDark 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 glow-cyan'
                  : 'bg-cyan-50 border-cyan-300 text-cyan-600 shadow-sm'
            }`}>
              {role === 'farmer' ? (
                <Sprout className="w-6 h-6 animate-pulse" />
              ) : (
                <Warehouse className="w-6 h-6 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-lg font-black tracking-tight flex items-center gap-1.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  KisanSeva{' '}
                  <span className={role === 'farmer' ? 'text-emerald-500' : 'text-cyan-500'}>
                    AI
                  </span>
                </h1>
                <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold border ${
                  isDark 
                    ? 'bg-slate-800 text-slate-300 border-slate-700' 
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  v2.4 IoT
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className={`text-xs font-medium tracking-wide ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Pune Hub • Edge Node Active{' '}
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                    18ms
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: High-Visibility Role Toggle Switch */}
        <div className="flex items-center justify-center">
          <div className={`p-1 rounded-2xl border shadow-inner flex items-center gap-1 transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => handleRoleToggle('farmer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                role === 'farmer'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-[1.02]'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
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
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/30 scale-[1.02]'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
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

        {/* Right: Quick Controls, Theme Switcher & Notification Feed */}
        <div className="flex items-center gap-2 justify-end">
          {/* Light / Dark Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900 text-amber-400 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 shadow-2xs'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetToDefaults}
            title="Reset platform demo data"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
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
              <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}>
                <div className={`flex items-center justify-between pb-2 mb-2 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-slate-800'
                    }`}>
                      Live Telemetry & Alerts ({notifications.length})
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
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
                            ? isDark
                              ? 'bg-amber-500/10 border-amber-500/25 hover:bg-amber-500/15'
                              : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-900'
                            : n.type === 'success'
                            ? isDark
                              ? 'bg-emerald-500/10 border-emerald-500/25 hover:bg-emerald-500/15'
                              : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-900'
                            : isDark
                            ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className={`flex items-center gap-1.5 font-bold ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            {n.type === 'warning' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            ) : n.type === 'success' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <Info className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                            )}
                            <span className="truncate">{n.title}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(n.id);
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className={`mt-1 line-clamp-2 leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {n.message}
                        </p>
                        <div className={`flex items-center justify-between mt-2 pt-1 text-[10px] border-t ${
                          isDark ? 'text-slate-500 border-slate-800/60' : 'text-slate-400 border-slate-200'
                        }`}>
                          <span>{n.timestamp}</span>
                          {n.linkTab && (
                            <span className="flex items-center text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
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
