import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CropInfo } from '../types';

interface DecayPredictorChartProps {
  crop: CropInfo;
  currentTemp: number;
  currentHumidity: number;
  healthScore: number;
  simulatedShelfLifeDays: number;
}

export const DecayPredictorChart: React.FC<DecayPredictorChartProps> = ({
  crop,
  currentTemp,
  currentHumidity,
  healthScore,
  simulatedShelfLifeDays
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Time horizon
  const maxDays = Math.max(60, Math.min(365, crop.maxShelfLifeColdStorageDays));
  const pointsCount = 25;
  const daysStep = maxDays / (pointsCount - 1);

  // Calculate decay rate multiplier based on temp and humidity deviation
  const tempDeviation = Math.max(0, currentTemp - crop.idealTemp);
  const humDeviation = Math.abs(currentHumidity - crop.idealHumidity);
  
  const decayRateCurrent = 1.0 + (tempDeviation * 0.08 * crop.decayFactorTemp) + (humDeviation * 0.03 * crop.decayFactorHumidity);
  const decayRateAmbient = 3.5; // Traditional uncooled shed
  const decayRateIdeal = 1.0;   // Precision Dark Storage

  // Generate data points
  const data = Array.from({ length: pointsCount }, (_, i) => {
    const day = Math.round(i * daysStep);
    const baseLife = crop.standardShelfLifeDays;
    
    const currentQ = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-(day * decayRateCurrent) / (baseLife * 1.5)))));
    const idealQ = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-(day * decayRateIdeal) / (crop.maxShelfLifeColdStorageDays * 0.8)))));
    const ambientQ = Math.max(0, Math.min(100, Math.round(100 * Math.exp(-(day * decayRateAmbient) / (baseLife * 1.2)))));

    return {
      day,
      currentQ,
      idealQ,
      ambientQ
    };
  });

  // SVG dimensions
  const width = 640;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (day: number) => padding.left + (day / maxDays) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - (val / 100) * graphHeight;

  const generatePath = (key: 'currentQ' | 'idealQ' | 'ambientQ') => {
    return data.reduce((acc, curr, idx) => {
      const x = getX(curr.day);
      const y = getY(curr[key]);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const generateArea = (key: 'currentQ') => {
    const linePath = generatePath(key);
    const lastX = getX(data[data.length - 1].day);
    const firstX = getX(data[0].day);
    const bottomY = getY(0);
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  let currentLineColor = '#10b981'; // emerald
  if (healthScore < 50) currentLineColor = '#f43f5e'; // rose
  else if (healthScore < 75) currentLineColor = '#f59e0b'; // amber

  const hoveredItem = hoverIndex !== null ? data[hoverIndex] : data[Math.floor(pointsCount / 3)];

  return (
    <div className={`w-full flex flex-col rounded-2xl p-5 border backdrop-blur-sm transition-colors ${
      isDark
        ? 'bg-slate-900/70 border-slate-800'
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Header and Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Predictive Shelf-Life Decay Curves
            </h4>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
              isDark
                ? 'bg-slate-800 text-slate-300 border-slate-700'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}>
              {crop.name}
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Projected quality retention % over {maxDays} days of storage
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full" style={{ backgroundColor: currentLineColor }} />
            <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Your Simulation
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Optimal Dark Storage
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-slate-400" />
            <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
              Uncooled Shed
            </span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="currentAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentLineColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={currentLineColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 25, 50, 75, 100].map(val => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}
                strokeDasharray={val === 50 ? '3 3' : undefined}
              />
              <text
                x={padding.left - 8}
                y={getY(val) + 4}
                textAnchor="end"
                className={`text-[10px] font-mono ${isDark ? 'fill-slate-500' : 'fill-slate-500'}`}
              >
                {val}%
              </text>
            </g>
          ))}

          {/* 50% Threshold warning label */}
          <line
            x1={padding.left}
            y1={getY(50)}
            x2={width - padding.right}
            y2={getY(50)}
            stroke="#f59e0b"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={width - padding.right}
            y={getY(50) - 5}
            textAnchor="end"
            className="text-[9px] fill-amber-500 font-mono font-bold uppercase tracking-wider"
          >
            Market Minimum (50%)
          </text>

          {/* Day Grid Lines (vertical) */}
          {[0, Math.round(maxDays * 0.25), Math.round(maxDays * 0.5), Math.round(maxDays * 0.75), maxDays].map(day => (
            <g key={day}>
              <line
                x1={getX(day)}
                y1={padding.top}
                x2={getX(day)}
                y2={height - padding.bottom}
                stroke={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
              />
              <text
                x={getX(day)}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                className={`text-[10px] font-mono ${isDark ? 'fill-slate-400' : 'fill-slate-600'}`}
              >
                Day {day}
              </text>
            </g>
          ))}

          {/* Curves */}
          <path
            d={generatePath('ambientQ')}
            fill="none"
            stroke={isDark ? '#64748b' : '#94a3b8'}
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          <path
            d={generatePath('idealQ')}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeOpacity="0.9"
          />

          <path d={generateArea('currentQ')} fill="url(#currentAreaGrad)" />

          <path
            d={generatePath('currentQ')}
            fill="none"
            stroke={currentLineColor}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Hover Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoveredItem.day)}
                y1={padding.top}
                x2={getX(hoveredItem.day)}
                y2={height - padding.bottom}
                stroke={isDark ? '#94a3b8' : '#475569'}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoveredItem.day)}
                cy={getY(hoveredItem.currentQ)}
                r="5"
                fill={currentLineColor}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle
                cx={getX(hoveredItem.day)}
                cy={getY(hoveredItem.idealQ)}
                r="3.5"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="1"
              />
            </g>
          )}

          {/* Hover hit areas */}
          {data.map((pt, i) => (
            <rect
              key={i}
              x={getX(pt.day) - daysStep * 0.5 * (graphWidth / maxDays)}
              y={padding.top}
              width={daysStep * (graphWidth / maxDays)}
              height={graphHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}
        </svg>
      </div>

      {/* Floating Readout Banner */}
      <div className={`mt-2 pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono">
            <span>Position:</span>
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>Day {hoveredItem.day}</strong>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span>Simulated Quality:</span>
            <strong style={{ color: currentLineColor }}>
              {hoveredItem.currentQ}%
            </strong>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span>Dark Vault Optimal:</span>
            <strong className="text-emerald-600 dark:text-emerald-400">{hoveredItem.idealQ}%</strong>
          </div>
        </div>

        <div className="text-[11px]">
          Estimated Marketable Life: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{simulatedShelfLifeDays} Days</strong>
        </div>
      </div>
    </div>
  );
};
