import React from 'react';
import { MapPin, Phone, Clock, Stethoscope, Video, Navigation, ShieldCheck } from 'lucide-react';

export default function ClinicCard({ clinic, onBookConsult }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 shadow-xl transition-all hover:shadow-sky-500/10 flex flex-col justify-between">
      <div>
        
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
              {clinic.type}
            </span>
            <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
              {clinic.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-black text-emerald-400 flex items-center gap-1 justify-end">
              <Navigation className="w-3.5 h-3.5" />
              {clinic.distanceKm} km
            </span>
            <span className="text-[10px] text-slate-400">{clinic.district}</span>
          </div>
        </div>

        {/* Address */}
        <p className="text-xs text-slate-400 flex items-start gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <span>{clinic.address}</span>
        </p>

        {/* Specialists */}
        <div className="space-y-1.5 mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Available Retinal Specialists:
          </span>
          {clinic.specialists.map((spec, i) => (
            <div key={i} className="flex justify-between items-center text-slate-300">
              <span className="font-semibold text-white">{spec.name}</span>
              <span className="text-[10px] text-sky-400">{spec.spec}</span>
            </div>
          ))}
        </div>

        {/* Facilities Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {clinic.facilities.map((fac, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60">
              {fac}
            </span>
          ))}
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
        <a
          href={`tel:${clinic.phone}`}
          className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Call Hospital</span>
        </a>
        <button
          onClick={() => onBookConsult(clinic)}
          className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-600/20"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Book Consult</span>
        </button>
      </div>
    </div>
  );
}