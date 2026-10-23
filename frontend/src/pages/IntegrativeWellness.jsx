import React from 'react';
import { HeartPulse, ShieldAlert, BookOpen, ExternalLink, Leaf, Sparkles, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { WELLNESS_DATA } from '../data/wellnessData.js';

export default function IntegrativeWellness({ setActiveTab }) {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 p-8 rounded-3xl shadow-xl">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Leaf className="w-4 h-4" />
          <span>Culturally Aware Preventive Education Layer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('wellness_title')}
        </h1>
        <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
          {t('wellness_subtitle')}
        </p>
      </div>

      {/* MANDATORY MEDICAL SAFETY NOTICE BOX */}
      <div className="p-6 rounded-3xl bg-amber-950/50 border-2 border-amber-500/60 shadow-xl text-xs space-y-3 backdrop-blur-md">
        <div className="flex items-center space-x-2 text-amber-400 font-black text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{WELLNESS_DATA.safetyNotice.title}</span>
        </div>
        <p className="text-amber-200/90 leading-relaxed font-medium">
          {WELLNESS_DATA.safetyNotice.statement}
        </p>
        <div className="p-3 rounded-xl bg-black/40 border border-amber-500/40 text-[11px] text-amber-300 font-bold">
          ⚠️ {WELLNESS_DATA.safetyNotice.highRiskAlert}
        </div>
      </div>

      {/* Lifestyle Guidelines */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Scientific Evidence-Based Lifestyle Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WELLNESS_DATA.lifestyleGuidelines.map((item, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-300">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.summary}</p>
              <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                {item.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                Ref: {item.reference}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traditional & Herbal Educational Cards */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            Traditional Dietary & Botanical Education Cards
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Documented traditional use analyzed against modern scientific evidence. (Never personalized prescriptions).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WELLNESS_DATA.herbalEducationalCards.map((card) => (
            <div key={card.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {card.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{card.name}</h4>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong className="text-slate-400 text-[11px] block">Traditional Cultural Role:</strong>
                  {card.traditionalUse}
                </p>

                <p>
                  <strong className="text-emerald-400 text-[11px] block">What Scientific Evidence Says:</strong>
                  {card.scientificEvidence}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-200/90">
                  <strong className="text-amber-400 block mb-0.5">Safety & Medication Caution:</strong>
                  {card.safetyNote}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                <span>{card.reference}</span>
                <span className="text-sky-400">{card.suitableFor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}