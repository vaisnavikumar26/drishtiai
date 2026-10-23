import React, { useState } from 'react';
import { Eye, Printer, PhoneCall, Video, MapPin, Sparkles, AlertTriangle, CheckCircle, Share2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { triggerIvrNotification } from '../services/api.js';
import SeverityCard from '../components/SeverityCard.jsx';
import QualityBadge from '../components/QualityBadge.jsx';
import GradCAMViewer from '../components/GradCAMViewer.jsx';
import BeforeAfterCLAHE from '../components/BeforeAfterCLAHE.jsx';
import EvidenceCrossCheck from '../components/EvidenceCrossCheck.jsx';
import ReportViewer from '../components/ReportViewer.jsx';
import WebRTCConsultModal from '../components/WebRTCConsultModal.jsx';

export default function ResultDetail({ screening, setActiveTab }) {
  const { t, lang } = useLanguage();
  const [showReport, setShowReport] = useState(false);
  const [showTelemed, setShowTelemed] = useState(false);
  const [ivrDispatched, setIvrDispatched] = useState(false);

  if (!screening) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Active Screening Found</h3>
        <button
          onClick={() => setActiveTab('screening')}
          className="px-6 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold"
        >
          Start New Screening
        </button>
      </div>
    );
  }

  const handleTriggerIvr = async () => {
    try {
      await triggerIvrNotification({
        mobile: screening.mobile,
        patientName: screening.patientName,
        riskLevel: screening.riskLevel,
        language: lang
      });
      setIvrDispatched(true);
    } catch (err) {
      console.warn('IVR dispatch error:', err);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <button
            onClick={() => setActiveTab('screening')}
            className="flex items-center space-x-1.5 text-xs text-sky-400 font-semibold mb-2 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Screening Wizard</span>
          </button>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Screening Complete: {screening.patientName}
          </h1>
          <p className="text-xs text-slate-400">
            Case #{screening.screeningId} • Age: {screening.age} • Mobile: {screening.mobile} • Village: {screening.village}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowReport(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>View Full Clinical Report</span>
          </button>

          <button
            onClick={() => setShowTelemed(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Video className="w-4 h-4" />
            <span>Consult Doctor Online</span>
          </button>

          <button
            onClick={handleTriggerIvr}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              ivrDispatched 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
            <span>{ivrDispatched ? 'IVR Call Dispatched' : 'Send WhatsApp / IVR Reminder'}</span>
          </button>
        </div>
      </div>

      {/* DR Severity Classification Card */}
      <SeverityCard
        prediction={screening.prediction}
        predictionLevel={screening.predictionLevel}
        riskLevel={screening.riskLevel}
        confidence={screening.confidence || 0.92}
      />

      {/* 2-Column Core Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Gauge */}
        <QualityBadge qualityData={screening.quality} />

        {/* CLAHE Enhancement Slider */}
        <BeforeAfterCLAHE
          originalImage={screening.original_image_base64 || screening.imageUrl}
          enhancedImage={screening.clahe_image_base64}
        />
      </div>

      {/* Explainable AI: Grad-CAM Feature Attribution Heatmap */}
      <GradCAMViewer
        originalImage={screening.original_image_base64 || screening.imageUrl}
        heatmapImage={screening.gradcam_heatmap_base64}
        overlayImage={screening.gradcam_overlay_base64}
        predictionLevel={screening.predictionLevel}
      />

      {/* Lesion Evidence & Prediction Cross-Check Table */}
      <EvidenceCrossCheck
        findings={screening.evidence_findings || screening.evidenceFindings}
        crossCheck={screening.cross_check}
      />

      {/* Modals */}
      <ReportViewer
        screening={screening}
        isOpen={showReport}
        onClose={() => setShowReport(false)}
      />

      <WebRTCConsultModal
        isOpen={showTelemed}
        onClose={() => setShowTelemed(false)}
        patientName={screening.patientName}
        screening={screening}
      />

    </div>
  );
}