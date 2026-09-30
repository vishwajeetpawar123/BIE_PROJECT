import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MANDI_TRENDS, CROPS_DATA } from '../../data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Building
} from 'lucide-react';

export const MarketTrends: React.FC = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [selectedCrop, setSelectedCrop] = useState<string>('onion');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(120);
  const [holdingDays, setHoldingDays] = useState<number>(60);

  const crop = CROPS_DATA[selectedCrop] || CROPS_DATA.onion;
  const mandiItem = MANDI_TRENDS.find(m => m.crop.toLowerCase().includes(crop.id)) || MANDI_TRENDS[0];

  const spotRate = mandiItem.modalPricePerQtl;
  const projectedRate = mandiItem.darkStorageProjectedPrice;
  const storageCostPerQtlDay = 3.6; // Average ₹3.60/qtl/day

  const currentSaleRevenue = spotRate * quantityQuintals;
  const futureSaleRevenue = projectedRate * quantityQuintals;
  const totalStorageFee = Math.round(storageCostPerQtlDay * quantityQuintals * holdingDays);
  const netArbitrageProfit = futureSaleRevenue - currentSaleRevenue - totalStorageFee;
  const roiPercentage = currentSaleRevenue > 0 ? Math.round((netArbitrageProfit / currentSaleRevenue) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-5 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border-slate-800'
          : 'bg-gradient-to-r from-emerald-50 via-white to-indigo-50 border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <TrendingUp className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Mandi Price Intelligence & Dark Storage Arbitrage
          </h2>
        </div>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Live modal rates from Lasalgaon, Pune, Satara, and Vashi APMCs with AI predictive price arbitrage.
        </p>
      </div>

      {/* APMC Mandi Real-Time Ticker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MANDI_TRENDS.map(m => {
          const isPositive = m.priceChangePercent >= 0;
          return (
            <div
              key={m.mandi}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{m.district} APMC</span>
                  <span className="flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400">
                    <Building className="w-3 h-3" /> Live
                  </span>
                </div>
                <h4 className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {m.crop}
                </h4>
                <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {m.mandi.split('(')[0]}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline justify-between mt-3">
                  <div className={`text-xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ₹{m.modalPricePerQtl.toLocaleString()}
                    <span className="text-[10px] text-slate-500 font-sans font-normal ml-1">/qtl</span>
                  </div>
                  <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
                    isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {isPositive ? '+' : ''}{m.priceChangePercent}%
                  </span>
                </div>

                {/* Mini SVG Trend Line */}
                <div className="mt-2 w-full h-8">
                  <svg className="w-full h-full" viewBox="0 0 120 30">
                    <path
                      d={m.priceHistory.reduce((acc, curr, i) => {
                        const min = Math.min(...m.priceHistory.map(p => p.price));
                        const max = Math.max(...m.priceHistory.map(p => p.price));
                        const x = (i / (m.priceHistory.length - 1)) * 120;
                        const y = 26 - ((curr.price - min) / (max - min || 1)) * 22;
                        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke={isPositive ? '#10b981' : '#f43f5e'}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              {/* Recommendation Badge */}
              <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border block text-center ${
                  m.recommendation === 'HOLD IN DARK STORAGE'
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : isDark
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {m.recommendation}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dark Storage Arbitrage & Profitability Calculator */}
      <div className={`p-6 rounded-2xl border space-y-6 transition-colors ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Dark Storage ROI & Price Arbitrage Calculator
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Simulate: "Sell Today at Mandi" vs "Hold in Precision Dark Vault for Festival Rebound"
              </p>
            </div>
          </div>

          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            isDark ? 'bg-cyan-950 text-cyan-400 border-cyan-800' : 'bg-cyan-50 text-cyan-700 border-cyan-200'
          }`}>
            e-NAM Integrated
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Select Crop Lot
            </label>
            <select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="onion">Nashik Red Onion</option>
              <option value="potato">Kufri Jyoti Potato</option>
              <option value="wheat">Lokwan Wheat</option>
              <option value="tomato">Hybrid Tomato</option>
              <option value="pomegranate">Bhagwa Pomegranate</option>
            </select>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Lot Quantity (Quintals)
            </label>
            <input
              type="number"
              min="10"
              max="2000"
              value={quantityQuintals}
              onChange={e => setQuantityQuintals(Math.max(1, Number(e.target.value)))}
              className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:border-cyan-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Holding Duration in Dark Storage
            </label>
            <div className="flex gap-2">
              {[30, 60, 90].map(d => (
                <button
                  key={d}
                  onClick={() => setHoldingDays(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    holdingDays === d
                      ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500 font-bold'
                      : isDark
                      ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Option A: Sell Today */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Scenario A: Sell Today at Spot Mandi
            </span>
            <div className={`text-xl font-bold font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              ₹{currentSaleRevenue.toLocaleString()}
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Based on today’s modal rate of ₹{spotRate}/qtl
            </p>
          </div>

          {/* Option B: Projected Value */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-xs font-bold uppercase tracking-wider block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Scenario B: Dark Storage Deferred Sale
            </span>
            <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
              ₹{futureSaleRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Projected: ₹{projectedRate}/qtl</span>
              <span>Storage Fee: -₹{totalStorageFee.toLocaleString()}</span>
            </div>
          </div>

          {/* Net Advantage */}
          <div className={`p-4 rounded-xl border space-y-2 shadow-sm ${
            isDark
              ? 'bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-emerald-50/70 border-emerald-300 shadow-emerald-500/5'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
                Net Extra Gain
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30">
                +{roiPercentage}% Return
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              +₹{netArbitrageProfit.toLocaleString()}
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Net surplus pocketed after deducting all cold storage and IoT monitoring charges!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
