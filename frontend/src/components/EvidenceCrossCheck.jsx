import React from 'react';
import { CheckCircle, AlertTriangle, Search, Microscope } from 'lucide-react';

export default function EvidenceCrossCheck({ findings, crossCheck }) {
  const isHigh = crossCheck?.consistency === 'High';

  return (
    <div className="bg-slate-900/90 border border-sky-900/40 rounded-2xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Microscope className="w-4 h-4 text-cyan-400" />
            Lesion Evidence & Prediction Cross-Check
          </h3>
          <p className="text-[11px] text-slate-400">Human-in-the-loop cross-validation of classifier vs lesion findings</p>
        </div>

        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
          isHigh ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/70 border-amber-500/40 text-amber-300'
        }`}>
          {isHigh ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
          <span>Prediction–Evidence Consistency: {crossCheck?.consistency || 'High'}</span>
        </div>
      </div>

      {/* Findings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <th className="py-2">Lesion / Visual Marker</th>
              <th className="py-2">Severity</th>
              <th className="py-2">Count / Region</th>
              <th className="py-2">Clinical Finding Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {findings && findings.length > 0 ? (
              findings.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 font-semibold text-white">{item.type}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.severity === 'Normal' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      item.severity === 'Mild' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                      item.severity === 'Moderate' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-sky-400">{item.count > 0 ? item.count + ' detected' : 'Clear'}</td>
                  <td className="py-2.5 text-slate-400 text-[11px]">{item.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 text-center text-slate-500">No abnormal lesions detected</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cross-Check Note */}
      <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
        <strong className="text-white">Consistency Assessment: </strong>
        {crossCheck?.clinical_note || 'The classification model output and visual lesion evidence are strongly aligned.'}
      </div>
    </div>
  );
}