import React from 'react';

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
  // Clamp score
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // SVG Gauge calculations (semi-circle / 240 degree arc)
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  
  // Angle: -210° to 30° (240 deg total arc)
  const startAngle = 150;
  const totalArc = 240;
  const currentAngle = startAngle + (clampedScore / 100) * totalArc;

  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? '0' : '1';
    return [
      'M', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  };

  const backgroundArc = describeArc(center, center, radius, 150, 390);
  const activeArc = clampedScore > 0 ? describeArc(center, center, radius, 150, currentAngle) : '';

  // Determine color based on score: Green (>75) -> Yellow (50-75) -> Red (<50)
  let strokeColor = '#10b981'; // emerald-500
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let statusText = 'Optimal Dormancy';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  if (clampedScore < 50) {
    strokeColor = '#f43f5e'; // rose-500
    glowColor = 'rgba(244, 63, 94, 0.5)';
    statusText = 'Critical Spoilage Risk';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (clampedScore < 75) {
    strokeColor = '#f59e0b'; // amber-500
    glowColor = 'rgba(245, 158, 11, 0.4)';
    statusText = 'Accelerated Decay';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size * 0.85 }}>
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <linearGradient id="gaugeBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={glowColor} />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d={backgroundArc}
            fill="none"
            stroke="url(#gaugeBg)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored Active Arc */}
          {clampedScore > 0 && (
            <path
              d={activeArc}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter="url(#gaugeGlow)"
              className="transition-all duration-300 ease-out"
            />
          )}

          {/* Indicator Dot at tip */}
          {clampedScore > 0 && (
            <circle
              cx={polarToCartesian(center, center, radius, currentAngle).x}
              cy={polarToCartesian(center, center, radius, currentAngle).y}
              r={strokeWidth * 0.55}
              fill="#ffffff"
              filter="url(#gaugeGlow)"
              className="transition-all duration-300 ease-out"
            />
          )}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono drop-shadow-sm">
            {clampedScore}
            <span className="text-xl text-slate-400 font-sans font-medium">%</span>
          </span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {/* Dynamic Status Badge */}
      <div className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all duration-200 ${badgeBg}`}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: strokeColor }} />
        {statusText}
      </div>

      {subtext && (
        <p className="text-[11px] text-slate-400 text-center mt-2 max-w-[200px]">
          {subtext}
        </p>
      )}
    </div>
  );
};
