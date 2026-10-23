import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SeverityCard({ prediction, predictionLevel, riskLevel, confidence }) {
  const isReferable = predictionLevel >= 2;

  const getRiskStyles = (level) => {
    switch (level) {
      case 0:
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/40',
          text: 'text-emerald-400',
          badge: '🟢 Low Risk',
          advice: 'Routine annual eye check-up recommended. Maintain healthy blood sugar levels.'
        };
      case 1:
        return {
          border: 'border-yellow-500/40',
          bg: 'bg-yellow-950/40',
          text: 'text-yellow-400',
          badge: '🟡 Mild Risk',
          advice: 'Early microvascular changes observed. Follow-up eye screening recommended in 6–9 months.'
        };
      case 2:
        return {
          border: 'border-orange-500/40',
          bg: 'bg-orange-950/40',
          text: 'text-orange-400',
          badge: '🟠 Moderate / Referable Risk',
          advice: 'AI screening indicates referable diabetic retinopathy. Consultation with an ophthalmologist is advised within 2–4 weeks.'
        };
      case 3:
      case 4:
        return {
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/50',
          text: 'text-rose-400',
          badge: '🔴 High / Advanced Risk',
          advice: 'Higher-risk retinal findings detected. Prompt clinical ophthalmological evaluation is strongly recommended.'
        };
      default:
        return {
          border: 'border-sky-500/40',
          bg: 'bg-sky-950/40',
          text: 'text-sky-400',
          badge: 'Screening Complete',
          advice: 'Consult your local health worker or doctor.'
        };
    }
  };

  const style = getRiskStyles(predictionLevel);

  return (
    <div className={`rounded-2xl p-5 border ${style.border} ${style.bg} shadow-xl backdrop-blur-md`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            DR Severity Classification
          </span>
          <h2 className="text-xl font-black text-white mt-0.5">
            {prediction}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.border} bg-black/40 ${style.text}`}>
            {style.badge}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-950 border border-sky-500/40 text-sky-300">
            Confidence: {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>

      <div className="space-y-2 text-xs text-slate-200">
        <p className="leading-relaxed">
          <strong className="text-white">Patient Explanation: </strong>
          {style.advice}
        </p>

        {isReferable && (
          <div className="mt-3 p-3 rounded-xl bg-black/40 border border-orange-500/30 flex items-start gap-2 text-orange-200 text-xs">
            <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <p>
              <strong>Ophthalmologist Referral Recommended: </strong>
              AI screening indicates findings requiring clinical confirmation. Please schedule a doctor consultation or visit your nearest primary eye care centre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}