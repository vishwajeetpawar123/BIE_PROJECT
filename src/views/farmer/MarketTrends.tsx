import React, { useState } from 'react';
import { MANDI_TRENDS, CROPS_DATA } from '../../data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  ArrowRight, 
  Sparkles, 
  BadgePercent,
  Coins,
  ShieldCheck,
  Building
} from 'lucide-react';

export const MarketTrends: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('onion');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(120);
  const [holdingDays, setHoldingDays] = useState<number>(60);

  // Selected crop baseline
  const crop = CROPS_DATA[selectedCrop] || CROPS_DATA.onion;
  const mandiItem = MANDI_TRENDS.find(m => m.crop.toLowerCase().includes(crop.id)) || MANDI_TRENDS[0];

  // Arbitrage calculations
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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Mandi Price Intelligence & Dark Storage Arbitrage
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
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
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{m.district} APMC</span>
                  <span className="flex items-center gap-1 font-semibold text-cyan-400">
                    <Building className="w-3 h-3" /> Live
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  {m.crop}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {m.mandi.split('(')[0]}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline justify-between mt-3">
                  <div className="text-xl font-black font-mono text-white">
                    ₹{m.modalPricePerQtl.toLocaleString()}
                    <span className="text-[10px] text-slate-500 font-sans font-normal ml-1">/qtl</span>
                  </div>
                  <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
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
              <div className="pt-2 border-t border-slate-800">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border block text-center ${
                  m.recommendation === 'HOLD IN DARK STORAGE'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {m.recommendation}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dark Storage Arbitrage & Profitability Calculator */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Dark Storage ROI & Price Arbitrage Calculator
              </h3>
              <p className="text-xs text-slate-400">
                Simulate: "Sell Today at Mandi" vs "Hold in Precision Dark Vault for Festival Rebound"
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            e-NAM Integrated
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Crop Lot
            </label>
            <select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="onion">Nashik Red Onion</option>
              <option value="potato">Kufri Jyoti Potato</option>
              <option value="wheat">Lokwan Wheat</option>
              <option value="tomato">Hybrid Tomato</option>
              <option value="pomegranate">Bhagwa Pomegranate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lot Quantity (Quintals)
            </label>
            <input
              type="number"
              min="10"
              max="2000"
              value={quantityQuintals}
              onChange={e => setQuantityQuintals(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Holding Duration in Dark Storage
            </label>
            <div className="flex gap-2">
              {[30, 60, 90].map(d => (
                <button
                  key={d}
                  onClick={() => setHoldingDays(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    holdingDays === d
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
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
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Scenario A: Sell Today at Spot Mandi
            </span>
            <div className="text-xl font-bold font-mono text-slate-300">
              ₹{currentSaleRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500">
              Based on today’s modal rate of ₹{spotRate}/qtl
            </p>
          </div>

          {/* Option B: Projected Value */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Scenario B: Dark Storage Deferred Sale
            </span>
            <div className="text-xl font-bold font-mono text-cyan-400">
              ₹{futureSaleRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Projected: ₹{projectedRate}/qtl</span>
              <span>Fee: -₹{totalStorageFee.toLocaleString()}</span>
            </div>
          </div>

          {/* Net Advantage */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-2 shadow-lg shadow-emerald-500/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                Net Extra Gain
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                +{roiPercentage}% Return
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              +₹{netArbitrageProfit.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-300">
              Net surplus pocketed after deducting all cold storage and IoT monitoring charges!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
