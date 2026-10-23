import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Building,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  X,
  Check,
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fetchAppointments,
  createAppointment,
  updateAppointmentStatus,
  fetchHealthCentres,
  fetchAllDoctors
} from '../services/api.js';

export default function AppointmentsPage({ defaultCentre = null }) {
  const { t, lang } = useLanguage();
  const { currentUser, isAuthenticated, isDoctor, isAdmin, isPatient } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [centres, setCentres] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(Boolean(defaultCentre));

  // Form State
  const [bookingForm, setBookingForm] = useState({
    centreId: defaultCentre?.id || '',
    doctorId: 'doc-1',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    preferredTime: '10:00 AM',
    reason: 'Diabetic Retinopathy Dilated Eye Examination & Slit Lamp Review'
  });

  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aptRes, centresRes, docRes] = await Promise.all([
        fetchAppointments().catch(() => ({ appointments: [] })),
        fetchHealthCentres().catch(() => ({ centres: [] })),
        fetchAllDoctors().catch(() => ({ doctors: [] }))
      ]);

      setAppointments(aptRes.appointments || []);
      setCentres(centresRes.centres || []);
      setDoctors(docRes.doctors || []);

      if (defaultCentre) {
        setBookingForm(prev => ({ ...prev, centreId: defaultCentre.id }));
      } else if (centresRes.centres?.length > 0 && !bookingForm.centreId) {
        setBookingForm(prev => ({ ...prev, centreId: centresRes.centres[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    setErrorMsg(null);

    try {
      const res = await createAppointment(bookingForm);
      setAppointments([res.appointment, ...appointments]);
      setStatusMsg(`Appointment request submitted! Case ID: ${res.appointment.appointmentId}`);
      setShowBookingModal(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit appointment request.');
    }
  };

  const handleUpdateStatus = async (id, status, notes = '') => {
    try {
      const res = await updateAppointmentStatus(id, { status, doctorNotes: notes });
      setAppointments(appointments.map(a => a.appointmentId === id ? res.appointment : a));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 py-8 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
            {t('appointmentsTitle')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {lang === 'ta' ? 'கண் மருத்துவ சந்திப்பு நேர மேலாண்மை' : 'Eye Care Consultations & Appointments'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ta'
              ? 'அம்பாசமுத்திரம், திருநெல்வேலி மருத்துவ மையங்களில் சந்திப்புகளை முன்பதிவு செய்யவும்.'
              : 'Book and manage specialist clinic slots with primary health centres and eye hospitals.'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btnRequestAppointment')}</span>
          </button>

          <button
            onClick={loadData}
            className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center justify-between">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-slate-400">✕</button>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>{appointments.length} Total Appointments</span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No appointments found.</p>
            <p className="text-xs text-slate-400">Click "Book New Appointment" to schedule an eye care consultation.</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.appointmentId}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-teal-400">{apt.appointmentId}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    apt.status === 'Confirmed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : apt.status === 'Cancelled'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : apt.status === 'Rescheduled'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{apt.reason}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>{apt.preferredDate} at {apt.preferredTime}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-sky-400" />
                    <span className="truncate">{apt.centreName}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                    <span>{apt.doctorName}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>Patient: {apt.patientName}</span>
                  </div>
                </div>

                {apt.doctorNotes && (
                  <p className="text-xs text-teal-300 pt-1">
                    <strong>Doctor Notes:</strong> {apt.doctorNotes}
                  </p>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center space-x-2">
                {(isDoctor || isAdmin) && apt.status !== 'Confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.appointmentId, 'Confirmed', 'Confirmed by clinic')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                  >
                    Confirm
                  </button>
                )}

                {apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      if (confirm('Cancel this appointment?')) {
                        handleUpdateStatus(apt.appointmentId, 'Cancelled', 'Cancelled by user');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-rose-300 text-xs font-bold hover:bg-rose-950 border border-rose-800/40"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <form
            onSubmit={handleCreateAppointment}
            className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">{t('btnRequestAppointment')}</h3>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblSelectCentre')} *</label>
              <select
                required
                value={bookingForm.centreId}
                onChange={(e) => setBookingForm({ ...bookingForm, centreId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.villageOrTown || c.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblSelectDoctor')}</label>
              <select
                value={bookingForm.doctorId}
                onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} – {d.specialization} ({d.availableHours})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblPreferredDate')} *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().slice(0, 10)}
                  value={bookingForm.preferredDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblPreferredTime')} *</label>
                <select
                  value={bookingForm.preferredTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblReasonForVisit')} *</label>
              <textarea
                rows={2}
                required
                value={bookingForm.reason}
                onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
              >
                Confirm Appointment Request
              </button>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
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
