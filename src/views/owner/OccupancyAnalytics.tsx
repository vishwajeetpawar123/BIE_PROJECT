import React from 'react';
import { useApp } from '../../context/AppContext';
import { OccupancyBarChart } from '../../components/OccupancyBarChart';
import { CropDistributionPie } from '../../components/CropDistributionPie';
import { 
  BarChart3, 
  TrendingUp, 
  Coins, 
  Layers, 
  Zap, 
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const OccupancyAnalytics: React.FC = () => {
  const { facilityStats, bays } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <BarChart3 className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Occupancy & Revenue Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Longitudinal capacity utilization, crop volume distribution, and predictive yield metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Target Efficiency:</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-800/80">
            92% Optimum
          </span>
        </div>
      </div>

      {/* Top Charts Grid: Historical/Projected Bar Chart + Crop Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <OccupancyBarChart />
        </div>
        <div className="lg:col-span-5">
          <CropDistributionPie />
        </div>
      </div>

      {/* Operational Economics & Efficiency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Unit Economics */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Chamber Unit Economics
            </span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            ₹3.62{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">/ Qtl / Day</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Energy / HVAC Cost:</span>
              <span className="font-mono text-slate-200">₹0.95/qtl/d</span>
            </div>
            <div className="flex justify-between">
              <span>Sensor & Cloud IoT Cost:</span>
              <span className="font-mono text-slate-200">₹0.15/qtl/d</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-slate-800/60">
              <span>Gross Operating Margin:</span>
              <span className="font-mono">70.4%</span>
            </div>
          </div>
        </div>

        {/* HVAC Compressor Energy Stability */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              HVAC Cop Coefficient
            </span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400">
            3.84{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">COP Rating</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
            Variable frequency compressors in bays B-1 through B-4 maintain steady-state inverter frequency, saving <strong>24% KWh</strong> over baseline cold storage.
          </p>
        </div>

        {/* Post-Harvest Season Outlook */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Q4 Festival Surge Forecast
            </span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            +38% Demand
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
            Anticipated Diwali & wedding season demand across Pune & Mumbai retail markets will drive 95%+ utilization for Onion and Potato dark vaults.
          </p>
        </div>
      </div>
    </div>
  );
};
