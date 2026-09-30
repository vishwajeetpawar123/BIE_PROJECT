import React from 'react';
import { useApp } from '../context/AppContext';

interface HealthGaugeProps {
  score: number; // 0 to 100
  label?: string;
  size?: number;
  subtext?: string;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  label = 'Quality Index',
  size = 200,
  subtext
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // SVG Gauge calculations (semi-circle / 240 degree arc)
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2.5) / 2;
  const center = size / 2;
  
  // Angle: 150° (bottom-left) to 390° (bottom-right) -> 240° total arc
  const startAngle = 150;
  const totalArc = 240;
  const currentAngle = startAngle + (clampedScore / 100) * totalArc;

  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, startA);
    const end = polarToCartesian(x, y, r, endA);
    const deltaAngle = endA - startA;
    const largeArcFlag = deltaAngle > 180 ? 1 : 0;
    // Sweep-flag = 1 for CLOCKWISE direction in SVG!
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  };

  const backgroundArc = describeArc(center, center, radius, 150, 390);
  const activeArc = clampedScore > 0 ? describeArc(center, center, radius, 150, currentAngle) : '';
  const indicatorPos = polarToCartesian(center, center, radius, currentAngle);

  // Determine color based on score: Green (>75) -> Yellow (50-75) -> Red (<50)
  let strokeColor = '#10b981'; // emerald-500
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let statusText = 'Optimal Dormancy';
  let badgeClasses = isDark
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : 'bg-emerald-50 text-emerald-700 border-emerald-300';

  if (clampedScore < 50) {
    strokeColor = '#f43f5e'; // rose-500
    glowColor = 'rgba(244, 63, 94, 0.5)';
    statusText = 'Critical Spoilage Risk';
    badgeClasses = isDark
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      : 'bg-rose-50 text-rose-700 border-rose-300';
  } else if (clampedScore < 75) {
    strokeColor = '#f59e0b'; // amber-500
    glowColor = 'rgba(245, 158, 11, 0.4)';
    statusText = 'Accelerated Decay';
    badgeClasses = isDark
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      : 'bg-amber-50 text-amber-700 border-amber-300';
  }

  // Generate minor tick markers around the arc
  const tickMarks = [0, 25, 50, 75, 100].map(pct => {
    const angle = startAngle + (pct / 100) * totalArc;
    const outerP = polarToCartesian(center, center, radius + strokeWidth * 0.8, angle);
    const innerP = polarToCartesian(center, center, radius + strokeWidth * 0.4, angle);
    return { pct, outerP, innerP };
  });

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size * 0.88 }}>
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <filter id={`gaugeGlow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={glowColor} />
            </filter>
          </defs>

          {/* Scale Tick Markers */}
          {tickMarks.map(t => (
            <line
              key={t.pct}
              x1={t.innerP.x}
              y1={t.innerP.y}
              x2={t.outerP.x}
              y2={t.outerP.y}
              stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}

          {/* Background Track (Clockwise 150° to 390°) */}
          <path
            d={backgroundArc}
            fill="none"
            stroke={isDark ? '#1e293b' : '#e2e8f0'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Value Arc (Clockwise 150° to currentAngle) */}
          {clampedScore > 0 && (
            <path
              d={activeArc}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter={`url(#gaugeGlow-${size})`}
              className="transition-all duration-300 ease-out"
            />
          )}

          {/* Indicator Dot at tip of score */}
          {clampedScore > 0 && (
            <circle
              cx={indicatorPos.x}
              cy={indicatorPos.y}
              r={strokeWidth * 0.58}
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth="3"
              filter={`url(#gaugeGlow-${size})`}
              className="transition-all duration-300 ease-out"
            />
          )}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 pointer-events-none">
          <span className={`text-4xl font-extrabold tracking-tight font-mono drop-shadow-sm transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {clampedScore}
            <span className={`text-xl font-sans font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              %
            </span>
          </span>
          <span className={`text-xs uppercase tracking-wider font-semibold mt-0.5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {label}
          </span>
        </div>
      </div>

      {/* Dynamic Status Badge */}
      <div className={`mt-0.5 px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all duration-200 ${badgeClasses}`}>
        <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: strokeColor }} />
        <span>{statusText}</span>
      </div>

      {subtext && (
        <p className={`text-[11px] text-center mt-2 max-w-[210px] ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {subtext}
        </p>
      )}
    </div>
  );
};
