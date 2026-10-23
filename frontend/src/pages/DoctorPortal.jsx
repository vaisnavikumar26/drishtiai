import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  MessageSquare,
  Video,
  Send,
  RefreshCw,
  Building,
  User,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fetchAllScreenings,
  updateDoctorReview,
  fetchAppointments,
  updateAppointmentStatus,
  fetchMessages,
  sendMessage,
  fetchHealthCentres
} from '../services/api.js';

export default function DoctorPortal({ onOpenTelemed }) {
  const { t, lang } = useLanguage();
  const { currentUser, isDoctor, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'appointments' | 'messages'
  const [screenings, setScreenings] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'urgent'
  const [healthCentres, setHealthCentres] = useState([]);

  // Clinical Review Form State
  const [urgencyLevel, setUrgencyLevel] = useState(2);
  const [urgencyTimeframe, setUrgencyTimeframe] = useState('Within 2 to 4 weeks');
  const [clinicalAssessment, setClinicalAssessment] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [referralCenterId, setReferralCenterId] = useState('');
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Appointments State
  const [appointments, setAppointments] = useState([]);
  const [rescheduleDate, setRescheduleDate] = useState('');

  // Messages State
  const [messages, setMessages] = useState([]);
  const [selectedPatientForChat, setSelectedPatientForChat] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Load All Doctor Station Data
  const loadDoctorData = async () => {
    try {
      const [scrData, aptData, centresData] = await Promise.all([
        fetchAllScreenings().catch(() => ({ screenings: [] })),
        fetchAppointments().catch(() => ({ appointments: [] })),
        fetchHealthCentres().catch(() => ({ centres: [] }))
      ]);

      const cases = scrData.screenings || [];
      setScreenings(cases);
      if (cases.length > 0 && !selectedCase) {
        setSelectedCase(cases[0]);
        initReviewForm(cases[0]);
      }

      setAppointments(aptData.appointments || []);
      setHealthCentres(centresData.centres || []);
    } catch (err) {
      console.error('Failed to load doctor station data:', err);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [currentUser]);

  const initReviewForm = (c) => {
    if (!c) return;
    setUrgencyLevel(c.urgencyLevel || 2);
    setUrgencyTimeframe(c.urgencyTimeframe || (c.urgencyLevel === 3 ? 'Within 24 to 48 hours' : 'Within 2 to 4 weeks'));
    setClinicalAssessment(c.clinicalAssessment || '');
    setDoctorNotes(c.doctorNotes || '');
    setReferralCenterId(c.referralCenterId || '');
  };

  const handleSelectCase = (c) => {
    setSelectedCase(c);
    initReviewForm(c);
    setStatusMsg(null);
  };

  // Save Clinical Review to Backend
  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    setIsSavingReview(true);
    setStatusMsg(null);

    const chosenCentre = healthCentres.find(h => h.id === referralCenterId);

    try {
      const payload = {
        urgencyLevel,
        urgencyTimeframe,
        clinicalAssessment: clinicalAssessment.trim() || 'Clinical evaluation performed by attending ophthalmologist.',
        doctorNotes: doctorNotes.trim(),
        referralRecommended: urgencyLevel >= 2,
        referralCenterId: chosenCentre?.id || null,
        referralCenterName: chosenCentre?.name || null,
        reviewStatus: urgencyLevel === 3 ? 'Refer Immediately' : 'Reviewed'
      };

      const res = await updateDoctorReview(selectedCase.screeningId, payload);
      setStatusMsg(`Clinical assessment saved! Urgency: ${res.screening.urgencyLabel}`);
      
      // Update local state
      setScreenings(prev => prev.map(s => s.screeningId === res.screening.screeningId ? res.screening : s));
      setSelectedCase(res.screening);
    } catch (err) {
      setStatusMsg(`Save failed: ${err.message}`);
    } finally {
      setIsSavingReview(false);
    }
  };

  // Appointment Actions
  const handleUpdateAppointment = async (aptId, status, notes = '') => {
    try {
      const payload = { status, doctorNotes: notes };
      if (status === 'Rescheduled' && rescheduleDate) {
        payload.rescheduledDate = rescheduleDate;
      }
      const res = await updateAppointmentStatus(aptId, payload);
      setAppointments(prev => prev.map(a => a.appointmentId === aptId ? res.appointment : a));
    } catch (err) {
      alert(`Failed to update appointment: ${err.message}`);
    }
  };

  // Messages Actions
  const handleOpenChat = async (patientId, patientName) => {
    setSelectedPatientForChat({ patientId, patientName });
    setActiveTab('messages');
    try {
      const res = await fetchMessages(patientId);
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedPatientForChat) return;

    try {
      const res = await sendMessage({
        text: replyText.trim(),
        patientId: selectedPatientForChat.patientId
      });
      setMessages([...messages, res.data]);
      setReplyText('');
    } catch (err) {
      console.error(err);
    }
  };

  // Queue Filtering
  const filteredScreenings = screenings.filter(s => {
    if (filter === 'pending') return s.reviewStatus === 'Pending Review';
    if (filter === 'urgent') return s.urgencyLevel === 3;
    if (filter === 'level2') return s.urgencyLevel === 2;
    if (filter === 'level1') return s.urgencyLevel === 1;
    return true;
  });

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      
      {/* 1. Verified Doctor Credential Header */}
      <div className="bg-slate-900 border border-teal-500/30 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Medical Professional</span>
            <span>•</span>
            <span className="font-mono">{currentUser?.regNumber || 'TMC-78412'}</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white">
            {currentUser?.name || 'Dr. Aruna Natarajan, MS (Ophth)'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            {currentUser?.specialization || 'Vitreo-Retina Specialist'} • {currentUser?.hospital || 'Aravind Eye Hospital, Madurai'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenTelemed && onOpenTelemed()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 text-white text-xs font-bold shadow-lg shadow-teal-600/30 hover:scale-102 transition-all"
          >
            <Video className="w-4 h-4" />
            <span>{lang === 'ta' ? 'காணொளி அறை' : 'WebRTC Telemed'}</span>
          </button>

          <button
            onClick={loadDoctorData}
            className="p-2.5 rounded-2xl bg-slate-800 text-teal-300 hover:bg-slate-700 transition-all border border-slate-700"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Doctor Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'queue'
              ? 'bg-teal-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{lang === 'ta' ? 'பரிசோதனை வரிசை' : 'Assigned Case Queue'} ({screenings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'appointments'
              ? 'bg-teal-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{lang === 'ta' ? 'சந்திப்புகள்' : 'Appointments'} ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'messages'
              ? 'bg-teal-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{lang === 'ta' ? 'நோயாளி செய்திகள்' : 'Patient Messages'}</span>
        </button>
      </div>

      {/* ================= TAB 1: CLINICAL CASE QUEUE ================= */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel: Filterable Screening Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col h-[750px] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t('queueTitle')}
              </h3>
              
              <div className="flex space-x-1 text-[10px]">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 py-0.5 rounded font-bold ${filter === 'all' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-2 py-0.5 rounded font-bold ${filter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-2 py-0.5 rounded font-bold ${filter === 'urgent' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
                >
                  Urgent
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredScreenings.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No cases found in this filter.
                </div>
              ) : (
                filteredScreenings.map((c) => (
                  <div
                    key={c.screeningId}
                    onClick={() => handleSelectCase(c)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                      selectedCase?.screeningId === c.screeningId
                        ? 'bg-teal-950/60 border-teal-500 shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-teal-400">{c.screeningId}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        c.urgencyLevel === 3
                          ? 'bg-rose-500/20 text-rose-300'
                          : c.urgencyLevel === 2
                          ? 'bg-amber-500/20 text-amber-300'
                          : c.urgencyLevel === 1
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {c.urgencyLabel || c.reviewStatus}
                      </span>
                    </div>

                    <div className="mt-2 text-xs">
                      <p className="font-bold text-white">{c.patientName}</p>
                      <p className="text-[11px] text-slate-400">
                        {c.age} yrs • {c.village}, {c.district}
                      </p>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                      <span>{new Date(c.screeningDate).toLocaleDateString()}</span>
                      <span className="text-teal-400/80">{c.source}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Detailed Clinical Assessment Station */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl space-y-6">
            {selectedCase ? (
              <form onSubmit={handleSaveReview} className="space-y-6">
                
                {/* Case Header */}
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-black text-white">{selectedCase.patientName}</h2>
                      <span className="text-xs font-mono text-teal-400">({selectedCase.patientId})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedCase.age} yrs, {selectedCase.gender} • {selectedCase.village}, {selectedCase.district} • Diabetes: {selectedCase.diabetesDurationYears} yrs
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenChat(selectedCase.patientId, selectedCase.patientName)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-teal-300 hover:bg-slate-700 text-xs font-bold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Patient</span>
                  </button>
                </div>

                {/* Retinal Fundus Image Display */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Retinal Fundus Image
                  </span>
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-2 flex justify-center max-h-72 overflow-hidden">
                    {selectedCase.imageUrl ? (
                      <img
                        src={selectedCase.imageUrl}
                        alt="Retinal Fundus"
                        className="max-h-68 object-contain rounded-xl"
                      />
                    ) : (
                      <div className="py-12 text-slate-500 text-xs flex flex-col items-center">
                        <Eye className="w-8 h-8 mb-2" />
                        <span>No image file available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3-Level Urgency Triage Selection (Requirement 4) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    {t('urgencyTitle')} *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Level 1: Routine */}
                    <button
                      type="button"
                      onClick={() => {
                        setUrgencyLevel(1);
                        setUrgencyTimeframe('Annual routine check-up (12 months)');
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        urgencyLevel === 1
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block text-emerald-400">Level 1 – Routine</span>
                      <span className="text-[10px] text-slate-300">Annual 12-month routine eye screening</span>
                    </button>

                    {/* Level 2: Follow-up Needed */}
                    <button
                      type="button"
                      onClick={() => {
                        setUrgencyLevel(2);
                        setUrgencyTimeframe('Within 2 to 4 weeks');
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        urgencyLevel === 2
                          ? 'bg-amber-950/60 border-amber-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block text-amber-400">Level 2 – Follow-up</span>
                      <span className="text-[10px] text-slate-300">Examination needed within 2–4 weeks</span>
                    </button>

                    {/* Level 3: Urgent Review */}
                    <button
                      type="button"
                      onClick={() => {
                        setUrgencyLevel(3);
                        setUrgencyTimeframe('Prompt clinical assessment within 24–48 hours');
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        urgencyLevel === 3
                          ? 'bg-rose-950/60 border-rose-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block text-rose-400">Level 3 – Urgent</span>
                      <span className="text-[10px] text-slate-300">Immediate hospital care (24-48 hrs)</span>
                    </button>

                  </div>
                </div>

                {/* Clinical Assessment & Findings */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {t('clinicalAssessmentLbl')} *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={clinicalAssessment}
                      onChange={(e) => setClinicalAssessment(e.target.value)}
                      placeholder="Record clinical observations: microaneurysms, hemorrhages, hard/soft exudates, optic disc margin..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Follow-up Timeframe
                      </label>
                      <input
                        type="text"
                        value={urgencyTimeframe}
                        onChange={(e) => setUrgencyTimeframe(e.target.value)}
                        placeholder="e.g. Within 2 to 4 weeks"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {t('referralLocationLbl')}
                      </label>
                      <select
                        value={referralCenterId}
                        onChange={(e) => setReferralCenterId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                      >
                        <option value="">-- Select Referral Hospital/PHC --</option>
                        {healthCentres.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.villageOrTown || h.district})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {t('doctorNotesLbl')}
                    </label>
                    <input
                      type="text"
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Doctor instructions for the patient (e.g. maintain HbA1c < 7.0%, bring blood test report)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Status Message */}
                {statusMsg && (
                  <div className="p-3.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                {/* Save Review Button */}
                <button
                  type="submit"
                  disabled={isSavingReview}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 text-white font-bold text-sm shadow-xl shadow-teal-600/30 hover:scale-102 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSavingReview ? t('loading') : t('btnConfirmReview')}</span>
                </button>

              </form>
            ) : (
              <div className="text-center py-24 text-slate-500 text-xs">
                Select a screening case from the left queue to begin review.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= TAB 2: APPOINTMENTS ================= */}
      {activeTab === 'appointments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              Patient Appointment Requests
            </h3>
            <span className="text-xs text-slate-400">{appointments.length} Total</span>
          </div>

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No appointment requests found.</p>
            ) : (
              appointments.map((apt) => (
                <div
                  key={apt.appointmentId}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-teal-400">{apt.appointmentId}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : apt.status === 'Cancelled'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{apt.patientName} ({apt.mobile})</h4>
                    <p className="text-xs text-slate-400">
                      📅 {apt.preferredDate} at {apt.preferredTime} • 🏥 {apt.centreName}
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      <strong>Reason:</strong> {apt.reason}
                    </p>
                    {apt.doctorNotes && (
                      <p className="text-[11px] text-teal-300">
                        <strong>Doctor Notes:</strong> {apt.doctorNotes}
                      </p>
                    )}
                  </div>

                  {/* Actions: Confirm | Reschedule | Cancel */}
                  <div className="flex flex-wrap items-center gap-2">
                    {apt.status !== 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateAppointment(apt.appointmentId, 'Confirmed', 'Appointment confirmed by attending ophthalmologist.')}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm</span>
                      </button>
                    )}

                    {apt.status !== 'Cancelled' && (
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for cancellation:', 'Clinical schedule conflict');
                          if (reason !== null) handleUpdateAppointment(apt.appointmentId, 'Cancelled', reason);
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold hover:bg-rose-900 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PATIENT MESSAGING ================= */}
      {activeTab === 'messages' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              Patient Communication Console
              {selectedPatientForChat && (
                <span className="text-xs text-teal-300">
                  • Chatting with {selectedPatientForChat.patientName}
                </span>
              )}
            </h3>
          </div>

          <div className="h-96 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">
                  No messages for this patient. Select a patient or case to view conversation.
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.messageId}
                    className={`flex flex-col ${
                      m.senderRole === 'doctor' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.senderRole === 'doctor'
                          ? 'bg-teal-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      <span className="text-[10px] opacity-75 font-bold block mb-1">
                        {m.senderName} ({m.senderRole})
                      </span>
                      <p>{m.text}</p>
                      <span className="text-[9px] opacity-60 block mt-1 text-right">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type clinical guidance or instructions..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500"
              >
                Send Reply
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
