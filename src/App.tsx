import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RequestBayModal } from './components/RequestBayModal';

// Farmer Views
import { FarmerOverview } from './views/farmer/FarmerOverview';
import { CropDecaySimulator } from './views/farmer/CropDecaySimulator';
import { StorageFinder } from './views/farmer/StorageFinder';
import { CultivationLifecycle } from './views/farmer/CultivationLifecycle';
import { MarketTrends } from './views/farmer/MarketTrends';

// Storage Owner Views
import { WarehouseOverview } from './views/owner/WarehouseOverview';
import { TelemetryControl } from './views/owner/TelemetryControl';
import { BookingRequests } from './views/owner/BookingRequests';
import { OccupancyAnalytics } from './views/owner/OccupancyAnalytics';

export const AppContent: React.FC = () => {
  const { role, theme, farmerTab, storageOwnerTab } = useApp();
  const isDark = theme === 'dark';

  const renderActiveView = () => {
    if (role === 'farmer') {
      switch (farmerTab) {
        case 'overview':
          return <FarmerOverview />;
        case 'decay_simulator':
          return <CropDecaySimulator />;
        case 'storage_finder':
          return <StorageFinder />;
        case 'lifecycle':
          return <CultivationLifecycle />;
        case 'market_trends':
          return <MarketTrends />;
        default:
          return <FarmerOverview />;
      }
    } else {
      switch (storageOwnerTab) {
        case 'facility_overview':
          return <WarehouseOverview />;
        case 'telemetry_control':
          return <TelemetryControl />;
        case 'booking_requests':
          return <BookingRequests />;
        case 'occupancy_analytics':
          return <OccupancyAnalytics />;
        default:
          return <WarehouseOverview />;
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200' 
        : 'bg-slate-50 text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-900'
    }`}>
      {/* Top Header */}
      <Header />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="animate-in fade-in duration-200">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Persistent Global Modals */}
      <RequestBayModal />

      {/* Enterprise Platform Footer */}
      <footer className={`border-t py-4 px-4 text-center text-xs transition-colors ${
        isDark 
          ? 'border-slate-900 bg-slate-950/90 text-slate-500' 
          : 'border-slate-200 bg-white/90 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              KisanSeva AI
            </span>
            <span>• Smart Farmer & Dark Storage Management Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Western Maharashtra Cluster (Pune • Nashik • Satara)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              ● Edge Gateway: Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
