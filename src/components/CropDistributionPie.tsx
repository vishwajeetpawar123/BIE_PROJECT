import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CROPS_DATA } from '../data/mockData';
import { CropId } from '../types';

export const CropDistributionPie: React.FC = () => {
  const { bays, theme } = useApp();
  const isDark = theme === 'dark';
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

  const cropColors: Record<CropId | string, { fill: string; border: string }> = {
    onion: { fill: '#ea580c', border: '#f97316' },
    potato: { fill: '#d97706', border: '#f59e0b' },
    wheat: { fill: '#ca8a04', border: '#eab308' },
    tomato: { fill: '#e11d48', border: '#f43f5e' },
    pomegranate: { fill: '#9333ea', border: '#a855f7' },
    soybean: { fill: '#16a34a', border: '#22c55e' }
  };

  const slices = Object.entries(cropTotals).map(([cropKey, quintals]) => {
    const cropInfo = CROPS_DATA[cropKey];
    const percentage = totalOccupied > 0 ? Math.round((quintals / totalOccupied) * 100) : 0;
    const colors = cropColors[cropKey] || { fill: '#64748b', border: '#94a3b8' };

    return {
      cropKey,
      name: cropInfo ? cropInfo.name.split(' ')[0] : cropKey,
      fullName: cropInfo?.name || cropKey,
      quintals,
      percentage,
      ...colors
    };
  });

  // SVG Donut calculations
  const size = 190;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Track cumulative offset cleanly
  let cumulative = 0;
  const sliceElements = slices.map(slice => {
    // Gap subtraction for crisp separation
    const sliceLength = (slice.percentage / 100) * circumference;
    const dashLength = Math.max(0, sliceLength - 2);
    const strokeDasharray = `${dashLength} ${circumference - dashLength}`;
    const strokeDashoffset = -cumulative;
    cumulative += sliceLength;
    const isHovered = hoveredSlice === slice.cropKey;

    return {
      ...slice,
      strokeDasharray,
      strokeDashoffset,
      isHovered
    };
  });

  return (
    <div className={`w-full rounded-2xl p-5 border backdrop-blur-sm flex flex-col transition-colors ${
      isDark 
        ? 'bg-slate-900/80 border-slate-800' 
        : 'bg-white border-slate-200/80 shadow-sm'
    }`}>
      <div className="mb-2">
        <h4 className={`text-sm font-bold transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Stored Commodity Mix
        </h4>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Real-time bay volume allocation ({totalOccupied} Qtl Active)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto pt-2">
        {/* Donut Chart */}
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90 select-none">
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
              strokeWidth={strokeWidth}
            />

            {totalOccupied > 0 ? (
              sliceElements.map(slice => (
                <circle
                  key={slice.cropKey}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={slice.fill}
                  strokeWidth={slice.isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredSlice(slice.cropKey)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              ))
            ) : (
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={isDark ? '#334155' : '#cbd5e1'}
                strokeWidth={strokeWidth}
                strokeDasharray="4 4"
              />
            )}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={`text-2xl font-bold font-mono transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {totalOccupied}
            </span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Quintals
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full">
          {slices.length === 0 ? (
            <p className={`text-xs text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No commodities currently allocated in bays.
            </p>
          ) : (
            slices.map(slice => {
              const isHovered = hoveredSlice === slice.cropKey;
              return (
                <div
                  key={slice.cropKey}
                  className={`p-2 rounded-xl transition-all duration-150 flex items-center justify-between text-xs cursor-pointer border ${
                    isHovered
                      ? isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-slate-100 border-slate-300'
                      : isDark
                      ? 'bg-slate-950/60 border-slate-800/60 hover:bg-slate-800/50'
                      : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100'
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
                      <span className={`font-semibold block truncate max-w-[120px] ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {slice.name}
                      </span>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {slice.quintals} Quintals
                      </span>
                    </div>
                  </div>

                  <span className={`font-mono font-bold px-2 py-0.5 rounded border text-xs ${
                    isDark
                      ? 'text-white bg-slate-900 border-slate-700'
                      : 'text-slate-800 bg-white border-slate-200 shadow-2xs'
                  }`}>
                    {slice.percentage}%
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
