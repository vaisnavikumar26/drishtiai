import React from 'react';
import {
  Eye,
  HeartPulse,
  Stethoscope,
  Shield,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Camera,
  FileText,
  PhoneCall,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home({ setActiveTab, setAuthRolePrompt }) {
  const { t, lang } = useLanguage();
  const { isAuthenticated, role } = useAuth();

  const handleAction = (tab, rolePrompt = null) => {
    if (setAuthRolePrompt && rolePrompt) {
      setAuthRolePrompt(rolePrompt);
    }
    setActiveTab(tab);
  };

  return (
    <div className="space-y-16 py-8">
      
      {/* 1. Welcoming Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 border border-sky-500/20 p-6 sm:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-bold tracking-wide">
            <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Tamil Nadu Rural Diabetic Retinopathy Prevention Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {t('landingHeroTitle')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            {t('landingHeroSubtitle')}
          </p>

          {/* 6 Mandatory Action Buttons */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
            
            {/* 1. Get Started */}
            <button
              onClick={() => handleAction(isAuthenticated ? (role === 'patient' ? 'patient-dashboard' : role) : 'login', 'patient')}
              className="flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 text-white text-base font-bold shadow-xl shadow-sky-600/30 hover:scale-102 transition-transform"
            >
              <Eye className="w-5 h-5" />
              <span>{t('btnGetStarted')}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* 2. Patient Login */}
            <button
              onClick={() => handleAction('login', 'patient')}
              className="flex items-center justify-center space-x-2 px-5 py-4 rounded-2xl bg-slate-900 text-sky-200 text-sm font-bold border border-sky-800/40 hover:bg-slate-800 hover:text-white transition-all shadow"
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>{t('btnPatientLogin')}</span>
            </button>

            {/* 3. Doctor Login */}
            <button
              onClick={() => handleAction('login', 'doctor')}
              className="flex items-center justify-center space-x-2 px-5 py-4 rounded-2xl bg-slate-900 text-teal-200 text-sm font-bold border border-teal-800/40 hover:bg-slate-800 hover:text-white transition-all shadow"
            >
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>{t('btnDoctorLogin')}</span>
            </button>

            {/* 4. Admin Login */}
            <button
              onClick={() => handleAction('login', 'admin')}
              className="flex items-center justify-center space-x-2 px-5 py-4 rounded-2xl bg-slate-900 text-amber-200 text-sm font-bold border border-amber-800/40 hover:bg-slate-800 hover:text-white transition-all shadow"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>{t('btnAdminLogin')}</span>
            </button>

            {/* 5. Find Nearby Health Centres */}
            <button
              onClick={() => handleAction('centres')}
              className="flex items-center justify-center space-x-2 px-5 py-4 rounded-2xl bg-slate-900 text-slate-200 text-sm font-bold border border-slate-700 hover:bg-slate-800 hover:text-white transition-all shadow"
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>{t('btnFindCentres')}</span>
            </button>

            {/* 6. Learn About Eye Health */}
            <button
              onClick={() => handleAction('learn')}
              className="flex items-center justify-center space-x-2 px-5 py-4 rounded-2xl bg-slate-900 text-slate-200 text-sm font-bold border border-slate-700 hover:bg-slate-800 hover:text-white transition-all shadow"
            >
              <Info className="w-4 h-4 text-teal-400" />
              <span>{t('btnLearnEyeHealth')}</span>
            </button>

          </div>

          {/* Medical Safety Disclaimer Banner */}
          <div className="mt-8 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-amber-300 text-xs leading-relaxed max-w-2xl mx-auto flex items-start space-x-3 text-left">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <p>{t('medicalSafetyNotice')}</p>
          </div>
        </div>
      </section>

      {/* 2. Simple Language Explanations: 6 Step-by-Step Educational Cards */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">
            Patient & Family Guide
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ta' ? 'கண் பாதுகாப்பு மற்றும் எளிய வழிகாட்டுதல்' : 'How the Rural Eye Care System Protects Your Vision'}
          </h2>
          <p className="text-sm text-slate-400">
            {lang === 'ta'
              ? 'கிராமப்புற முதியோரும் எளிதில் புரிந்துகொள்ளக்கூடிய எளிய மருத்துவ விளக்கங்கள்.'
              : 'Clear, reassuring explanations designed for rural patients, families, and primary health workers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: What is Diabetic Retinopathy */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('whatIsDrTitle')}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t('whatIsDrDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'ஆரம்பத்தில் வலி ஏதும் இருக்காது' : 'Silent & symptomless in early stages'}</span>
            </div>
          </div>

          {/* Card 2: Why Screening is Essential */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-teal-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('whyScreeningTitle')}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t('whyScreeningDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? '95% பார்வை இழப்பைத் தடுக்கலாம்' : '95% vision loss is preventable'}</span>
            </div>
          </div>

          {/* Card 3: How Patients Submit Images */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('howPatientSubmitsTitle')}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t('howPatientSubmitsDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-sky-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'PHC முகாம் அல்லது செல்போன் கேமரா' : 'PHC screening camp or direct portal'}</span>
            </div>
          </div>

          {/* Card 4: Remote Doctor Reviews */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-teal-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('howDoctorReviewsTitle')}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t('howDoctorReviewsDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'அங்கீகரிக்கப்பட்ட சிறப்பு மருத்துவர்கள்' : 'Reviewed by licensed ophthalmologists'}</span>
            </div>
          </div>

          {/* Card 5: Finding Nearby Centres */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('howFindPhcTitle')}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t('howFindPhcDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'அம்பாசமுத்திரம், திருநெல்வேலி மையங்கள்' : 'Ambasamudram & Tirunelveli centres'}</span>
            </div>
          </div>

          {/* Card 6: Doctor Consultation & Appointments */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('howConsultDoctorTitle')}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t('howConsultDoctorDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-sky-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? 'நேரடி செய்திகள் & சந்திப்பு நேரம்' : 'Direct messages & booked appointments'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Three Clinical Urgency Levels Section (Requirement 4) */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
            Clinical Triage Framework
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t('urgencyTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ta'
              ? 'ஒவ்வொரு பரிசோதனைக்குப் பிறகும் அங்கீகரிக்கப்பட்ட கண் மருத்துவர் நிர்ணயிக்கும் மூன்று பாதுகாப்பு நிலைகள்.'
              : 'Every screening is assigned one of three clear clinical action levels by the reviewing ophthalmologist.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Level 1: Routine */}
          <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <span>🟢</span>
                <span>{lang === 'ta' ? 'நிலை 1' : 'Level 1'}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{t('urgencyLevel1Title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('urgencyLevel1Desc')}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{lang === 'ta' ? 'அடுத்த பரிசோதனை: 12 மாதங்கள்' : 'Follow-up: Annual (12 Months)'}</span>
            </div>
          </div>

          {/* Level 2: Follow-up needed */}
          <div className="bg-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <span>🟡</span>
                <span>{lang === 'ta' ? 'நிலை 2' : 'Level 2'}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{t('urgencyLevel2Title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('urgencyLevel2Desc')}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{lang === 'ta' ? 'நேரம்: 2 முதல் 4 வாரங்கள்' : 'Timeframe: 2 to 4 Weeks'}</span>
            </div>
          </div>

          {/* Level 3: Urgent review */}
          <div className="bg-slate-950 border-2 border-rose-500/50 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                <span>🔴</span>
                <span>{lang === 'ta' ? 'நிலை 3' : 'Level 3'}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{t('urgencyLevel3Title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('urgencyLevel3Desc')}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-rose-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>{lang === 'ta' ? 'அவசரம்: 24 முதல் 48 மணி நேரத்திற்குள்' : 'Urgent: Within 24 to 48 Hours'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Shared Phone Architecture Callout for Rural Families */}
      <section className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-sky-950/60 border border-teal-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-bold">
            <Users className="w-4 h-4" />
            <span>{t('sharedPhoneNoticeTitle')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {lang === 'ta'
              ? 'ஒரு குடும்பத்தில் ஒரே போன் இருந்தாலும் தனித்தனி நோயாளி கணக்குகள்'
              : 'Support for Multiple Family Members on a Single Mobile Number'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('sharedPhoneNoticeDesc')}
          </p>
        </div>

        <button
          onClick={() => handleAction('login', 'patient')}
          className="flex-shrink-0 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-teal-600/30 transition-all"
        >
          {t('btnCheckFamilyAccounts')}
        </button>
      </section>

    </div>
  );
}
