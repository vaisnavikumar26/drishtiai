import React, { useState, useEffect } from 'react';
import { 
  Users, WifiOff, Wifi, RefreshCw, Plus, CheckCircle, AlertTriangle, 
  ArrowRight, HeartPulse, Stethoscope, Phone, MapPin, FileText, 
  Printer, Battery, CheckSquare, MessageSquare, ShieldAlert, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useOffline } from '../context/OfflineContext.jsx';

export default function HealthWorkerPortal({ setActiveTab }) {
  const { t, lang } = useLanguage();
  const { isOnline, pendingCount, isSyncing, triggerAutoSync, lastSyncMessage } = useOffline();

  const [activeTabLocal, setActiveTabLocal] = useState('register'); // 'register' | 'roster' | 'counseling' | 'checklist'
  const [selectedVillage, setSelectedVillage] = useState('All');
  const [campPatients, setCampPatients] = useState([
    {
      id: 'PAT-V101',
      name: 'Ramasamy K.',
      age: 58,
      gender: 'Male',
      mobile: '9876543210',
      village: 'Alanganallur',
      durationYears: 12,
      lastScreened: '2026-08-28',
      status: 'Moderate NPDR',
      stage: 2,
      referralUrgency: 'Referral Required (2–4 wks)',
      syncStatus: 'Synced'
    },
    {
      id: 'PAT-V102',
      name: 'Meenakshi Sundaram',
      age: 64,
      gender: 'Female',
      mobile: '9845012345',
      village: 'Melur',
      durationYears: 18,
      lastScreened: '2026-09-01',
      status: 'Severe NPDR',
      stage: 3,
      referralUrgency: 'Urgent Doctor Review',
      syncStatus: 'Synced'
    },
    {
      id: 'PAT-V103',
      name: 'Palanisamy M.',
      age: 52,
      gender: 'Male',
      mobile: '9789012345',
      village: 'Usilampatti',
      durationYears: 6,
      lastScreened: '2026-09-02',
      status: 'No DR (Normal)',
      stage: 0,
      referralUrgency: 'Annual Routine Follow-up',
      syncStatus: 'Pending Sync'
    },
    {
      id: 'PAT-V104',
      name: 'Kavitha R.',
      age: 49,
      gender: 'Female',
      mobile: '9442233445',
      village: 'Sholavandan',
      durationYears: 4,
      lastScreened: '2026-09-02',
      status: 'Mild NPDR',
      stage: 1,
      referralUrgency: '6-Month Review',
      syncStatus: 'Pending Sync'
    }
  ]);

  const [selectedPatientForSlip, setSelectedPatientForSlip] = useState(null);

  const filteredPatients = selectedVillage === 'All' 
    ? campPatients 
    : campPatients.filter(p => p.village === selectedVillage);

  const counselingScripts = [
    {
      stage: 'Level 0 – No DR (இயல்பான விழித்திரை)',
      badge: '🟢 Low Risk',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      tamilScript: 'உங்கள் விழித்திரை இரத்தக் குழாய்கள் நலமாக உள்ளன. எந்த சேதமும் இல்லை. இரத்த சர்க்கரையை எப்போதும் கட்டுப்பாட்டில் வைக்கவும். அடுத்த 1 வருடத்தில் மீண்டும் ஒருமுறை கண் பரிசோதனை செய்ய வேண்டும்.',
      englishScript: 'Your retinal blood vessels look healthy with no microvascular damage. Continue maintaining blood sugar and schedule a routine follow-up screening in 12 months.',
      actionPoint: 'Provide routine lifestyle counseling and schedule next year reminder.'
    },
    {
      stage: 'Level 1 – Mild NPDR (லேசான விழித்திரை மாற்றம்)',
      badge: '🟡 Mild Risk',
      badgeColor: 'bg-yellow-950 text-yellow-400 border-yellow-800',
      tamilScript: 'கண்ணின் விழித்திரையில் மிகச் சிறிய இரத்தக் கொப்புளங்கள் (Microaneurysms) ஆரம்பித்துள்ளன. பயப்பட வேண்டாம். இரத்த சர்க்கரை மற்றும் இரத்த அழுத்தத்தை கட்டுப்படுத்துவது மிக முக்கியம். 6 மாதங்களில் மீண்டும் பரிசோதிக்கவும்.',
      englishScript: 'Early microaneurysms detected. Reassure the patient not to panic. Emphasize strict glycemic and blood pressure control. Advise re-screening in 6 months.',
      actionPoint: 'Schedule 6-month PHC follow-up and dietary counseling.'
    },
    {
      stage: 'Level 2 – Moderate NPDR (மிதமான விழித்திரை பாதிப்பு - பரிந்துரைக்கப்படுகிறது)',
      badge: '🟠 Moderate / Referable Risk',
      badgeColor: 'bg-orange-950 text-orange-400 border-orange-800',
      tamilScript: 'விழித்திரையில் சிறிய இரத்தக் கசிவுகள் மற்றும் கொழுப்பு படிவுகள் உள்ளன. பார்வை மங்காமல் இருக்க 2-3 வாரங்களுக்குள் கண் மருத்துவரிடம் சென்று முழு கண் பரிசோதனை செய்து கொள்ள வேண்டும். அரசு கண் மருத்துவமனைக்கு செல்ல உதவி செய்கிறோம்.',
      englishScript: 'Multiple microaneurysms and hard exudates detected. Advise clinical evaluation by an ophthalmologist within 2–4 weeks to prevent vision deterioration. Arrange PHC/district hospital referral slip.',
      actionPoint: 'Hand over referral slip and book tele-consultation slot.'
    },
    {
      stage: 'Level 3 & 4 – Severe / Proliferative DR (தீவிர பாதிப்பு - உடனடி மருத்துவ உதவி)',
      badge: '🔴 High / Advanced Risk',
      badgeColor: 'bg-rose-950 text-rose-400 border-rose-800',
      tamilScript: 'விழித்திரையில் அதிக இரத்தக் கசிவு அல்லது புதிய பலவீனமான இரத்தக் குழாய்கள் உள்ளன. பார்வை இழப்பைத் தடுக்க உடனடியாக (1 வாரத்திற்குள்) சிறப்பு கண் மருத்துவரிடம் லேசர் அல்லது ஊசி சிகிச்சை பெற வேண்டும். இலவச அரசு திட்டங்கள் மூலம் சிகிச்சை பெறலாம்.',
      englishScript: 'Significant intraretinal hemorrhages or neovascularization detected. Immediate evaluation at a tertiary eye hospital is required within 7 days for laser photocoagulation or anti-VEGF therapy.',
      actionPoint: 'Priority emergency referral: notify district tele-ophthalmologist and arrange hospital transport.'
    }
  ];

  const checklistItems = [
    { item: 'Handheld Non-Mydriatic Fundus Scope (Battery > 80%)', done: true },
    { item: 'Clean Lens Wipes & Optical Microfiber Cloths', done: true },
    { item: 'Patient Consent Forms & Physical Referral Slips', done: true },
    { item: 'Tablet / Smartphone with DrishtiAI PWA Cached Offline', done: true },
    { item: 'Blood Glucose Glucometer & Sterile Lancets', done: true },
    { item: 'Emergency Contact Numbers of District Eye Hospital', done: true }
  ];

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Camp Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/30 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/30">
              ASHA Rural Health Worker Portal
            </span>
            <span className="text-xs text-slate-400">Madurai District Community Eye Outreach</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Usilampatti Block Mobile Screening Camp
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            ASHA Worker: <strong className="text-white">Selvi Priya</strong> • Centre: Usilampatti PHC • Active Camp: Alanganallur Village
          </p>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => setActiveTab('screening')}
          className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 hover:scale-105 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Patient Screening</span>
        </button>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Registered in Camp</span>
          <span className="text-2xl font-black text-white">{campPatients.length}</span>
          <span className="text-[10px] text-sky-400 block mt-0.5">Diabetic cohort</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Referrals Identified</span>
          <span className="text-2xl font-black text-orange-400">2</span>
          <span className="text-[10px] text-orange-300 block mt-0.5">Stage 2 & 3 cases</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Offline Pending Sync</span>
          <span className="text-2xl font-black text-amber-400">{pendingCount}</span>
          <span className="text-[10px] text-amber-300 block mt-0.5">Stored in IndexedDB</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Network Mode</span>
          <div className="flex items-center space-x-1.5 mt-1">
            {isOnline ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Wifi className="w-4 h-4" /> Online
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 animate-pulse">
                <WifiOff className="w-4 h-4" /> Offline Camp Mode
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Auto-sync enabled</span>
        </div>
      </div>

      {/* Offline Sync Card & Actions */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-cyan-400" />
              ASHA Edge Offline Screening & Central Sync Engine
            </h3>
            <p className="text-xs text-slate-400">
              Operate completely without internet in remote tribal and rural villages. Records persist in IndexedDB.
            </p>
          </div>

          <button
            onClick={triggerAutoSync}
            disabled={!isOnline || isSyncing || pendingCount === 0}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 disabled:opacity-40 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing to Hospital Server...' : `Sync ${pendingCount} Offline Records`}</span>
          </button>
        </div>

        {lastSyncMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{lastSyncMessage}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs for ASHA Tools */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTabLocal('register')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTabLocal === 'register' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Village Diabetic Registry ({filteredPatients.length})
        </button>
        <button
          onClick={() => setActiveTabLocal('counseling')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTabLocal === 'counseling' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          ASHA Counseling Scripts (தமிழ் / English)
        </button>
        <button
          onClick={() => setActiveTabLocal('checklist')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTabLocal === 'checklist' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Mobile Camp Checklist
        </button>
      </div>

      {/* TAB 1: Village Diabetic Registry */}
      {activeTabLocal === 'register' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Village Diabetic Cohort Registry</h3>
              <p className="text-xs text-slate-400">Track screening status, risk levels, and follow-up deadlines.</p>
            </div>

            {/* Village Filter */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Filter Village:</span>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="All">All Villages</option>
                <option value="Alanganallur">Alanganallur</option>
                <option value="Melur">Melur</option>
                <option value="Usilampatti">Usilampatti</option>
                <option value="Sholavandan">Sholavandan</option>
              </select>
            </div>
          </div>

          {/* Registry Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="py-2.5">Patient Details</th>
                  <th className="py-2.5">Village</th>
                  <th className="py-2.5">Diabetes Duration</th>
                  <th className="py-2.5">DR Screening Result</th>
                  <th className="py-2.5">Action / Urgency</th>
                  <th className="py-2.5 text-right">Physical Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="py-3">
                      <strong className="text-white block">{p.name}</strong>
                      <span className="text-[11px] text-slate-400">{p.age} Yrs • {p.gender} • {p.mobile}</span>
                    </td>
                    <td className="py-3 font-semibold text-slate-200">{p.village}</td>
                    <td className="py-3">{p.durationYears} Years</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.stage === 0 ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        p.stage === 1 ? 'bg-yellow-950 text-yellow-400 border-yellow-800' :
                        p.stage === 2 ? 'bg-orange-950 text-orange-400 border-orange-800' :
                        'bg-rose-950 text-rose-400 border-rose-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-slate-300 font-medium text-[11px]">{p.referralUrgency}</span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedPatientForSlip(p)}
                        className="px-3 py-1 rounded-lg bg-sky-950 border border-sky-500/40 text-sky-300 hover:bg-sky-900 text-[11px] font-bold"
                      >
                        Print Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Bilingual Counseling Scripts */}
      {activeTabLocal === 'counseling' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              ASHA Worker Patient Communication & Counseling Guide
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Standardized talking points to explain AI screening results clearly to rural patients without creating unnecessary panic.
            </p>
          </div>

          <div className="space-y-4">
            {counselingScripts.map((script, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-white">{script.stage}</h4>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${script.badgeColor}`}>
                    {script.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-sky-400 uppercase font-bold tracking-wider block">
                      Tamil Explanation (தமிழில் பேச வேண்டியவை):
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">{script.tamilScript}</p>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">
                      English Guidance (Talking Points):
                    </span>
                    <p className="text-slate-300 leading-relaxed">{script.englishScript}</p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Action Step: {script.actionPoint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Mobile Camp Checklist */}
      {activeTabLocal === 'checklist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              Rural Screening Camp Readiness Checklist
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify all ophthalmic equipment and safety supplies before departing for field camps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklistItems.map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
                <div className="w-5 h-5 rounded-md bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <span className="text-xs text-slate-200 font-medium">{c.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Physical Referral Slip Modal */}
      {selectedPatientForSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-sky-400" />
                ASHA Physical Camp Screening Slip
              </h3>
              <button
                onClick={() => setSelectedPatientForSlip(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Printable Slip Preview */}
            <div className="p-5 bg-white text-black rounded-2xl space-y-3 font-sans text-xs">
              <div className="border-b-2 border-black pb-2 text-center">
                <h4 className="font-black text-sm uppercase">DrishtiAI • ASHA Rural Eye Screening Slip</h4>
                <p className="text-[10px] text-gray-600">National Health Mission • Tamil Nadu Primary Health Care</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <p><strong>Patient:</strong> {selectedPatientForSlip.name}</p>
                <p><strong>Age / Gender:</strong> {selectedPatientForSlip.age} / {selectedPatientForSlip.gender}</p>
                <p><strong>Village:</strong> {selectedPatientForSlip.village}</p>
                <p><strong>Mobile:</strong> {selectedPatientForSlip.mobile}</p>
                <p><strong>Date:</strong> {selectedPatientForSlip.lastScreened}</p>
                <p><strong>Camp ASHA:</strong> Selvi Priya</p>
              </div>

              <div className="p-2.5 bg-gray-100 rounded border border-gray-300 text-center">
                <span className="text-[10px] text-gray-600 block uppercase font-bold">Screening Finding:</span>
                <strong className="text-sm font-black text-red-600">{selectedPatientForSlip.status}</strong>
                <p className="text-[10px] mt-0.5 font-semibold text-gray-800">{selectedPatientForSlip.referralUrgency}</p>
              </div>

              <div className="text-[9px] text-gray-500 border-t border-gray-300 pt-2 text-center">
                Please present this slip at your nearest Government Hospital / Eye Care Centre for direct priority consultation.
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500"
              >
                Print Slip
              </button>
              <button
                onClick={() => setSelectedPatientForSlip(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}