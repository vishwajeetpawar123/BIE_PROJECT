import React, { useState } from 'react';
import { CULTIVATION_STAGES } from '../../data/mockData';
import { 
  Sprout, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle, 
  Droplets, 
  Thermometer, 
  Layers, 
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';

export const CultivationLifecycle: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<number>(5); // Default to Harvest/Post-harvest
  const [completedChecklist, setCompletedChecklist] = useState<Record<string, boolean>>({
    'sample-1': true,
    'tricho-1': true,
    'seed-1': true
  });

  const activeStage = CULTIVATION_STAGES.find(s => s.id === activeStageId) || CULTIVATION_STAGES[0];

  const toggleChecklistItem = (item: string) => {
    setCompletedChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-amber-950/30 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Sprout className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Cultivation & Post-Harvest Life-Cycle Timeline
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Precision agronomical protocols from soil enrichment to certified dark vault transition for Maharashtra crop cycles.
        </p>
      </div>

      {/* Multi-Stage Interactive Stepper */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[700px] relative">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-800 -z-0" />
          
          {/* Active progress fill line */}
          <div 
            className="absolute top-5 left-8 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300 -z-0"
            style={{ width: `${((activeStageId - 1) / (CULTIVATION_STAGES.length - 1)) * 88}%` }}
          />

          {CULTIVATION_STAGES.map(stage => {
            const isActive = activeStageId === stage.id;
            const isPassed = activeStageId > stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-200 border-2 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 border-white ring-4 ring-emerald-500/30 scale-110 shadow-lg'
                      : isPassed
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                      : 'bg-slate-950 text-slate-500 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-5 h-5" /> : stage.id}
                </div>
                <span
                  className={`text-xs mt-2 font-semibold max-w-[100px] text-center transition-colors ${
                    isActive ? 'text-emerald-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {stage.name.split('&')[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {stage.durationWeeks.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Pane Updating on Stage Click */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stage Overview & Checklists (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  Stage {activeStage.id} of 6 • {activeStage.durationWeeks}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeStage.name}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Pest/Risk Level:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                  activeStage.pestRisk === 'High'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : activeStage.pestRisk === 'Moderate'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {activeStage.pestRisk} Risk
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeStage.description}
            </p>

            {/* Stage Critical Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Soil / Root Zone</span>
                <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
                  {activeStage.soilCondition}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Target Ambient Temp</span>
                <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                  {activeStage.optimalTemperature}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Moisture Target</span>
                <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                  {activeStage.recommendedMoisture}
                </div>
              </div>
            </div>

            {/* Interactive Checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Agronomic Field Protocols Checklist:
              </span>
              <div className="space-y-2">
                {activeStage.keyChecklist.map((item, idx) => {
                  const isChecked = !!completedChecklist[`${activeStage.id}-${idx}`];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleChecklistItem(`${activeStage.id}-${idx}`)}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'line-through text-slate-400' : ''}>
                          {item}
                        </span>
                      </div>
                      {isChecked && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Regional Maharashtra Advisory & Post-Harvest Dark Transition (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Regional Advisory Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Maharashtra Regional Advisory</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 leading-relaxed">
              <strong className="block text-amber-300 mb-1">Kisan Advisory Note:</strong>
              {activeStage.advisoryNote}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-emerald-400 block text-[11px] uppercase tracking-wider">
                Deccan Plateau Agro-Climatic Zone
              </span>
              <p className="leading-relaxed text-[11px]">
                {activeStage.maharashtraGuidance}
              </p>
            </div>
          </div>

          {/* Dark Storage Transfer Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Dark Storage Handoff Protocol</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transferring directly from harvest into a dark storage facility within <strong>48 hours</strong> preserves bulb turgidity and extends marketing window by up to <strong>150 days</strong>, bypassing monsoon distress sales!
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveStageId(6)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Inspect Stage 6: Dark Storage Vault Transfer →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
