import React, { useState, useEffect } from 'react';
import {
  Camera,
  Activity,
  FileText,
  MapPin,
  Calendar,
  Video,
  MessageSquare,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldAlert,
  Languages,
  Send,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchAllScreenings, fetchAppointments, fetchMessages, sendMessage } from '../services/api.js';

export default function PatientDashboard({
  setActiveTab,
  setScreeningResult,
  onOpenUpload,
  onOpenAppointments,
  onOpenTelemed
}) {
  const { t, lang, toggleLanguage } = useLanguage();
  const { currentUser, logout } = useAuth();

  const [screenings, setScreenings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // 'status' | 'messages' | 'profile'
  const [loading, setLoading] = useState(true);
  const [msgInput, setMsgInput] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const [scrData, aptData, msgData] = await Promise.all([
        fetchAllScreenings().catch(() => ({ screenings: [] })),
        fetchAppointments().catch(() => ({ appointments: [] })),
        fetchMessages(currentUser?.patientId).catch(() => ({ messages: [] }))
      ]);

      setScreenings(scrData.screenings || []);
      setAppointments(aptData.appointments || []);
      setMessages(msgData.messages || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    try {
      const res = await sendMessage({
        text: msgInput.trim(),
        doctorId: screenings[0]?.assignedDoctorId || 'doc-1'
      });
      setMessages([...messages, res.data]);
      setMsgInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const latestScreening = screenings[0] || null;

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto">
      
      {/* 1. Welcoming Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 border border-sky-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <span>{t('patientDashboardTitle')}</span>
            <span>•</span>
            <span className="font-mono">{currentUser?.patientId}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ta' ? `வணக்கம், ${currentUser?.name}!` : `Welcome, ${currentUser?.name}!`}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            {lang === 'ta'
              ? `${currentUser?.village}, ${currentUser?.district} • சர்க்கரை நோய்: ${currentUser?.diabetesDurationYears || 0} ஆண்டுகள்`
              : `${currentUser?.village}, ${currentUser?.district} • Diabetes duration: ${currentUser?.diabetesDurationYears || 0} years`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadPatientData}
            className="p-3 rounded-2xl bg-slate-800 text-sky-300 hover:bg-slate-700 transition-all border border-slate-700"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleLanguage}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 text-sky-300 hover:bg-slate-700 text-xs font-bold border border-slate-700 flex items-center space-x-2"
          >
            <Languages className="w-4 h-4" />
            <span>{t('langToggle')}</span>
          </button>
        </div>
      </div>

      {/* 2. Latest Triage Status Alert Banner if Screening Exists */}
      {latestScreening && (
        <div className={`p-5 rounded-3xl border shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          latestScreening.urgencyLevel === 3
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            : latestScreening.urgencyLevel === 2
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            : latestScreening.urgencyLevel === 1
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : 'bg-sky-950/40 border-sky-500/50 text-sky-200'
        }`}>
          <div className="flex items-start space-x-3">
            {latestScreening.urgencyLevel === 3 ? (
              <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            ) : latestScreening.urgencyLevel === 2 ? (
              <Clock className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            ) : latestScreening.urgencyLevel === 1 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
            )}

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t('screeningIdLbl')}: {latestScreening.screeningId}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10">
                  {latestScreening.reviewStatus}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {latestScreening.urgencyLabel || 'Pending Clinical Review'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {latestScreening.doctorNotes || latestScreening.aiStatus}
              </p>
            </div>
          </div>

          <button
            onClick={() => { setSelectedReport(latestScreening); setActiveModal('report'); }}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
          >
            {t('btnMyReport')}
          </button>
        </div>
      )}

      {/* 3. The 8 Main Functional Action Cards (Requirement 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Upload Retinal Image */}
        <div
          onClick={() => {
            if (onOpenUpload) onOpenUpload();
            else setActiveTab('screening');
          }}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-sky-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t('btnUploadRetinalImage')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {lang === 'ta'
                ? 'கேமரா மூலம் படம் எடுக்கவும் அல்லது கண் புகைப்படத்தை பதிவேற்றவும்.'
                : 'Capture via camera or upload a retinal fundus image for doctor review.'}
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
            <span>{lang === 'ta' ? 'தொடங்க' : 'Capture now'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* 2. My Screening Status */}
        <div
          onClick={() => setActiveModal('status')}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-teal-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t('btnMyScreeningStatus')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {lang === 'ta'
                ? `மொத்தம் ${screenings.length} பரிசோதனைகள் பதிவு செய்யப்பட்டுள்ளன.`
                : `Track submission history (${screenings.length} cases registered).`}
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
            <span>{lang === 'ta' ? 'நிலையைக் காண்க' : 'View status'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* 3. My Report and Doctor's Review */}
        <div
          onClick={() => {
            if (latestScreening) {
              setSelectedReport(latestScreening);
              setActiveModal('report');
            } else {
              setActiveModal('status');
            }
          }}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-sky-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t('btnMyReport')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {lang === 'ta'
                ? 'மருத்துவரின் விரிவான மதிப்பீடு மற்றும் பரிந்துரை கடிதம்.'
                : 'Clinician notes, urgency triage badge, and hospital referral slip.'}
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
            <span>{lang === 'ta' ? 'அறிக்கையைக் காண்க' : 'Read report'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* 4. Find Nearby PHC / Hospital */}
        <div
          onClick={() => setActiveTab('centres')}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-amber-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t('btnFindNearbyPhc')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {lang === 'ta'
                ? 'அம்பாசமுத்திரம், திருநெல்வேலி அரசு மற்றும் கண் மருத்துவமனைகள்.'
                : 'Locate verified PHCs and hospitals in Ambasamudram & Tirunelveli.'}
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>{lang === 'ta' ? 'மையங்களைத் தேடு' : 'Find centres'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* 5. Book an Appointment */}
        <div
          onClick={() => {
            if (onOpenAppointments) onOpenAppointments();
            else setActiveTab('appointments');
          }}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-teal-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t('btnBookAppointment')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {lang === 'ta'
                ? 'கண் மருத்துவர் சந்திப்பு நேரத்தை முன்பதிவு செய்யுங்கள்.'
                : 'Schedule a specialist consultation at a nearby hospital or clinic.'}
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
            <span>{lang === 'ta' ? 'முன்பதிவு செய்ய' : 'Book visit'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* 6. Video Consultation */}
        <div
          onClick={() => {
            if (onOpenTelemed) onOpenTelemed();
            else setActiveModal('telemed');
          }}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-sky-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t('btnVideoConsult')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {lang === 'ta'
                ? 'நேரலை காணொளி மருத்துவ ஆலோசனை அறை (WebRTC).'
                : 'Connect with your attending ophthalmologist for tele-consultation.'}
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
            <span>{lang === 'ta' ? 'ஆலோசனை அறை' : 'Enter room'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* 7. Messages and Notifications */}
        <div
          onClick={() => setActiveModal('messages')}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-teal-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t('btnMessagesNotifications')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {lang === 'ta'
                ? `மருத்துவரிடம் உரையாட (${messages.length} செய்திகள்).`
                : `Direct clinician chat & SMS dispatch logs (${messages.length} messages).`}
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">
            <span>{lang === 'ta' ? 'செய்திகள்' : 'Open chat'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* 8. My Profile and Language Settings */}
        <div
          onClick={() => setActiveModal('profile')}
          className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-amber-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t('btnMyProfile')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {lang === 'ta'
                ? 'நோயாளி கணக்கு விவரங்கள் மற்றும் மொழி அமைப்புகள்.'
                : 'Account identification, registered address, and language settings.'}
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>{lang === 'ta' ? 'விவரங்கள்' : 'Manage profile'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

      </div>

      {/* ================= MODAL 1: SCREENING STATUS & HISTORY ================= */}
      {activeModal === 'status' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-400" />
                {t('btnMyScreeningStatus')}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {screenings.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  {lang === 'ta' ? 'இதுவரை எந்த விழித்திரை படமும் சமர்ப்பிக்கப்படவில்லை.' : 'No retinal screening submissions yet.'}
                </div>
              ) : (
                screenings.map((s) => (
                  <div
                    key={s.screeningId}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-sky-500/40 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-teal-400">
                          {s.screeningId}
                        </span>
                        <p className="text-xs text-slate-400">
                          {new Date(s.screeningDate).toLocaleDateString()}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        s.urgencyLevel === 3
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : s.urgencyLevel === 2
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : s.urgencyLevel === 1
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {s.urgencyLabel || s.reviewStatus}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      <p><strong className="text-white">{t('assignedClinician')}:</strong> {s.assignedDoctorName || 'Pending Assignment'}</p>
                      {s.clinicalAssessment && (
                        <p className="mt-1"><strong className="text-white">{t('clinicalAssessmentLbl')}:</strong> {s.clinicalAssessment}</p>
                      )}
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-900">
                      <button
                        onClick={() => { setSelectedReport(s); setActiveModal('report'); }}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500"
                      >
                        {t('btnMyReport')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CLINICAL REPORT VIEWER ================= */}
      {activeModal === 'report' && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h3 className="text-base sm:text-lg font-black text-white">{t('reportTitle')}</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Patient Header Block */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">{t('lblPatientName')}:</span>
                <p className="font-bold text-white">{selectedReport.patientName}</p>
              </div>
              <div>
                <span className="text-slate-400">{t('screeningIdLbl')}:</span>
                <p className="font-bold font-mono text-teal-400">{selectedReport.screeningId}</p>
              </div>
              <div>
                <span className="text-slate-400">{t('dateOfScreening')}:</span>
                <p className="text-white">{new Date(selectedReport.screeningDate).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400">{t('assignedClinician')}:</span>
                <p className="font-bold text-sky-400">{selectedReport.assignedDoctorName}</p>
              </div>
            </div>

            {/* Urgency Level Triage Badge */}
            <div className={`p-4 rounded-2xl border ${
              selectedReport.urgencyLevel === 3
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                : selectedReport.urgencyLevel === 2
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                : selectedReport.urgencyLevel === 1
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-sky-950/40 border-sky-500/50 text-sky-200'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs uppercase font-bold tracking-wider">{t('urgencyTriageLbl')}:</span>
                <span className="text-sm font-black text-white">{selectedReport.urgencyLabel}</span>
              </div>
              <p className="text-xs">
                <strong>{t('recommendedNextStep')}:</strong> {selectedReport.urgencyTimeframe}
              </p>
            </div>

            {/* Clinical Assessment & Doctor Notes */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-sky-300 block text-xs">{t('clinicalAssessmentLbl')}</strong>
                <p className="text-slate-200 leading-relaxed font-normal">
                  {selectedReport.clinicalAssessment || 'Awaiting attending clinician evaluation.'}
                </p>
              </div>

              {selectedReport.doctorNotes && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-teal-300 block text-xs">{t('doctorNotesLbl')}</strong>
                  <p className="text-slate-200 leading-relaxed font-normal">
                    {selectedReport.doctorNotes}
                  </p>
                </div>
              )}

              {selectedReport.referralCenterName && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <strong className="text-amber-300 block text-xs">{t('referralLocationLbl')}</strong>
                  <p className="text-slate-200 font-bold">{selectedReport.referralCenterName}</p>
                </div>
              )}

              {/* Medical safety notice */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                {t('medicalSafetyNotice')}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
              >
                {lang === 'ta' ? 'அறிக்கையை அச்சிடுக' : 'Print Official Report'}
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: MESSAGES & NOTIFICATIONS ================= */}
      {activeModal === 'messages' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 max-w-xl w-full h-[600px] flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  {t('messagingTitle')}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ta' ? 'மருத்துவருடன் பாதுகாப்பான நேரடி உரையாடல்' : 'Direct clinical chat with attending specialist'}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  {lang === 'ta' ? 'செய்திகள் ஏதுமில்லை. மருத்துவரிடம் உங்கள் கேள்விகளைக் கேளுங்கள்.' : 'No messages yet. Send a medical question to your doctor.'}
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.messageId}
                    className={`flex flex-col ${
                      m.senderRole === 'patient' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.senderRole === 'patient'
                          ? 'bg-sky-600 text-white rounded-br-none'
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

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                required
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder={t('phTypeMessage')}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-teal-600 text-white hover:bg-teal-500 flex items-center justify-center transition-all shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: PATIENT PROFILE & LANGUAGE ================= */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                {t('btnMyProfile')}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">{t('lblPatientName')}:</span>
                <p className="font-bold text-white text-sm">{currentUser?.name}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Patient Identifier (PID):</span>
                <p className="font-bold text-teal-400 font-mono">{currentUser?.patientId}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">{t('lblMobileNumber')}:</span>
                <p className="font-bold text-white font-mono">{currentUser?.mobile}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">{t('lblAddress')}:</span>
                <p className="text-white">{currentUser?.address || `${currentUser?.village}, ${currentUser?.district}`}</p>
              </div>

              <div className="pt-2">
                <label className="block text-slate-400 mb-1.5 font-bold">Language Setting</label>
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="w-full py-2.5 rounded-xl bg-slate-950 border border-sky-800/40 text-sky-300 font-bold flex items-center justify-center space-x-2"
                >
                  <Languages className="w-4 h-4" />
                  <span>Switch to {t('langToggle')}</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => { logout(); setActiveModal(null); }}
                className="w-full py-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold hover:bg-rose-900"
              >
                {t('navLogout')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: VIDEO CONSULTATION DIRECT (FALLBACK) ================= */}
      {activeModal === 'telemed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mx-auto">
              <Video className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white">{t('telemedTitle')}</h3>
            
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 text-left">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {t('videoUnavailableNotice')}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                {lang === 'ta'
                  ? 'கண் மருத்துவருடன் வீடியோ ஆலோசனை தொடங்க, மருத்துவர் தனது தளத்தில் ஆன்லைனில் இருக்க வேண்டும் மற்றும் கேமரா அனுமதி வழங்கப்பட்டிருக்க வேண்டும்.'
                  : 'Real WebRTC peer connection requires active connection from the attending ophthalmologist and device camera permissions.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (onOpenTelemed) onOpenTelemed();
                  setActiveModal(null);
                }}
                className="flex-1 py-3 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500"
              >
                {lang === 'ta' ? 'கேமரா அறையை திறக்க' : 'Launch WebRTC Room'}
              </button>

              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
