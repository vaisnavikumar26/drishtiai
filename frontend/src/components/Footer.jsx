import React from 'react';
import { Eye, ShieldAlert, PhoneCall, BookOpen, MapPin, Calendar, HeartPulse } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Footer({ setActiveTab }) {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-base font-black tracking-tight">{t('brandName')}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              {t('landingHeroSubtitle')}
            </p>
            <div className="pt-1 text-[11px] text-teal-400 font-bold">
              ✓ Serving Ambasamudram, Tirunelveli, and Tenkasi rural blocks
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-400" />
              {lang === 'ta' ? 'முக்கிய பக்கங்கள்' : 'Main Modules'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-sky-300 transition-colors">
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('screening')} className="hover:text-sky-300 transition-colors">
                  {t('navScreening')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('centres')} className="hover:text-sky-300 transition-colors">
                  {t('navCentres')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('appointments')} className="hover:text-sky-300 transition-colors">
                  {t('navAppointments')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learn')} className="hover:text-sky-300 transition-colors">
                  {t('navLearn')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('login')} className="hover:text-sky-300 transition-colors">
                  {t('navLogin')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Emergency & Helplines */}
          <div>
            <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-rose-400" />
              {lang === 'ta' ? 'அவசர உதவி எண்கள்' : 'Emergency & Helplines'}
            </h4>
            <div className="space-y-2 text-slate-300">
              <p className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>{lang === 'ta' ? 'தேசிய அவசர ஊர்தி:' : 'Medical Emergency:'}</span>
                <span className="font-bold text-white font-mono">108</span>
              </p>
              <p className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>{lang === 'ta' ? 'அம்பாசமுத்திரம் GH:' : 'Ambasamudram Taluk GH:'}</span>
                <span className="font-bold text-teal-400 font-mono">+91 4634 250230</span>
              </p>
              <p className="flex justify-between border-b border-slate-800 pb-1.5">
                <span>{lang === 'ta' ? 'திருநெல்வேலி மருத்துவக் கல்லூரி:' : 'TVMCH Eye Casualty:'}</span>
                <span className="font-bold text-teal-400 font-mono">+91 462 2572733</span>
              </p>
              <p className="flex justify-between pb-1">
                <span>{lang === 'ta' ? 'அரவிந்த் கண் மருத்துவமனை:' : 'Aravind Eye Hospital:'}</span>
                <span className="font-bold text-sky-400 font-mono">+91 462 4356100</span>
              </p>
            </div>
          </div>

          {/* Col 4: Safety & Disclaimers */}
          <div>
            <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              {lang === 'ta' ? 'மருத்துவ பாதுகாப்பு அறிவிப்பு' : 'Medical Safety Policy'}
            </h4>
            <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
              {t('medicalSafetyNotice')}
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 DrishtiAI – Rural Diabetic Retinopathy Screening & Vision Protection Platform.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span className="text-teal-400">Tamil Nadu Eye Health Initiative</span>
            <span>•</span>
            <span className="text-slate-400">Primary Health Centres & Tele-Ophthalmology Link</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
