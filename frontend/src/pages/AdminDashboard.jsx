import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Calendar,
  FileText,
  UserCheck,
  Plus,
  RefreshCw,
  Search,
  Bell,
  Settings,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fetchAdminStats,
  fetchAllScreenings,
  fetchAllPatients,
  fetchAllDoctors,
  fetchHealthCentres,
  fetchAuditLogs,
  fetchNotificationLogs,
  retryNotification,
  assignDoctorToScreening,
  createHealthCentre,
  deleteHealthCentre,
  updateDoctor,
  registerPatient
} from '../services/api.js';

export default function AdminDashboard() {
  const { t, lang } = useLanguage();
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('cases'); // 'cases' | 'patients' | 'doctors' | 'centres' | 'audit' | 'notifications'
  const [stats, setStats] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [centres, setCentres] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);

  // New Health Centre Form State
  const [showAddCentreModal, setShowAddCentreModal] = useState(false);
  const [newCentre, setNewCentre] = useState({
    name: '',
    category: 'Primary Health Centre (PHC)',
    address: '',
    district: 'Tirunelveli',
    villageOrTown: 'Ambasamudram',
    pincode: '627401',
    phone: '+91 4634 ',
    openingHours: 'Monday to Saturday: 8:00 AM – 4:00 PM',
    emergencyInstructions: 'Casualty available 24 hours.',
    lat: 8.7062,
    lng: 77.4560
  });

  // New Patient Registration Modal State
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    patientName: '',
    mobile: '',
    password: '',
    age: 55,
    gender: 'Male',
    village: 'Ambasamudram',
    district: 'Tirunelveli',
    address: '',
    diabetesDurationYears: 5
  });

  const loadAdminData = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const [
        statsRes,
        scrRes,
        patRes,
        docRes,
        centresRes,
        auditRes,
        notifRes
      ] = await Promise.all([
        fetchAdminStats().catch(() => null),
        fetchAllScreenings().catch(() => ({ screenings: [] })),
        fetchAllPatients().catch(() => ({ patients: [] })),
        fetchAllDoctors().catch(() => ({ doctors: [] })),
        fetchHealthCentres().catch(() => ({ centres: [] })),
        fetchAuditLogs().catch(() => ({ logs: [] })),
        fetchNotificationLogs().catch(() => ({ notifications: [] }))
      ]);

      setStats(statsRes?.metrics || null);
      setScreenings(scrRes.screenings || []);
      setPatients(patRes.patients || []);
      setDoctors(docRes.doctors || []);
      setCentres(centresRes.centres || []);
      setAuditLogs(auditRes.logs || []);
      setNotifications(notifRes.notifications || []);
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [currentUser]);

  // Case Assignment Handler
  const handleAssignDoctor = async (screeningId, doctorId) => {
    try {
      const res = await assignDoctorToScreening(screeningId, doctorId);
      setStatusMsg(res.message);
      setScreenings(prev => prev.map(s => s.screeningId === screeningId ? res.screening : s));
    } catch (err) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  // Add Health Centre Handler
  const handleCreateCentre = async (e) => {
    e.preventDefault();
    try {
      const res = await createHealthCentre(newCentre);
      setCentres([...centres, res.centre]);
      setShowAddCentreModal(false);
      setStatusMsg(`Health Centre added: ${res.centre.name}`);
    } catch (err) {
      alert(`Failed to create centre: ${err.message}`);
    }
  };

  // Delete Health Centre Handler
  const handleDeleteCentre = async (id, name) => {
    if (!confirm(`Delete ${name} from verified directory?`)) return;
    try {
      await deleteHealthCentre(id);
      setCentres(centres.filter(c => c.id !== id));
      setStatusMsg(`Centre removed: ${name}`);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Add Patient Handler
  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await registerPatient(newPatient);
      setPatients([...patients, res.user]);
      setShowAddPatientModal(false);
      setStatusMsg(`Patient registered: ${res.user.name} (${res.user.patientId})`);
    } catch (err) {
      alert(`Failed to register patient: ${err.message}`);
    }
  };

  // Retry Notification Handler
  const handleRetryNotification = async (id) => {
    try {
      const res = await retryNotification(id);
      alert(res.message || 'Notification resent');
      loadAdminData();
    } catch (err) {
      alert(`Notification error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-amber-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>{t('adminPortalTitle')}</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white">
            Tamil Nadu District Eye Health Operations & Oversight
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            Supervising Tirunelveli, Ambasamudram, and Tenkasi rural screening operations • Logged in as: {currentUser?.name}
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-800 text-amber-300 hover:bg-slate-700 text-xs font-bold transition-all border border-slate-700"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Real Operational KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            {t('statTotalPatients')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {stats ? stats.totalPatients : patients.length}
          </span>
          <span className="text-[10px] text-teal-400 block font-semibold">Registered Rural Cohort</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            {t('statPendingReviews')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400">
            {stats ? stats.pendingReviewsCount : screenings.filter(s => s.reviewStatus === 'Pending Review').length}
          </span>
          <span className="text-[10px] text-amber-300/80 block font-semibold">Awaiting Clinician Sign-Off</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            {t('statReviewedCases')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
            {stats ? stats.reviewedCasesCount : screenings.filter(s => s.reviewStatus !== 'Pending Review').length}
          </span>
          <span className="text-[10px] text-emerald-400 block font-semibold">Completed Triage Reviews</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            {t('statReferrals')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-rose-400">
            {stats ? stats.referralsCount : screenings.filter(s => s.referralRecommended || s.urgencyLevel >= 2).length}
          </span>
          <span className="text-[10px] text-rose-300 block font-semibold">Level 2 & Level 3 Cases</span>
        </div>
      </div>

      {/* 3. Feedback Alert */}
      {statusMsg && (
        <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 4. Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('cases')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'cases' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Screening Cases & Routing ({screenings.length})
        </button>

        <button
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'patients' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('tabPatients')} ({patients.length})
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'doctors' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('tabDoctors')} ({doctors.length})
        </button>

        <button
          onClick={() => setActiveTab('centres')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'centres' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('tabCentres')} ({centres.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'audit' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('tabAuditLogs')} ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'notifications' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('tabNotifications')} ({notifications.length})
        </button>
      </div>

      {/* ================= TAB 1: CASES & DOCTOR ASSIGNMENT ================= */}
      {activeTab === 'cases' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              Retinal Screenings & Specialist Routing
            </h3>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-2">Case ID</th>
                  <th className="py-3 px-2">Patient</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Urgency Level</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Assigned Doctor</th>
                  <th className="py-3 px-2">Reassign Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {screenings.map((s) => (
                  <tr key={s.screeningId} className="hover:bg-slate-850">
                    <td className="py-3 px-2 font-mono font-bold text-teal-400">{s.screeningId}</td>
                    <td className="py-3 px-2">
                      <p className="font-bold text-white">{s.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{s.patientId}</p>
                    </td>
                    <td className="py-3 px-2 text-slate-300">{s.village}, {s.district}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.urgencyLevel === 3
                          ? 'bg-rose-500/20 text-rose-300'
                          : s.urgencyLevel === 2
                          ? 'bg-amber-500/20 text-amber-300'
                          : s.urgencyLevel === 1
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.urgencyLabel || 'Pending Triage'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-300">{s.reviewStatus}</td>
                    <td className="py-3 px-2 font-semibold text-sky-400">{s.assignedDoctorName}</td>
                    <td className="py-3 px-2">
                      <select
                        value={s.assignedDoctorId || ''}
                        onChange={(e) => handleAssignDoctor(s.screeningId, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[11px] text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="">-- Assign Doctor --</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PATIENTS ================= */}
      {activeTab === 'patients' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Registered Rural Patient Cohort
              </h3>
              <p className="text-[11px] text-slate-400">Notice shared family phone numbers supporting distinct patient accounts.</p>
            </div>

            <button
              onClick={() => setShowAddPatientModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-2">Patient ID</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Mobile Phone</th>
                  <th className="py-3 px-2">Age / Gender</th>
                  <th className="py-3 px-2">Village / District</th>
                  <th className="py-3 px-2">Diabetes Duration</th>
                  <th className="py-3 px-2">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {patients.map((p) => (
                  <tr key={p.id || p.patientId} className="hover:bg-slate-850">
                    <td className="py-3 px-2 font-mono font-bold text-teal-400">{p.patientId}</td>
                    <td className="py-3 px-2 font-bold text-white">{p.name}</td>
                    <td className="py-3 px-2 font-mono text-slate-300">{p.mobile}</td>
                    <td className="py-3 px-2 text-slate-300">{p.age} yrs / {p.gender}</td>
                    <td className="py-3 px-2 text-slate-300">{p.village}, {p.district}</td>
                    <td className="py-3 px-2 text-slate-300">{p.diabetesDurationYears} yrs</td>
                    <td className="py-3 px-2 text-slate-400 max-w-xs truncate">{p.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: DOCTORS ================= */}
      {activeTab === 'doctors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              Authorised Ophthalmologist & Retinal Clinician Directory
            </h3>
            <p className="text-[11px] text-slate-400">Institutional validation protects patients from unverified clinical credentials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{d.name}</h4>
                    <p className="text-xs text-teal-400 font-semibold">{d.specialization}</p>
                    <p className="text-xs text-slate-400">{d.hospital}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    TMC Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-900">
                  <div>
                    <span className="text-slate-400">Registration No:</span>
                    <p className="font-mono text-white font-bold">{d.regNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Official Email:</span>
                    <p className="text-slate-300 truncate">{d.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Contact:</span>
                    <p className="font-mono text-slate-300">{d.mobile}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Available OPD:</span>
                    <p className="text-slate-300">{d.availableHours || 'Mon-Sat: 09:00 - 16:00'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: HEALTH CENTRES ================= */}
      {activeTab === 'centres' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-400" />
                Verified Health Centre Maintenance
              </h3>
              <p className="text-[11px] text-slate-400">Maintaining real facilities across Ambasamudram, Tirunelveli, and Tenkasi.</p>
            </div>

            <button
              onClick={() => setShowAddCentreModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>{t('btnAddHealthCentre')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {centres.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-semibold">
                      {c.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{c.address}</p>
                  <p className="text-[11px] text-slate-300">
                    📞 {c.phone} • ⏰ {c.openingHours}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={c.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-sky-300 text-xs font-bold hover:bg-slate-700"
                  >
                    Maps Link
                  </a>
                  <button
                    onClick={() => handleDeleteCentre(c.id, c.name)}
                    className="px-3 py-1.5 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold hover:bg-rose-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: AUDIT TRAIL ================= */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Immutable Healthcare Audit Trail
            </h3>
            <p className="text-[11px] text-slate-400">
              Tracks all logins, fundus uploads, triage updates, and referrals without logging sensitive passwords or PHI.
            </p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-2">Timestamp</th>
                  <th className="py-3 px-2">Actor Role</th>
                  <th className="py-3 px-2">Actor Name</th>
                  <th className="py-3 px-2">Action</th>
                  <th className="py-3 px-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.logId} className="hover:bg-slate-850">
                    <td className="py-3 px-2 text-slate-400 font-sans">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 font-sans uppercase">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-white font-sans font-bold">{log.actorName}</td>
                    <td className="py-3 px-2 text-teal-400 font-bold">{log.action}</td>
                    <td className="py-3 px-2 text-slate-300 font-sans max-w-md truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: NOTIFICATIONS ================= */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                Notification Gateway & Delivery Logs
              </h3>
              <p className="text-[11px] text-slate-400">
                Truthful status reporting: Notifications require configured SMS/Email gateway credentials in environment variables.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.notificationId}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-teal-400">{n.notificationId}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {n.type} • {n.event}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      n.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {n.status}
                    </span>
                  </div>

                  <p className="text-white font-semibold">Recipient: {n.recipient}</p>
                  <p className="text-slate-400">{n.message}</p>
                  {n.failureReason && (
                    <p className="text-amber-300 text-[11px]">
                      Reason: {n.failureReason}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleRetryNotification(n.notificationId)}
                  className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  {t('btnRetryNotification')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD HEALTH CENTRE ================= */}
      {showAddCentreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <form onSubmit={handleCreateCentre} className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">{t('btnAddHealthCentre')}</h3>
              <button type="button" onClick={() => setShowAddCentreModal(false)} className="text-xs text-slate-400">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Centre Name *</label>
              <input
                type="text"
                required
                value={newCentre.name}
                onChange={(e) => setNewCentre({ ...newCentre, name: e.target.value })}
                placeholder="e.g. Kallidaikurichi Primary Health Centre"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={newCentre.category}
                  onChange={(e) => setNewCentre({ ...newCentre, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Primary Health Centre (PHC)">Primary Health Centre (PHC)</option>
                  <option value="Government Hospital">Government Hospital</option>
                  <option value="Eye Specialty Hospital">Eye Specialty Hospital</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">District</label>
                <input
                  type="text"
                  required
                  value={newCentre.district}
                  onChange={(e) => setNewCentre({ ...newCentre, district: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Address *</label>
              <input
                type="text"
                required
                value={newCentre.address}
                onChange={(e) => setNewCentre({ ...newCentre, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newCentre.phone}
                  onChange={(e) => setNewCentre({ ...newCentre, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={newCentre.openingHours}
                  onChange={(e) => setNewCentre({ ...newCentre, openingHours: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500"
              >
                Save Health Centre
              </button>
              <button
                type="button"
                onClick={() => setShowAddCentreModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: REGISTER PATIENT ================= */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <form onSubmit={handleRegisterPatient} className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Register Patient (Admin)</h3>
              <button type="button" onClick={() => setShowAddPatientModal(false)} className="text-xs text-slate-400">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={newPatient.patientName}
                  onChange={(e) => setNewPatient({ ...newPatient, patientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={newPatient.mobile}
                  onChange={(e) => setNewPatient({ ...newPatient, mobile: e.target.value })}
                  placeholder="10-digit phone"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Gender</label>
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Diabetes Yrs</label>
                <input
                  type="number"
                  value={newPatient.diabetesDurationYears}
                  onChange={(e) => setNewPatient({ ...newPatient, diabetesDurationYears: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Village *</label>
                <input
                  type="text"
                  required
                  value={newPatient.village}
                  onChange={(e) => setNewPatient({ ...newPatient, village: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">District *</label>
                <input
                  type="text"
                  required
                  value={newPatient.district}
                  onChange={(e) => setNewPatient({ ...newPatient, district: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Initial Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPatient.password}
                onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
                placeholder="Assign password (min 6 characters)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500"
              >
                Register Patient
              </button>
              <button
                type="button"
                onClick={() => setShowAddPatientModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
