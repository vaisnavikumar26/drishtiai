import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

export default function QualityBadge({ qualityData }) {
  if (!qualityData) return null;
  const { quality_score = 85, quality_status = 'Good', is_gradable = true, sharpness, illumination, contrast, fov, noise, recapture_guidance = [] } = qualityData;

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-400 stroke-emerald-400';
    if (score >= 50) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const getBadgeBg = (score) => {
    if (score >= 70) return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
    if (score >= 50) return 'bg-amber-950/60 border-amber-500/40 text-amber-300';
    return 'bg-rose-950/60 border-rose-500/40 text-rose-300';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          Retinal Image Quality Assessment
        </h4>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeBg(quality_score)}`}>
          {quality_status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        
        {/* Circular Gauge */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getScoreColor(quality_score)}
                strokeDasharray={`${quality_score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-black text-white leading-none">{quality_score}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">/ 100</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-300 font-semibold mt-1.5">Composite Score</span>
        </div>

        {/* Detailed Metrics Breakdown */}
        <div className="sm:col-span-2 space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-400">Sharpness / Focus</span>
              <span className="text-slate-200 font-semibold">{sharpness || 88}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-sky-400" style={{ width: `${sharpness || 88}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-400">Illumination Level</span>
              <span className="text-slate-200 font-semibold">{illumination || 85}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400" style={{ width: `${illumination || 85}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-400">Retinal Dynamic Contrast</span>
              <span className="text-slate-200 font-semibold">{contrast || 82}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400" style={{ width: `${contrast || 82}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-400">Field of View (FoV) Center</span>
              <span className="text-slate-200 font-semibold">{fov || 90}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400" style={{ width: `${fov || 90}%` }} />
            </div>
          </div>
        </div>

      </div>

      {/* Recapture Tips Alert (Displayed when score is borderline or poor) */}
      {recapture_guidance && recapture_guidance.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
            <AlertTriangle className="w-4 h-4" />
            <span>Recapture Guidance Recommendations:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90">
            {recapture_guidance.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}