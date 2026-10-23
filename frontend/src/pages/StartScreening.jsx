import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  ShieldCheck,
  ArrowRight,
  User,
  Clock,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { submitScreening } from '../services/api.js';

export default function StartScreening({ setActiveTab, setScreeningResult }) {
  const { t, lang } = useLanguage();
  const { currentUser, isAuthenticated, isPatient } = useAuth();

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [patientConsent, setPatientConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submittedCase, setSubmittedCase] = useState(null);

  // Fallback patient demographics if not logged in
  const [guestData, setGuestData] = useState({
    patientName: '',
    mobile: '',
    age: 55,
    gender: 'Male',
    village: 'Ambasamudram',
    district: 'Tirunelveli',
    diabetesDurationYears: 5
  });

  // Handle file selection (from file explorer or camera capture)
  const handleFileChange = (e) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      setErrorMsg(lang === 'ta' ? 'செல்லுபடியாகாத பட வடிவம். JPEG அல்லது PNG படம் மட்டுமே அனுமதிக்கப்படுகிறது.' : 'Invalid file format. Only JPEG, PNG, or WEBP retinal images are supported.');
      return;
    }

    // Validate size (Max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg(lang === 'ta' ? 'படத்தின் அளவு 10MB ஐ விட அதிகமாக உள்ளது. தயவுசெய்து சிறிய அளவிலான படத்தை பதிவேற்றவும்.' : 'File size exceeds 10MB limit. Please upload an optimized image.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Reset / Retake
  const handleRetake = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Submit screening to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedFile && !imagePreview) {
      setErrorMsg(lang === 'ta' ? 'தயவுசெய்து கண் விழித்திரை புகைப்படத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please capture or upload a retinal photograph.');
      return;
    }

    if (!patientConsent) {
      setErrorMsg(t('consentWarning'));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        patientConsent: true,
        source: isPatient ? 'Patient Portal' : 'Rural Camp Direct',
        imageUrl: imagePreview
      };

      if (!isPatient) {
        payload.patientName = guestData.patientName.trim() || 'Rural Patient';
        payload.mobile = guestData.mobile.trim() || '9876543210';
        payload.age = guestData.age;
        payload.gender = guestData.gender;
        payload.village = guestData.village;
        payload.district = guestData.district;
        payload.diabetesDurationYears = guestData.diabetesDurationYears;
      }

      const res = await submitScreening(payload, selectedFile);
      setSubmittedCase(res.screening);
      if (setScreeningResult) setScreeningResult(res.screening);
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">
          {t('uploadRetinalTitle')}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          {lang === 'ta' ? 'கண் விழித்திரை புகைப்படம் சமர்ப்பித்தல்' : 'Submit Fundus Retinal Photograph'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
          {t('uploadRetinalSubtitle')}
        </p>
      </div>

      {/* Success Confirmation Card */}
      {submittedCase ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t('uploadSuccessMsg')}
            </h2>
            <p className="text-xs text-slate-300">
              {lang === 'ta'
                ? 'உங்கள் விழித்திரை புகைப்படம் பாதுகாப்பாகப் பெறப்பட்டு கண் மருத்துவ பரிசீலனை வரிசையில் சேர்க்கப்பட்டது.'
                : 'Your retinal photograph has been securely stored and routed to our ophthalmologist screening queue.'}
            </p>
          </div>

          {/* Submission Metadata */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-left">
            <div>
              <span className="text-slate-400">{t('screeningIdLbl')}:</span>
              <p className="font-bold font-mono text-teal-400">{submittedCase.screeningId}</p>
            </div>
            <div>
              <span className="text-slate-400">{t('dateOfScreening')}:</span>
              <p className="text-white">{new Date(submittedCase.screeningDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-slate-400">{t('assignedClinician')}:</span>
              <p className="font-bold text-sky-400 truncate">{submittedCase.assignedDoctorName}</p>
            </div>
            <div>
              <span className="text-slate-400">Status:</span>
              <p className="font-bold text-amber-400">{submittedCase.reviewStatus}</p>
            </div>
          </div>

          {/* Honest Medical Safety Callout */}
          <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-sky-300 text-xs leading-relaxed text-left flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-sky-400 mt-0.5" />
            <div>
              <strong className="block text-white mb-0.5">{t('aiNotConfiguredNotice')}</strong>
              <p className="text-slate-300 font-normal">{t('medicalSafetyNotice')}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setActiveTab(isPatient ? 'patient-dashboard' : 'home')}
              className="flex-1 py-3.5 rounded-2xl bg-sky-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-600/30 hover:bg-sky-500 transition-all"
            >
              {lang === 'ta' ? 'எனது முகப்பிற்குச் செல்' : 'Go to Dashboard'}
            </button>
            <button
              onClick={() => { setSubmittedCase(null); handleRetake(); }}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-700 transition-all"
            >
              {lang === 'ta' ? 'மற்றொரு படம் சமர்ப்பிக்க' : 'Submit Another Case'}
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Patient Details (Auto-filled if logged in, otherwise input) */}
          {isAuthenticated ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">{t('lblPatientName')}:</span>
                <span className="font-bold text-white text-sm">{currentUser.name} ({currentUser.patientId})</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">{t('lblMobileNumber')}:</span>
                <span className="font-mono text-teal-400">{currentUser.mobile}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{lang === 'ta' ? 'நோயாளி விவரங்கள்' : 'Patient Demographics'}</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-sky-400 hover:underline font-bold"
                >
                  {t('alreadyHaveAccount')}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblPatientName')} *</label>
                  <input
                    type="text"
                    required
                    value={guestData.patientName}
                    onChange={(e) => setGuestData({ ...guestData, patientName: e.target.value })}
                    placeholder="e.g. Ramasamy K."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('lblMobileNumber')} *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={guestData.mobile}
                    onChange={(e) => setGuestData({ ...guestData, mobile: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Image Upload / Capture Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'ta' ? 'விழித்திரை படம் தேர்ந்தெடுக்கவும்' : 'Retinal Fundus Image'} *
            </label>

            {!imagePreview ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Mobile Camera Capture */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-8 rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-sky-500 hover:bg-sky-950/20 transition-all flex flex-col items-center justify-center space-y-3 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-bold text-white">{t('btnUseCamera')}</span>
                  <span className="text-[11px] text-slate-400 text-center font-normal">
                    {lang === 'ta' ? 'ஸ்மார்ட்போன் கேமரா மூலம் நேரடியாக படம் எடுக்க' : 'Direct capture with phone camera'}
                  </span>
                </button>

                {/* Option 2: File Picker */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 hover:border-teal-500 hover:bg-teal-950/20 transition-all flex flex-col items-center justify-center space-y-3 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-bold text-white">{t('btnChooseFile')}</span>
                  <span className="text-[11px] text-slate-400 text-center font-normal">
                    {lang === 'ta' ? 'சேமிக்கப்பட்ட படத்தை பதிவேற்ற (JPEG, PNG)' : 'Browse stored image file (Max 10MB)'}
                  </span>
                </button>
              </div>
            ) : (
              /* Image Preview Area */
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-sky-400" />
                    {t('imagePreviewTitle')}
                  </span>
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('btnRetake')}</span>
                  </button>
                </div>

                <div className="flex justify-center bg-black/60 rounded-2xl p-2 max-h-72 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Fundus Preview"
                    className="max-h-64 object-contain rounded-xl shadow-lg"
                  />
                </div>

                <div className="text-[11px] text-slate-400 text-center font-normal">
                  {selectedFile ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)` : 'Retinal capture ready for review'}
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              {t('uploadValidationNote')}
            </p>
          </div>

          {/* Honest Medical Safety Status Callout */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 text-sky-300 text-xs leading-relaxed space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Clinical Review Routing & AI Safety Policy
            </span>
            <p className="text-slate-300 font-normal">
              {t('aiNotConfiguredNotice')}
            </p>
          </div>

          {/* Explicit Informed Consent Checkbox */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
            <input
              type="checkbox"
              id="patientConsent"
              checked={patientConsent}
              onChange={(e) => setPatientConsent(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded text-sky-600 focus:ring-sky-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <label htmlFor="patientConsent" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
              <strong className="text-white block mb-0.5">Informed Patient Consent *</strong>
              {t('consentCheckbox')}
            </label>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (!selectedFile && !imagePreview)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-sky-600/30 hover:scale-102 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? t('loading') : t('btnSubmitForReview')}</span>
          </button>
        </form>
      )}

    </div>
  );
}
