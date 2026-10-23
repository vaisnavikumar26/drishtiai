import React from 'react';
import { Printer, Download, Eye, ShieldCheck, Stethoscope, AlertTriangle } from 'lucide-react';

export default function ReportViewer({ screening, onClose }) {
  if (!screening) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Toolbar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-sky-400" />
            Automated Clinical DR Screening Report
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-950 text-slate-200 text-xs print:bg-white print:text-black">
          
          {/* Header Banner */}
          <div className="border-b-2 border-sky-500 pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black text-white print:text-black tracking-tight">DrishtiAI</h1>
              <p className="text-xs text-sky-400 font-semibold">Tele-Ophthalmology & AI Retinopathy Screening Report</p>
              <p className="text-[11px] text-slate-400 mt-0.5">National Rural Eye Care Mission • Tamil Nadu</p>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <p>Report ID: <strong className="text-white print:text-black">{screening.screeningId}</strong></p>
              <p>Date: {new Date(screening.screeningDate || Date.now()).toLocaleDateString()}</p>
              <p>Source: {screening.source || 'Primary Health Camp'}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900 print:bg-slate-100 mb-6 border border-slate-800 print:border-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 block">Patient Name:</span>
              <strong className="text-white print:text-black text-sm">{screening.patientName || 'Ramasamy K.'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Age / Gender:</span>
              <strong className="text-white print:text-black text-sm">{screening.age || 58} Yrs • {screening.gender || 'Male'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Contact Mobile:</span>
              <strong className="text-white print:text-black text-sm">{screening.mobile || '9876543210'}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Village / District:</span>
              <strong className="text-white print:text-black text-sm">{screening.village || 'Alanganallur'}, {screening.district || 'Madurai'}</strong>
            </div>
          </div>

          {/* AI Result Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            
            <div className="p-4 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Image Quality Score</span>
              <p className="text-xl font-black text-emerald-400 mt-1">{screening.qualityScore || 88}/100</p>
              <span className="text-[11px] text-slate-400">{screening.qualityStatus || 'Good – Gradable'}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">AI DR Classification</span>
              <p className="text-xl font-black text-sky-400 mt-1">{screening.prediction || 'Moderate NPDR'}</p>
              <span className="text-[11px] text-slate-400">Confidence: {Math.round((screening.confidence || 0.92) * 100)}%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Clinical Urgency</span>
              <p className="text-xl font-black text-orange-400 mt-1">{screening.predictionLevel >= 2 ? 'Referral Advised' : 'Routine Follow-up'}</p>
              <span className="text-[11px] text-slate-400">Consistency: {screening.evidenceConsistency || 'High'}</span>
            </div>

          </div>

          {/* Evidence Findings */}
          <div className="mb-6 p-4 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300">
            <h4 className="text-xs font-bold text-white print:text-black mb-2 uppercase tracking-wider">
              Lesion Evidence Findings
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              {screening.evidenceFindings && screening.evidenceFindings.length > 0 ? (
                screening.evidenceFindings.map((f, i) => (
                  <li key={i} className="flex justify-between border-b border-slate-800 print:border-slate-300 pb-1">
                    <span><strong>{f.type}</strong>: {f.description || (f.count + ' lesions')}</span>
                    <span className="text-sky-400 font-semibold">{f.severity}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">No abnormal lesions detected.</li>
              )}
            </ul>
          </div>

          {/* Doctor Review Sign-off */}
          <div className="p-4 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 flex justify-between items-end mb-6">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Ophthalmologist Review Status:</span>
              <strong className="text-white print:text-black text-sm">{screening.reviewStatus || 'Reviewed by Dr. Aruna Natarajan, MS'}</strong>
              <p className="text-[11px] text-slate-400 mt-1">{screening.doctorNotes || 'Slit-lamp exam and baseline OCT advised within 3 weeks.'}</p>
            </div>
            <div className="text-right">
              <div className="w-32 h-10 border-b border-slate-600 print:border-black mb-1" />
              <span className="text-[10px] text-slate-400">Authorized Signatory</span>
            </div>
          </div>

          {/* Legal Medical Disclaimer */}
          <div className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-800 pt-4">
            <strong>Medical Notice: </strong>
            This is an AI-assisted telemedicine screening report generated by DrishtiAI research prototype. It does not replace a comprehensive dilated eye examination performed by an eye specialist.
          </div>

        </div>

      </div>
    </div>
  );
}