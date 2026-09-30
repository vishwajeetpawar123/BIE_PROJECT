import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CROPS_DATA } from '../data/mockData';
import { CropId } from '../types';

export const CropDistributionPie: React.FC = () => {
  const { bays } = useApp();
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Compute breakdown by crop from active bays
  const cropTotals: Record<string, number> = {};
  let totalOccupied = 0;

  bays.forEach(bay => {
    if (bay.currentCrop && bay.occupiedQuintals > 0) {
      cropTotals[bay.currentCrop] = (cropTotals[bay.currentCrop] || 0) + bay.occupiedQuintals;
      totalOccupied += bay.occupiedQuintals;
    }
  });

  const cropColors: Record<CropId | string, { fill: string; border: string; glow: string }> = {
    onion: { fill: '#ea580c', border: '#f97316', glow: 'rgba(234, 88, 12, 0.4)' },
    potato: { fill: '#d97706', border: '#f59e0b', glow: 'rgba(217, 119, 6, 0.4)' },
    wheat: { fill: '#ca8a04', border: '#eab308', glow: 'rgba(202, 138, 4, 0.4)' },
    tomato: { fill: '#e11d48', border: '#f43f5e', glow: 'rgba(225, 29, 72, 0.4)' },
    pomegranate: { fill: '#9333ea', border: '#a855f7', glow: 'rgba(147, 51, 234, 0.4)' },
    soybean: { fill: '#16a34a', border: '#22c55e', glow: 'rgba(22, 163, 74, 0.4)' }
  };

  const slices = Object.entries(cropTotals).map(([cropKey, quintals]) => {
    const cropInfo = CROPS_DATA[cropKey];
    const percentage = totalOccupied > 0 ? Math.round((quintals / totalOccupied) * 100) : 0;
    const colors = cropColors[cropKey] || { fill: '#64748b', border: '#94a3b8', glow: 'rgba(100, 116, 139, 0.4)' };

    return {
      cropKey,
      name: cropInfo ? cropInfo.name.split(' ')[0] + ' (' + cropInfo.id.toUpperCase() + ')' : cropKey,
      fullName: cropInfo?.name || cropKey,
      quintals,
      percentage,
      ...colors
    };
  });

  // SVG Donut calculations
  const size = 200;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercent = 0;

  return (
    <div className="w-full bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 backdrop-blur-sm flex flex-col">
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-slate-200">
          Stored Commodity Mix
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time bay volume allocation ({totalOccupied} Qtl Active)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto pt-2">
        {/* Donut Chart */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90 select-none">
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
            />

            {slices.map(slice => {
              const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += slice.percentage;
              const isHovered = hoveredSlice === slice.cropKey;

              return (
                <circle
                  key={slice.cropKey}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={slice.fill}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice(slice.cropKey)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold font-mono text-white">
              {totalOccupied}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Quintals
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full">
          {slices.map(slice => {
            const isHovered = hoveredSlice === slice.cropKey;
            return (
              <div
                key={slice.cropKey}
                className={`p-2 rounded-lg transition-all duration-150 flex items-center justify-between text-xs cursor-pointer border ${
                  isHovered ? 'bg-slate-800 border-slate-700' : 'bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/50'
                }`}
                onMouseEnter={() => setHoveredSlice(slice.cropKey)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: slice.fill }}
                  />
                  <div>
                    <span className="text-slate-200 font-medium block truncate max-w-[120px]">
                      {slice.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {slice.quintals} Quintals
                    </span>
                  </div>
                </div>

                <span className="font-mono font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                  {slice.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
