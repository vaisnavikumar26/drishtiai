export const CLINICS_DATA = [
  {
    id: 'cl-1',
    name: 'Aravind Eye Hospital & Postgraduate Institute',
    district: 'Madurai',
    address: '1, Anna Nagar, Madurai, Tamil Nadu 625020',
    lat: 9.9252,
    lng: 78.1402,
    phone: '+91 452 435 6100',
    emergencyNumber: '108 / +91 452 435 6111',
    specialists: [
      { name: 'Dr. Aruna Natarajan, MS (Ophth)', spec: 'Vitreo-Retina Specialist', exp: '16 yrs', availableToday: true },
      { name: 'Dr. R. Vignesh, DNB', spec: 'Diabetic Eye Care Fellow', exp: '9 yrs', availableToday: true }
    ],
    facilities: ['Laser Photocoagulation', 'Anti-VEGF Injection', 'Vitrectomy Unit', 'Free Camp Referral Beds'],
    type: 'Tertiary Eye Hospital',
    isGovtSponsored: true,
    rating: 4.9,
    distanceKm: 4.2
  },
  {
    id: 'cl-2',
    name: 'Sankara Nethralaya Eye Hospital',
    district: 'Chennai',
    address: 'No. 41/18 College Road, Nungambakkam, Chennai 600006',
    lat: 13.0604,
    lng: 80.2496,
    phone: '+91 44 4227 1500',
    emergencyNumber: '+91 44 4227 1900',
    specialists: [
      { name: 'Dr. M. Senthil Kumar, FRCS', spec: 'Senior Retina Consultant', exp: '22 yrs', availableToday: true },
      { name: 'Dr. Priya Sundaram, MS', spec: 'Ophthalmic Surgeon', exp: '12 yrs', availableToday: false }
    ],
    facilities: ['Advanced OCT Angiography', 'Fluorescein Angiography', 'Laser Suite'],
    type: 'Apex Eye Institute',
    isGovtSponsored: false,
    rating: 4.8,
    distanceKm: 12.5
  },
  {
    id: 'cl-3',
    name: 'District Government Headquarters Hospital – Eye Unit',
    district: 'Madurai',
    address: 'Panagal Road, Shenoy Nagar, Madurai 625020',
    lat: 9.9320,
    lng: 78.1340,
    phone: '+91 452 253 2535',
    emergencyNumber: '108',
    specialists: [
      { name: 'Dr. K. Ganesan, MS (Govt Civil Surgeon)', spec: 'District Eye Surgeon', exp: '18 yrs', availableToday: true }
    ],
    facilities: ['Free Diabetic Screening', 'Ayushman Bharat / CMCHIS Accepted', 'Medicines Dispensed Free'],
    type: 'Government District Hospital',
    isGovtSponsored: true,
    rating: 4.6,
    distanceKm: 2.8
  },
  {
    id: 'cl-4',
    name: 'Aravind Eye Hospital – Coimbatore',
    district: 'Coimbatore',
    address: 'Avinashi Road, Civil Aerodrome Post, Coimbatore 641014',
    lat: 11.0280,
    lng: 77.0320,
    phone: '+91 422 436 0400',
    emergencyNumber: '+91 422 436 0411',
    specialists: [
      { name: 'Dr. S. Karthikeyan, MS', spec: 'Retina & Uvea Specialist', exp: '14 yrs', availableToday: true }
    ],
    facilities: ['Fundus Camera Screening', 'Diabetic Retinopathy Clinic', 'Subsidized Rural Transport'],
    type: 'Super Specialty Eye Hospital',
    isGovtSponsored: true,
    rating: 4.9,
    distanceKm: 18.2
  },
  {
    id: 'cl-5',
    name: 'Joseph Eye Hospital',
    district: 'Tiruchirappalli (Trichy)',
    address: 'Melapudur, Tiruchirappalli, Tamil Nadu 620001',
    lat: 10.8050,
    lng: 78.6920,
    phone: '+91 431 246 0524',
    emergencyNumber: '+91 431 246 0500',
    specialists: [
      { name: 'Dr. Benjamin Paul, DNB', spec: 'Retinal Disease Specialist', exp: '11 yrs', availableToday: true }
    ],
    facilities: ['Mobile Van Telemedicine Link', 'Laser Therapy', 'Community Eye Outreach'],
    type: 'Charitable Eye Hospital',
    isGovtSponsored: true,
    rating: 4.7,
    distanceKm: 8.5
  }
];