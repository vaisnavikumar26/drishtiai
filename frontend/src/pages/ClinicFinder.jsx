import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  Clock,
  AlertTriangle,
  Building,
  CheckCircle2,
  ExternalLink,
  Calendar,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { fetchHealthCentres } from '../services/api.js';

export default function ClinicFinder({ onSelectCentreForAppointment }) {
  const { t, lang } = useLanguage();

  const [centres, setCentres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCentres = async (lat = null, lng = null, query = searchQuery, district = districtFilter) => {
    setLoading(true);
    try {
      const params = {};
      if (query && query.trim()) params.query = query.trim();
      if (district && district !== 'All') params.district = district;
      if (lat && lng) {
        params.userLat = lat;
        params.userLng = lng;
      }

      const res = await fetchHealthCentres(params);
      setCentres(res.centres || []);
    } catch (err) {
      console.error('Failed to load health centres:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCentres(userLocation?.lat, userLocation?.lng, searchQuery, districtFilter);
  }, [districtFilter]);

  // Handle Search Input
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCentres(userLocation?.lat, userLocation?.lng, searchQuery, districtFilter);
  };

  // Browser Geolocation Flow (With User Permission Only)
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        setIsLocating(false);
        loadCentres(coords.lat, coords.lng, searchQuery, districtFilter);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError(t('gpsPermissionDenied'));
        } else {
          setGpsError('Unable to retrieve location. Please use manual search below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">
              {t('finderTitle')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {lang === 'ta' ? 'அருகிலுள்ள கண் சிகிச்சை மற்றும் அரசு ஆரம்ப சுகாதார நிலையங்கள்' : 'Nearby Primary Health Centres & Eye Hospitals'}
            </h1>
            <p className="text-xs text-slate-400">
              {t('finderSubtitle')}
            </p>
          </div>

          {/* Browser Geolocation Button */}
          <button
            onClick={handleRequestLocation}
            disabled={isLocating}
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex-shrink-0"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? t('loading') : t('btnUseMyLocation')}</span>
          </button>
        </div>

        {/* GPS Permission Warning Banner if Denied */}
        {gpsError && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Search & Filter Controls */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="sm:col-span-3 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('phSearchCentres')}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-3 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="All">{t('filterAllDistricts')}</option>
              <option value="Tirunelveli">Tirunelveli (திருநெல்வேலி)</option>
              <option value="Tenkasi">Tenkasi (தென்காசி)</option>
              <option value="Madurai">Madurai (மதுரை)</option>
            </select>

            <button
              type="submit"
              className="px-4 py-3 rounded-2xl bg-slate-800 text-sky-300 hover:bg-slate-700 font-bold text-xs"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Directory Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>{lang === 'ta' ? `கண்டறியப்பட்ட மையங்கள்: ${centres.length}` : `Verified Centres Found: ${centres.length}`}</span>
          {userLocation && (
            <span className="text-teal-400 font-bold">
              ✓ {lang === 'ta' ? 'தூரம் கணக்கிடப்பட்டது' : 'Distance computed from GPS'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            {t('loading')}
          </div>
        ) : centres.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <Building className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No health centres found matching your query.</p>
            <p className="text-xs text-slate-400">Try searching for "Ambasamudram", "Tirunelveli", or "627401".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {centres.map((c) => (
              <div
                key={c.id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-5 hover:border-sky-500/40 transition-all"
              >
                <div className="space-y-3">
                  {/* Category and Distance Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/30">
                      {c.category}
                    </span>

                    {c.distanceKm !== undefined && (
                      <span className="text-xs font-bold text-sky-400 bg-sky-950 px-2.5 py-1 rounded-full border border-sky-800/40">
                        📍 {c.distanceKm} {t('distanceKmText')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white leading-tight">{c.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">{c.address}</p>

                  {/* Phone & Opening Hours */}
                  <div className="space-y-1 pt-1 text-xs">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                      <span>{t('lblContactPhone')}: <strong className="text-white font-mono">{c.phone}</strong></span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      <span>{t('lblOpeningHours')}: <strong className="text-white">{c.openingHours}</strong></span>
                    </div>
                  </div>

                  {/* Available Services Pills */}
                  {c.services && c.services.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        {t('lblServicesAvailable')}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.services.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emergency / After Hours Guidance */}
                  {c.emergencyInstructions && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <strong className="block text-white text-[10px] uppercase tracking-wide">
                          {t('lblEmergencyInstructions')}
                        </strong>
                        <p>{c.emergencyInstructions}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                  <a
                    href={c.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold transition-all border border-slate-700"
                  >
                    <span>{t('btnGetDirections')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {onSelectCentreForAppointment && (
                    <button
                      onClick={() => onSelectCentreForAppointment(c)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t('btnBookAtThisCentre')}</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
