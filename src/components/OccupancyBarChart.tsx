import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const OccupancyBarChart: React.FC = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const monthsData = [
    { month: 'Apr', occupancy: 64, projected: false, revenue: '₹2.1L' },
    { month: 'May', occupancy: 70, projected: false, revenue: '₹2.4L' },
    { month: 'Jun', occupancy: 75, projected: false, revenue: '₹2.7L' },
    { month: 'Jul', occupancy: 81, projected: false, revenue: '₹3.1L' },
    { month: 'Aug', occupancy: 85, projected: false, revenue: '₹3.4L' },
    { month: 'Sep (Now)', occupancy: 82, projected: false, revenue: '₹3.4L' },
    { month: 'Oct', occupancy: 91, projected: true, revenue: '₹3.9L (Est.)' },
    { month: 'Nov', occupancy: 95, projected: true, revenue: '₹4.2L (Est.)' },
    { month: 'Dec', occupancy: 88, projected: true, revenue: '₹3.7L (Est.)' }
  ];

  const width = 620;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;
  const barWidth = 32;

  const getX = (index: number) => {
    const step = graphWidth / monthsData.length;
    return padding.left + index * step + (step - barWidth) / 2;
  };

  const getY = (val: number) => {
    return padding.top + graphHeight - (val / 100) * graphHeight;
  };

  const activeItem = hoveredIdx !== null ? monthsData[hoveredIdx] : null;

  return (
    <div className={`w-full rounded-2xl p-5 border backdrop-blur-sm transition-colors ${
      isDark 
        ? 'bg-slate-900/70 border-slate-800' 
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div>
          <h4 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Historical & Projected Bay Occupancy
          </h4>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Post-harvest surge tracking across Western Maharashtra cluster
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500" />
            <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'}>
              Historical Actual
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500/60 border border-indigo-400/80 border-dashed" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              Projected Peak
            </span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(val => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}
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

          {/* 80% Optimal Target Line */}
          <line
            x1={padding.left}
            y1={getY(80)}
            x2={width - padding.right}
            y2={getY(80)}
            stroke="#10b981"
            strokeOpacity="0.6"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={width - padding.right}
            y={getY(80) - 5}
            textAnchor="end"
            className="text-[9px] fill-emerald-600 dark:fill-emerald-400 font-mono font-bold uppercase"
          >
            Target (80%)
          </text>

          {/* Bars */}
          {monthsData.map((d, i) => {
            const x = getX(i);
            const barH = (d.occupancy / 100) * graphHeight;
            const y = getY(d.occupancy);
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={d.month}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="6"
                  fill={d.projected ? 'url(#projectedGrad)' : 'url(#actualGrad)'}
                  stroke={d.projected ? '#818cf8' : '#22d3ee'}
                  strokeWidth={isHovered ? '2' : '1'}
                  strokeDasharray={d.projected ? '3 2' : undefined}
                  className="transition-all duration-200"
                  opacity={hoveredIdx !== null && !isHovered ? 0.6 : 1}
                />

                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-bold ${
                    isHovered
                      ? isDark ? 'fill-white' : 'fill-slate-900'
                      : isDark ? 'fill-slate-400' : 'fill-slate-600'
                  }`}
                >
                  {d.occupancy}%
                </text>

                <text
                  x={x + barWidth / 2}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  className={`text-[10px] font-semibold ${
                    isHovered
                      ? 'fill-cyan-600 dark:fill-cyan-400 font-bold'
                      : isDark ? 'fill-slate-400' : 'fill-slate-600'
                  }`}
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Info */}
      <div className={`mt-2 pt-2 border-t flex items-center justify-between text-xs font-mono ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
      }`}>
        <span>
          {activeItem ? (
            <>
              Selected: <strong className="text-cyan-600 dark:text-cyan-400">{activeItem.month}</strong> • Occupancy:{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeItem.occupancy}%</strong> • Revenue:{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">{activeItem.revenue}</strong>
            </>
          ) : (
            'Hover over any month to view facility utilization & revenue breakdown'
          )}
        </span>
        <span className="text-[11px] text-slate-500">Facility Max: 1,500 Quintals</span>
      </div>
    </div>
  );
};
