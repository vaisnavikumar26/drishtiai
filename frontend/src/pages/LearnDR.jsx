import React from 'react';
import { BookOpen, Eye, AlertTriangle, ShieldCheck, HeartPulse, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function LearnDR() {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-8 py-8 max-w-4xl mx-auto text-slate-200">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? 'கிராமப்புற கண் நல வழிகாட்டி' : 'Community Eye Health Education'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white">
          {lang === 'ta' ? 'சர்க்கரை நோய் விழித்திரை பாதிப்பு (Diabetic Retinopathy) பற்றி முழுமையான வழிகாட்டி' : 'Comprehensive Guide to Diabetic Retinopathy'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          {lang === 'ta'
            ? 'நீரிழிவு நோயினால் கண்களில் ஏற்படும் மாற்றங்கள், அறிகுறிகள், சிகிச்சை முறைகள் மற்றும் ஆரம்பகால பரிசோதனையின் முக்கியத்துவத்தை அறிந்து கொள்ளுங்கள்.'
            : 'Learn about diabetes-related microvascular retinal damage, clinical symptoms, urgency triage levels, and why annual retinal screening protects sight.'}
        </p>
      </div>

      {/* What is Diabetic Retinopathy */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-sky-400" />
          {t('whatIsDrTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          {t('whatIsDrDesc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-amber-300 text-xs block">
              {lang === 'ta' ? 'ஆரம்ப நிலை அறிகுறிகள்' : 'Early Symptoms'}
            </strong>
            <p className="text-xs text-slate-400">
              {lang === 'ta'
                ? 'ஆரம்ப காலத்தில் எந்தவொரு வலியோ அல்லது பார்வை மங்கலோ இருக்காது. எனவேதான் வழக்கமான பரிசோதனை அவசியமாகிறது.'
                : 'Frequently asymptomatic. No pain, redness, or noticeable blurring until significant vascular leakage occurs.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-rose-400 text-xs block">
              {lang === 'ta' ? 'முற்றிய நிலை அறிகுறிகள்' : 'Advanced Warning Signs'}
            </strong>
            <p className="text-xs text-slate-400">
              {lang === 'ta'
                ? 'பார்வையில் மிதக்கும் கரும்புள்ளிகள் (Floaters), மங்கலான பார்வை, இரவில் பார்வை குறைபாடு, அல்லது திடீர் பார்வை இழப்பு.'
                : 'Floating dark spots or cobwebs, sudden vision cloudiness, fluctuating vision, or dark areas in vision field.'}
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Urgency Framework Explanation */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          {t('urgencyTitle')}
        </h2>
        <p className="text-xs text-slate-300">
          {lang === 'ta'
            ? 'DrishtiAI தளத்தில் கண் மருத்துவர்கள் வழங்கும் மூன்று சிகிச்சை அவசர நிலைகளின் விவரங்கள்:'
            : 'The 3-level clinical triage framework used by our consulting ophthalmologists:'}
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
            <strong className="text-emerald-400 text-sm block">{t('urgencyLevel1Title')}</strong>
            <p className="text-slate-300">{t('urgencyLevel1Desc')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1">
            <strong className="text-amber-400 text-sm block">{t('urgencyLevel2Title')}</strong>
            <p className="text-slate-300">{t('urgencyLevel2Desc')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-1">
            <strong className="text-rose-400 text-sm block">{t('urgencyLevel3Title')}</strong>
            <p className="text-slate-300">{t('urgencyLevel3Desc')}</p>
          </div>
        </div>
      </div>

      {/* Prevention & Rural Eye Health Tips */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-400" />
          {lang === 'ta' ? 'விழித்திரை பாதுகாப்பிற்கான 5 எளிய கட்டளைகள்' : '5 Essential Rules to Protect Your Retina'}
        </h2>

        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span><strong>HbA1c & Blood Sugar Control:</strong> {lang === 'ta' ? 'சர்க்கரை அளவை (HbA1c < 7.0%) தொடர்ந்து மருத்துவ ஆலோசனைப்படி பராமரிக்கவும்.' : 'Keep HbA1c below 7.0% through balanced meals and regular medications.'}</span>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span><strong>Blood Pressure Monitoring:</strong> {lang === 'ta' ? 'ரத்த அழுத்தத்தை 130/80 mmHg அளவுக்குள் சீராக வைத்திருக்கவும்.' : 'Control hypertension (< 130/80 mmHg) to reduce retinal capillary pressure.'}</span>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span><strong>Annual Retinal Dilated Examination:</strong> {lang === 'ta' ? 'பார்வை நன்றாக இருந்தாலும் ஆண்டுக்கு ஒருமுறை கண் விழித்திரை புகைப்படம் எடுக்கவும்.' : 'Even with 20/20 vision, attend an annual fundus screening at your PHC.'}</span>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span><strong>Healthy Lifestyle & Diet:</strong> {lang === 'ta' ? 'பச்சை காய்கறிகள், கீரைகள், முழு தானியங்கள் உண்ணவும்; புகைப்பிடிப்பதை அறவே தவிர்க்கவும்.' : 'Incorporate leafy greens, fiber, and avoid tobacco smoking completely.'}</span>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <span><strong>Immediate Action on Vision Changes:</strong> {lang === 'ta' ? 'திடீர் மங்கலான பார்வை ஏற்பட்டால் தாமதிக்காமல் மருத்துவமனை அவசர பிரிவை அணுகவும்.' : 'Never delay or self-medicate if you notice dark spots or sudden blurring.'}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
