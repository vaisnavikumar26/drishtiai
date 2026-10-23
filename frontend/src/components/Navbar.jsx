import React, { useState } from 'react';
import { Eye, Shield, Stethoscope, User, MapPin, Calendar, BookOpen, LogOut, LogIn, Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ activeTab, setActiveTab }) {
  const { t, lang, toggleLanguage } = useLanguage();
  const { currentUser, isAuthenticated, logout, isDoctor, isAdmin, isPatient } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-sky-900/30 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-sky-600/30 group-hover:scale-105 transition-transform">
              <Eye className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-white tracking-tight">DrishtiAI</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                  Rural Eye Care
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block max-w-xs truncate">
                {t('brandTagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {t('navHome')}
            </button>

            {/* Patient Specific Portal */}
            {isPatient && (
              <button
                onClick={() => handleNav('patient-dashboard')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'patient-dashboard' || activeTab === 'screening'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {t('patientDashboardTitle')}
              </button>
            )}

            {/* Doctor Specific Portal */}
            {isDoctor && (
              <button
                onClick={() => handleNav('doctor')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'doctor'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('navDoctor')}</span>
              </button>
            )}

            {/* Admin Specific Portal */}
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('navAdmin')}</span>
              </button>
            )}

            {/* Public / Common Links */}
            <button
              onClick={() => handleNav('centres')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'centres'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('navCentres')}</span>
            </button>

            <button
              onClick={() => handleNav('appointments')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'appointments'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('navAppointments')}</span>
            </button>

            <button
              onClick={() => handleNav('learn')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'learn'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('navLearn')}</span>
            </button>
          </nav>

          {/* Right Action Area: Language Switcher + User Status */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Bilingual Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-sky-800/40 text-sky-300 hover:bg-slate-800 text-xs font-bold transition-all shadow"
              title="Toggle Tamil / English"
            >
              <Languages className="w-4 h-4 text-sky-400" />
              <span>{t('langToggle')}</span>
            </button>

            {/* Auth Action */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-xs font-bold text-white flex items-center justify-end space-x-1">
                    <span>{currentUser.name}</span>
                    {currentUser.patientId && (
                      <span className="text-[10px] text-teal-400 font-mono">({currentUser.patientId})</span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                    {currentUser.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/40 text-rose-300 hover:bg-rose-900/50 transition-all"
                  title={t('navLogout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-sky-600/20 hover:scale-105 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('navLogin')}</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-sky-800/40 text-sky-300 text-xs font-bold"
            >
              {lang === 'en' ? 'தமிழ்' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-sky-900/40 px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t('navHome')}
          </button>

          {isPatient && (
            <button
              onClick={() => handleNav('patient-dashboard')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-sky-400 bg-sky-950/40"
            >
              {t('patientDashboardTitle')}
            </button>
          )}

          {isDoctor && (
            <button
              onClick={() => handleNav('doctor')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-teal-400 bg-teal-950/40"
            >
              {t('navDoctor')}
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-400 bg-amber-950/40"
            >
              {t('navAdmin')}
            </button>
          )}

          <button
            onClick={() => handleNav('centres')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t('navCentres')}
          </button>

          <button
            onClick={() => handleNav('appointments')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t('navAppointments')}
          </button>

          <button
            onClick={() => handleNav('learn')}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t('navLearn')}
          </button>

          <div className="pt-4 border-t border-slate-900">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[10px] text-sky-400 uppercase">{currentUser.role}</p>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 text-xs font-bold"
                >
                  {t('navLogout')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="w-full py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold text-center"
              >
                {t('navLogin')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
