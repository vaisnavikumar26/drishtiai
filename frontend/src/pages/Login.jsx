import React, { useState, useEffect } from 'react';
import {
  Users,
  Stethoscope,
  Shield,
  Eye,
  Lock,
  Phone,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  KeyRound,
  UserPlus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { lookupAccountsByPhone } from '../services/api.js';

export default function Login({ setActiveTab, authRolePrompt = 'patient' }) {
  const { t, lang } = useLanguage();
  const { loginPatientUser, registerPatientUser, loginRoleUser, isAuthenticated, role, logout } = useAuth();

  const [activeRole, setActiveRole] = useState(authRolePrompt || 'patient');
  const [isRegistering, setIsRegistering] = useState(false);

  // Patient Login Form
  const [patientIdentifier, setPatientIdentifier] = useState('Muthuvel K.');
  const [patientMobile, setPatientMobile] = useState('9876543210');
  const [patientPassword, setPatientPassword] = useState('Patient123!');

  // Patient Registration Form
  const [regData, setRegData] = useState({
    patientName: '',
    mobile: '9876543210',
    password: '',
    age: 50,
    gender: 'Male',
    village: 'Ambasamudram',
    district: 'Tirunelveli',
    address: '45 Sannathi Street, Ambasamudram',
    diabetesDurationYears: 5
  });

  // Doctor / Admin Form
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  // Status and Error states
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared Phone Discovery Modal State
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('9876543210');
  const [discoveredAccounts, setDiscoveredAccounts] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  useEffect(() => {
    if (authRolePrompt) {
      setActiveRole(authRolePrompt);
    }
  }, [authRolePrompt]);

  useEffect(() => {
    if (activeRole === 'doctor') {
      setStaffEmail('doctor@drishtiai.in');
      setStaffPassword('DoctorPass@123');
    } else if (activeRole === 'admin') {
      setStaffEmail('admin@drishtiai.in');
      setStaffPassword('AdminSecure@2026');
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [activeRole]);

  // Handle Patient Login
  const handlePatientLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await loginPatientUser(patientMobile, patientIdentifier, patientPassword);
      setSuccessMsg(`Welcome, ${res.user.name} (${res.user.patientId})!`);
      setTimeout(() => setActiveTab('patient-dashboard'), 600);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check patient name and personal password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Patient Registration
  const handlePatientRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await registerPatientUser(regData);
      setSuccessMsg(`Account created successfully! Your Patient ID is ${res.user.patientId}. Redirecting...`);
      setTimeout(() => setActiveTab('patient-dashboard'), 800);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Staff (Doctor / Admin) Login
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await loginRoleUser(staffEmail, staffPassword, activeRole);
      setSuccessMsg(`Authenticated as ${res.user.name}!`);
      setTimeout(() => {
        if (activeRole === 'doctor') setActiveTab('doctor');
        else if (activeRole === 'admin') setActiveTab('admin');
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'Staff login failed. Check email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lookup Shared Phone Accounts
  const handleLookupPhone = async () => {
    if (!lookupPhone || lookupPhone.length < 10) return;
    setIsLookingUp(true);
    try {
      const res = await lookupAccountsByPhone(lookupPhone);
      setDiscoveredAccounts(res.accounts || []);
    } catch (err) {
      setDiscoveredAccounts([]);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSelectDiscoveredAccount = (acc) => {
    setPatientIdentifier(acc.name);
    setPatientMobile(lookupPhone);
    setShowLookupModal(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      
      {/* Role Navigation Switcher: Patient | Doctor | Admin */}
      <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center justify-between shadow-xl">
        <button
          onClick={() => { setActiveRole('patient'); setIsRegistering(false); }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeRole === 'patient'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{lang === 'ta' ? 'நோயாளி' : 'Patient'}</span>
        </button>

        <button
          onClick={() => { setActiveRole('doctor'); setIsRegistering(false); }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeRole === 'doctor'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>{lang === 'ta' ? 'மருத்துவர்' : 'Doctor'}</span>
        </button>

        <button
          onClick={() => { setActiveRole('admin'); setIsRegistering(false); }}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeRole === 'admin'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>{lang === 'ta' ? 'நிர்வாகம்' : 'Admin'}</span>
        </button>
      </div>

      {/* Main Card Container */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* ===================== PATIENT SECTION ===================== */}
        {activeRole === 'patient' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  {isRegistering ? t('patientRegTitle') : t('patientLoginTitle')}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRegistering
                    ? (lang === 'ta' ? 'புதிய நோயாளி கணக்கு மற்றும் கடவுச்சொல் உருவாக்கம்' : 'Create a personal patient account on your family phone.')
                    : t('patientLoginSubtitle')}
                </p>
              </div>

              <button
                onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(null); }}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold underline"
              >
                {isRegistering ? t('alreadyHaveAccount') : t('btnRegisterNewPatient')}
              </button>
            </div>

            {/* Shared Phone Notification Callout */}
            <div className="p-3.5 rounded-2xl bg-sky-950/50 border border-sky-800/40 text-sky-200 text-xs flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-sky-300">
                  <Phone className="w-3.5 h-3.5" />
                  {t('sharedPhoneNoticeTitle')}
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                  {lang === 'ta'
                    ? 'ஒரே போனில் உங்கள் குடும்பத்தில் பல நோயாளிகள் இருக்கலாம். உங்கள் பெயரைத் தேர்ந்தெடுத்து கடவுச்சொல்லை உள்ளிடவும்.'
                    : 'Multiple patients can use one phone number. Enter your specific Name and Password.'}
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => { setShowLookupModal(true); handleLookupPhone(); }}
                className="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-sky-600/30 border border-sky-500/40 hover:bg-sky-600 text-white text-[10px] font-bold transition-all"
              >
                {lang === 'ta' ? 'குடும்ப கணக்குகள்' : 'Find Accounts'}
              </button>
            </div>

            {/* Quick Demo Pre-fill Pills for Easy Testing */}
            {!isRegistering && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  {lang === 'ta' ? 'மாதிரி நோயாளி கணக்குகள் (Demo Patients on Same Phone 9876543210):' : 'Demo Test Accounts (Shared Phone 9876543210):'}
                </span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setPatientIdentifier('Muthuvel K.');
                      setPatientMobile('9876543210');
                      setPatientPassword('Patient123!');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-sky-500 font-semibold"
                  >
                    👤 Muthuvel K. (PID-1001)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPatientIdentifier('Kuppammal M.');
                      setPatientMobile('9876543210');
                      setPatientPassword('Kuppam@2026');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-sky-500 font-semibold"
                  >
                    👤 Kuppammal M. (PID-1002 - Same Phone!)
                  </button>
                </div>
              </div>
            )}

            {/* Patient Login Form */}
            {!isRegistering ? (
              <form onSubmit={handlePatientLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('lblPatientName')} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={patientIdentifier}
                      onChange={(e) => setPatientIdentifier(e.target.value)}
                      placeholder={t('phPatientName')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('lblMobileNumber')} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={patientMobile}
                      onChange={(e) => setPatientMobile(e.target.value)}
                      placeholder={t('phMobileNumber')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('lblPersonalPassword')} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      placeholder={t('phPassword')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 text-white font-bold text-sm shadow-xl shadow-sky-600/30 hover:scale-102 transition-all flex items-center justify-center space-x-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isSubmitting ? t('loading') : t('btnSignInPatient')}</span>
                </button>
              </form>
            ) : (
              /* Patient Registration Form */
              <form onSubmit={handlePatientRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {t('lblPatientName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={regData.patientName}
                      onChange={(e) => setRegData({ ...regData, patientName: e.target.value })}
                      placeholder="e.g. S. Kannan"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {t('lblMobileNumber')} *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={regData.mobile}
                      onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblAge')} *</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={110}
                      value={regData.age}
                      onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblGender')}</label>
                    <select
                      value={regData.gender}
                      onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="Male">{t('genderMale')}</option>
                      <option value="Female">{t('genderFemale')}</option>
                      <option value="Other">{t('genderOther')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblDiabetesDuration')}</label>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={regData.diabetesDurationYears}
                      onChange={(e) => setRegData({ ...regData, diabetesDurationYears: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblVillage')} *</label>
                    <input
                      type="text"
                      required
                      value={regData.village}
                      onChange={(e) => setRegData({ ...regData, village: e.target.value })}
                      placeholder={t('phVillage')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblDistrict')} *</label>
                    <input
                      type="text"
                      required
                      value={regData.district}
                      onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                      placeholder="e.g. Tirunelveli"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblAddress')}</label>
                  <input
                    type="text"
                    value={regData.address}
                    onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                    placeholder={t('phAddress')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblPersonalPassword')} *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="Create a personal password (min 6 characters)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 text-white font-bold text-sm shadow-xl shadow-teal-600/30 hover:scale-102 transition-all flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? t('loading') : t('btnSubmitRegistration')}</span>
                </button>
              </form>
            )}

          </div>
        )}

        {/* ===================== DOCTOR SECTION ===================== */}
        {activeRole === 'doctor' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-white">{t('doctorLoginTitle')}</h2>
              <p className="text-xs text-slate-400 mt-1">{t('doctorLoginSubtitle')}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-800/40 text-teal-200 text-xs space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-teal-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Medical Credential Verification Policy
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                Only licensed ophthalmologists with verified state medical council registration numbers (TMC) can review retinal cases and assign urgency levels.
              </p>
            </div>

            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblEmail')} *</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="doctor@drishtiai.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblPersonalPassword')} *</label>
                <input
                  type="password"
                  required
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="DoctorPass@123"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 text-white font-bold text-sm shadow-xl shadow-teal-600/30 hover:scale-102 transition-all flex items-center justify-center space-x-2"
              >
                <Stethoscope className="w-4 h-4" />
                <span>{isSubmitting ? t('loading') : t('btnStaffLogin')}</span>
              </button>
            </form>
          </div>
        )}

        {/* ===================== ADMIN SECTION ===================== */}
        {activeRole === 'admin' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-black text-white">{t('adminLoginTitle')}</h2>
              <p className="text-xs text-slate-400 mt-1">{t('adminLoginSubtitle')}</p>
            </div>

            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblEmail')} *</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="admin@drishtiai.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblPersonalPassword')} *</label>
                <input
                  type="password"
                  required
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="AdminSecure@2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold text-sm shadow-xl shadow-amber-600/30 hover:scale-102 transition-all flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>{isSubmitting ? t('loading') : t('btnStaffLogin')}</span>
              </button>
            </form>
          </div>
        )}

        {/* Alerts: Error / Success */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{successMsg}</p>
          </div>
        )}

      </div>

      {/* Shared Phone Account Discovery Modal */}
      {showLookupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-sky-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                {t('sharedPhoneNoticeTitle')}
              </h3>
              <button
                onClick={() => setShowLookupModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {lang === 'ta'
                ? 'உங்கள் குடும்ப செல்போன் எண்ணை உள்ளிட்டு அதில் பதிவு செய்யப்பட்டுள்ள நோயாளி கணக்குகளைக் கண்டறியவும்.'
                : 'Enter your shared family mobile number to see all patient accounts registered under it.'}
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                maxLength={10}
                value={lookupPhone}
                onChange={(e) => setLookupPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={handleLookupPhone}
                disabled={isLookingUp}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500"
              >
                {isLookingUp ? t('loading') : (lang === 'ta' ? 'தேடு' : 'Search')}
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {discoveredAccounts && discoveredAccounts.length > 0 ? (
                discoveredAccounts.map((acc) => (
                  <div
                    key={acc.patientId}
                    onClick={() => handleSelectDiscoveredAccount(acc)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{acc.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {acc.patientId} • {acc.village}, {acc.district}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-sky-600/30 text-sky-300 font-bold">
                      {lang === 'ta' ? 'தேர்ந்தெடு' : 'Select'}
                    </span>
                  </div>
                ))
              ) : discoveredAccounts && discoveredAccounts.length === 0 ? (
                <p className="text-xs text-amber-400 text-center py-2">
                  {lang === 'ta' ? 'இந்த எண்ணில் கணக்குகள் ஏதுமில்லை.' : 'No accounts found under this phone.'}
                </p>
              ) : null}
            </div>

            <button
              onClick={() => setShowLookupModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
