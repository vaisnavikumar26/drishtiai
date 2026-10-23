const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '..', 'data_store.json');

class ResilientStore {
  constructor() {
    this.data = {
      users: [],
      screenings: [],
      healthCentres: [],
      appointments: [],
      messages: [],
      notifications: [],
      auditLogs: [],
      notificationConfig: {
        smsProvider: 'None (Unconfigured)',
        smsConfigured: false,
        emailConfigured: false,
        videoProvider: 'Native WebRTC Peer-to-Peer Signaling',
        videoConfigured: true
      }
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        // Ensure all required collections exist
        this.data = {
          users: parsed.users || [],
          screenings: parsed.screenings || [],
          healthCentres: parsed.healthCentres || [],
          appointments: parsed.appointments || [],
          messages: parsed.messages || [],
          notifications: parsed.notifications || [],
          auditLogs: parsed.auditLogs || [],
          notificationConfig: parsed.notificationConfig || {
            smsProvider: 'None (Unconfigured)',
            smsConfigured: false,
            emailConfigured: false,
            videoProvider: 'Native WebRTC Peer-to-Peer Signaling',
            videoConfigured: true
          }
        };

        // If data is from legacy seed with missing healthCentres or password hashes, re-seed safely
        if (!this.data.healthCentres || this.data.healthCentres.length === 0 || !this.data.users.some(u => u.passwordHash)) {
          console.log('[DB] Migrating to secure schema with hashed passwords and verified centres...');
          this.seed();
          this.save();
        }
      } else {
        this.seed();
        this.save();
      }
    } catch (e) {
      console.warn('[DB] Fallback to seed in-memory store:', e.message);
      this.seed();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('[DB] Save error:', e.message);
    }
  }

  logAudit(actorId, actorRole, actorName, action, details) {
    const entry = {
      logId: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      actorId: actorId || 'system',
      actorRole: actorRole || 'system',
      actorName: actorName || 'System',
      action,
      details: typeof details === 'object' ? JSON.stringify(details) : String(details)
    };
    this.data.auditLogs.unshift(entry);
    // Keep max 200 audit entries
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.save();
    return entry;
  }

  seed() {
    const salt = bcrypt.genSaltSync(8);
    const adminPass = bcrypt.hashSync('AdminSecure@2026', salt);
    const doctorPass = bcrypt.hashSync('DoctorPass@123', salt);
    const patient1Pass = bcrypt.hashSync('Patient123!', salt);
    const patient2Pass = bcrypt.hashSync('Kuppam@2026', salt);
    const patient3Pass = bcrypt.hashSync('Meenakshi@123', salt);

    this.data.users = [
      {
        id: 'usr-adm',
        role: 'admin',
        name: 'Dr. C. Soundarapandian, District Health Officer',
        email: 'admin@drishtiai.in',
        mobile: '9988776655',
        passwordHash: adminPass,
        district: 'Tirunelveli & Tenkasi District Eye Health Mission',
        isVerified: true
      },
      {
        id: 'doc-1',
        role: 'doctor',
        name: 'Dr. Aruna Natarajan, MS (Ophth)',
        email: 'doctor@drishtiai.in',
        mobile: '9840123456',
        passwordHash: doctorPass,
        specialization: 'Vitreo-Retina Specialist',
        hospital: 'Aravind Eye Hospital, Madurai',
        regNumber: 'TMC-78412',
        isVerified: true,
        availableHours: 'Mon-Sat: 09:00 - 16:00'
      },
      {
        id: 'doc-2',
        role: 'doctor',
        name: 'Dr. K. Sundaram, MD (Ophthal)',
        email: 'dr.sundar@drishtiai.in',
        mobile: '9842154321',
        passwordHash: doctorPass,
        specialization: 'Comprehensive Ophthalmology',
        hospital: 'Tirunelveli Medical College Hospital',
        regNumber: 'TMC-65239',
        isVerified: true,
        availableHours: 'Mon-Fri: 10:00 - 17:00'
      },
      // Shared Mobile Demonstrator 1: Muthuvel K. on 9876543210
      {
        id: 'usr-pat-1',
        patientId: 'PID-1001',
        role: 'patient',
        name: 'Muthuvel K.',
        mobile: '9876543210',
        passwordHash: patient1Pass,
        age: 58,
        gender: 'Male',
        village: 'Ambasamudram',
        district: 'Tirunelveli',
        address: '45 Sannathi Street, Ambasamudram, PIN: 627401',
        diabetesDurationYears: 12,
        preferredLanguage: 'ta'
      },
      // Shared Mobile Demonstrator 2: Kuppammal M. on 9876543210 (Same phone, separate password & account!)
      {
        id: 'usr-pat-2',
        patientId: 'PID-1002',
        role: 'patient',
        name: 'Kuppammal M.',
        mobile: '9876543210',
        passwordHash: patient2Pass,
        age: 54,
        gender: 'Female',
        village: 'Ambasamudram',
        district: 'Tirunelveli',
        address: '45 Sannathi Street, Ambasamudram, PIN: 627401',
        diabetesDurationYears: 6,
        preferredLanguage: 'ta'
      },
      // Patient 3: Meenakshi Sundaram
      {
        id: 'usr-pat-3',
        patientId: 'PID-1003',
        role: 'patient',
        name: 'Meenakshi Sundaram',
        mobile: '9845012345',
        passwordHash: patient3Pass,
        age: 64,
        gender: 'Female',
        village: 'Alangulam',
        district: 'Tenkasi',
        address: '12 Gandhi Road, Alangulam, PIN: 627851',
        diabetesDurationYears: 18,
        preferredLanguage: 'ta'
      }
    ];

    this.data.healthCentres = [
      {
        id: 'centre-amba-gh',
        name: 'Ambasamudram Taluk Government Hospital',
        category: 'Government Hospital',
        address: 'Hospital Road, Ambasamudram, Tirunelveli District, PIN: 627401',
        district: 'Tirunelveli',
        villageOrTown: 'Ambasamudram',
        pincode: '627401',
        phone: '+91 4634 250230',
        emergencyPhone: '+91 4634 250108 / 108',
        services: [
          '24x7 Emergency Casualty',
          'Diabetic Retinopathy Screening Camp',
          'General Ophthalmology OPD',
          'Free Generic Medicines',
          'Chief Minister Comprehensive Health Insurance (CMCHIS)'
        ],
        openingHours: 'Open 24 Hours (OPD: 8:00 AM – 1:00 PM & 3:00 PM – 5:00 PM)',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Ambasamudram+Government+Hospital',
        emergencyInstructions: 'For acute ocular trauma, sudden loss of sight or corneal injury, present immediately to Casualty Ward on the Ground Floor.',
        lat: 8.7062,
        lng: 77.4560,
        isVerified: true
      },
      {
        id: 'centre-amba-phc',
        name: 'Ambasamudram Block Primary Health Centre (Kallidaikurichi)',
        category: 'Primary Health Centre (PHC)',
        address: 'Main Road, Near Railway Crossing, Kallidaikurichi, Ambasamudram Block, PIN: 627416',
        district: 'Tirunelveli',
        villageOrTown: 'Ambasamudram',
        pincode: '627416',
        phone: '+91 4634 251120',
        emergencyPhone: '108',
        services: [
          'Primary Eye Examination & Visual Acuity Testing',
          'Non-Mydriatic Fundus Camera Screening',
          'Blood Glucose Testing (RBS/FBS)',
          'ASHA Village Health Worker Coordination'
        ],
        openingHours: 'Monday to Saturday: 8:00 AM – 4:00 PM',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Primary+Health+Centre+Kallidaikurichi+Ambasamudram',
        emergencyInstructions: 'Routine primary care only. For after-hours emergencies, proceed to Ambasamudram Taluk Hospital (4 km away).',
        lat: 8.6945,
        lng: 77.4621,
        isVerified: true
      },
      {
        id: 'centre-tvl-gmh',
        name: 'Tirunelveli Medical College Hospital (TVMCH) – Regional Eye Center',
        category: 'Government Medical College Hospital',
        address: 'High Ground Road, Palayamkottai, Tirunelveli, PIN: 627011',
        district: 'Tirunelveli',
        villageOrTown: 'Tirunelveli',
        pincode: '627011',
        phone: '+91 462 2572733',
        emergencyPhone: '+91 462 2572734 / 108',
        services: [
          '24x7 Tertiary Eye Casualty',
          'Vitreo-Retina Specialty Clinic',
          'Green Argon Retinal Laser Photocoagulation',
          'Optical Coherence Tomography (OCT)',
          'Fundus Fluorescein Angiography (FFA)',
          'Free Surgical Care under CMCHIS'
        ],
        openingHours: 'Open 24 Hours (Retina Specialty OPD: Mon–Fri 9:00 AM – 2:00 PM)',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Tirunelveli+Medical+College+Hospital+Palayamkottai',
        emergencyInstructions: 'Acute retinal detachment, vitreous hemorrhage, and ocular emergencies admitted 24/7 at Ophthalmic Casualty Wing.',
        lat: 8.7180,
        lng: 77.7470,
        isVerified: true
      },
      {
        id: 'centre-tvl-aravind',
        name: 'Aravind Eye Hospital – Tirunelveli',
        category: 'Eye Specialty Hospital',
        address: 'S.N. High Road, Tirunelveli Junction, PIN: 627001',
        district: 'Tirunelveli',
        villageOrTown: 'Tirunelveli',
        pincode: '627001',
        phone: '+91 462 4356100',
        emergencyPhone: '+91 462 4356101',
        services: [
          'Subsidized and Free Eye Care Wings',
          'Advanced Vitreo-Retinal Surgery',
          'Diabetic Macular Edema Anti-VEGF Clinic',
          'Digital Tele-Ophthalmology Network'
        ],
        openingHours: 'Monday to Saturday: 7:30 AM – 6:00 PM (Emergency 24x7)',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Aravind+Eye+Hospital+Tirunelveli',
        emergencyInstructions: 'Dedicated emergency on-call vitreoretinal fellow available after regular hours.',
        lat: 8.7302,
        lng: 77.7126,
        isVerified: true
      },
      {
        id: 'centre-tenkasi-gh',
        name: 'Government District Headquarters Hospital, Tenkasi',
        category: 'Government Hospital',
        address: 'Railway Feeder Road, Tenkasi, PIN: 627811',
        district: 'Tenkasi',
        villageOrTown: 'Tenkasi',
        pincode: '627811',
        phone: '+91 4633 222234',
        emergencyPhone: '108',
        services: [
          'Diabetic Retinopathy Assessment',
          'Ophthalmology OPD & Refraction Unit',
          '24x7 Trauma Care'
        ],
        openingHours: 'Open 24 Hours (OPD: 8:00 AM – 1:00 PM)',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Tenkasi+Government+Headquarters+Hospital',
        emergencyInstructions: 'Casualty open 24 hours. Complex vitreo-retinal surgeries stabilized and referred to TVMCH.',
        lat: 8.9602,
        lng: 77.3150,
        isVerified: true
      },
      {
        id: 'centre-mdu-aravind',
        name: 'Aravind Eye Care System – Madurai Apex Hospital',
        category: 'Apex Eye Specialty Institute',
        address: '1 Anna Nagar, Madurai, PIN: 625020',
        district: 'Madurai',
        villageOrTown: 'Madurai',
        pincode: '625020',
        phone: '+91 452 4356500',
        emergencyPhone: '+91 452 4356501',
        services: [
          'Tertiary Retinal Referral Center',
          'Micro-incision Vitrectomy Surgery (MIVS)',
          'Genetic Retinal Testing & Research',
          'Rural Tele-Screening Review Hub'
        ],
        openingHours: 'Monday to Saturday: 7:00 AM – 6:00 PM',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Aravind+Eye+Hospital+Anna+Nagar+Madurai',
        emergencyInstructions: 'Emergency retina trauma unit open 24x7 at the main campus.',
        lat: 9.9205,
        lng: 78.1480,
        isVerified: true
      }
    ];

    this.data.screenings = [
      {
        screeningId: 'scr-101',
        patientId: 'PID-1001',
        patientName: 'Muthuvel K.',
        mobile: '9876543210',
        age: 58,
        gender: 'Male',
        village: 'Ambasamudram',
        district: 'Tirunelveli',
        diabetesDurationYears: 12,
        screeningDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        assignedDoctorId: 'doc-1',
        assignedDoctorName: 'Dr. Aruna Natarajan, MS (Ophth)',
        aiConfigured: false,
        aiStatus: 'AI screening is not configured; clinical review is required.',
        urgencyLevel: 2,
        urgencyLabel: 'Level 2 – Follow-up needed',
        urgencyTimeframe: 'Within 2 to 4 weeks',
        clinicalAssessment: 'Multiple microaneurysms and hard exudates in temporal arcades. Mild macular edema suspected.',
        doctorNotes: 'Referred to Tirunelveli Medical College Hospital Eye OPD for slit lamp biomicroscopy and baseline OCT.',
        referralRecommended: true,
        referralCenterId: 'centre-tvl-gmh',
        referralCenterName: 'Tirunelveli Medical College Hospital (TVMCH)',
        reviewStatus: 'Reviewed',
        reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        patientConsent: true,
        consentTimestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        imageUrl: '/uploads/sample_fundus_101.jpg',
        source: 'Ambasamudram PHC Mobile Camp'
      },
      {
        screeningId: 'scr-102',
        patientId: 'PID-1002',
        patientName: 'Kuppammal M.',
        mobile: '9876543210',
        age: 54,
        gender: 'Female',
        village: 'Ambasamudram',
        district: 'Tirunelveli',
        diabetesDurationYears: 6,
        screeningDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        assignedDoctorId: 'doc-2',
        assignedDoctorName: 'Dr. K. Sundaram, MD (Ophthal)',
        aiConfigured: false,
        aiStatus: 'AI screening is not configured; clinical review is required.',
        urgencyLevel: 1,
        urgencyLabel: 'Level 1 – Routine',
        urgencyTimeframe: 'Annual routine eye check-up (12 months)',
        clinicalAssessment: 'Clear optic disc, normal macula, healthy retinal vasculature with no signs of microvascular retinopathy.',
        doctorNotes: 'Maintain HbA1c below 7.0%. Return for next annual retinal photograph at Ambasamudram PHC.',
        referralRecommended: false,
        referralCenterId: 'centre-amba-phc',
        referralCenterName: 'Ambasamudram Block Primary Health Centre',
        reviewStatus: 'Reviewed',
        reviewedAt: new Date(Date.now() - 86400000).toISOString(),
        patientConsent: true,
        consentTimestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        imageUrl: '/uploads/sample_fundus_102.jpg',
        source: 'Ambasamudram PHC'
      },
      {
        screeningId: 'scr-103',
        patientId: 'PID-1003',
        patientName: 'Meenakshi Sundaram',
        mobile: '9845012345',
        age: 64,
        gender: 'Female',
        village: 'Alangulam',
        district: 'Tenkasi',
        diabetesDurationYears: 18,
        screeningDate: new Date(Date.now() - 86400000).toISOString(),
        assignedDoctorId: 'doc-2',
        assignedDoctorName: 'Dr. K. Sundaram, MD (Ophthal)',
        aiConfigured: false,
        aiStatus: 'AI screening is not configured; clinical review is required.',
        urgencyLevel: 3,
        urgencyLabel: 'Level 3 – Urgent review',
        urgencyTimeframe: 'Prompt clinical assessment required within 24 to 48 hours',
        clinicalAssessment: 'Extensive intraretinal blot hemorrhages across 4 quadrants with cotton wool spots and early pre-retinal neovascularization threat.',
        doctorNotes: 'High risk of irreversible vision loss. Urgent referral to Aravind Eye Hospital Tirunelveli for emergency panretinal photocoagulation (PRP) evaluation.',
        referralRecommended: true,
        referralCenterId: 'centre-tvl-aravind',
        referralCenterName: 'Aravind Eye Hospital – Tirunelveli',
        reviewStatus: 'Refer Immediately',
        reviewedAt: new Date(Date.now() - 43200000).toISOString(),
        patientConsent: true,
        consentTimestamp: new Date(Date.now() - 86400000).toISOString(),
        imageUrl: '/uploads/sample_fundus_103.jpg',
        source: 'Tenkasi Mobile Van'
      },
      {
        screeningId: 'scr-104',
        patientId: 'PID-1001',
        patientName: 'Muthuvel K.',
        mobile: '9876543210',
        age: 58,
        gender: 'Male',
        village: 'Ambasamudram',
        district: 'Tirunelveli',
        diabetesDurationYears: 12,
        screeningDate: new Date().toISOString(),
        assignedDoctorId: 'doc-1',
        assignedDoctorName: 'Dr. Aruna Natarajan, MS (Ophth)',
        aiConfigured: false,
        aiStatus: 'AI screening is not configured; clinical review is required.',
        urgencyLevel: null,
        urgencyLabel: 'Pending Clinician Triage',
        urgencyTimeframe: 'Awaiting clinical review',
        clinicalAssessment: '',
        doctorNotes: '',
        referralRecommended: false,
        reviewStatus: 'Pending Review',
        reviewedAt: null,
        patientConsent: true,
        consentTimestamp: new Date().toISOString(),
        imageUrl: '/uploads/sample_fundus_104.jpg',
        source: 'Patient Direct Upload'
      }
    ];

    this.data.appointments = [
      {
        appointmentId: 'APT-2026-001',
        patientId: 'PID-1001',
        patientName: 'Muthuvel K.',
        mobile: '9876543210',
        doctorId: 'doc-1',
        doctorName: 'Dr. Aruna Natarajan, MS (Ophth)',
        centreId: 'centre-tvl-gmh',
        centreName: 'Tirunelveli Medical College Hospital (TVMCH)',
        preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
        preferredTime: '10:30 AM',
        reason: 'Level 2 Follow-up: Slit-lamp biomicroscopy and OCT examination',
        status: 'Confirmed',
        doctorNotes: 'Please carry blood sugar report and previous retinal report.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        appointmentId: 'APT-2026-002',
        patientId: 'PID-1003',
        patientName: 'Meenakshi Sundaram',
        mobile: '9845012345',
        doctorId: 'doc-2',
        doctorName: 'Dr. K. Sundaram, MD (Ophthal)',
        centreId: 'centre-tvl-aravind',
        centreName: 'Aravind Eye Hospital – Tirunelveli',
        preferredDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        preferredTime: '09:00 AM',
        reason: 'Level 3 Urgent Retinal Laser Photocoagulation Assessment',
        status: 'Confirmed',
        doctorNotes: 'Fast-track slot reserved with On-Duty Retina Fellow.',
        createdAt: new Date(Date.now() - 43200000).toISOString()
      }
    ];

    this.data.messages = [
      {
        messageId: 'msg-001',
        patientId: 'PID-1001',
        doctorId: 'doc-1',
        senderRole: 'doctor',
        senderName: 'Dr. Aruna Natarajan',
        text: 'Hello Muthuvel, your retinal image shows moderate non-proliferative changes. Have you noticed any blurriness or spots when reading?',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        read: true
      },
      {
        messageId: 'msg-002',
        patientId: 'PID-1001',
        doctorId: 'doc-1',
        senderRole: 'patient',
        senderName: 'Muthuvel K.',
        text: 'Vanakkam doctor, I sometimes see faint floating dots in the afternoon. My sugar level was 170 yesterday.',
        timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString(),
        read: true
      },
      {
        messageId: 'msg-003',
        patientId: 'PID-1001',
        doctorId: 'doc-1',
        senderRole: 'doctor',
        senderName: 'Dr. Aruna Natarajan',
        text: 'Please do not rub your eyes. I have scheduled a clinic appointment at Tirunelveli Medical College on October 25th for a dilated fundus exam.',
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        read: true
      }
    ];

    this.data.notifications = [
      {
        notificationId: 'notif-001',
        patientId: 'PID-1001',
        recipient: '9876543210 (Muthuvel K.)',
        type: 'SMS',
        event: 'Screening Review Completed',
        message: 'DrishtiAI: Your retinal review is complete. Urgency: Level 2 (Follow-up needed). Check your report at your health centre.',
        status: 'Disabled (Provider Not Configured)',
        failureReason: 'SMS Gateway credentials (TWILIO/FAST2SMS) are not configured in environment variables.',
        consentGranted: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        notificationId: 'notif-002',
        patientId: 'PID-1003',
        recipient: '9845012345 (Meenakshi S.)',
        type: 'SMS',
        event: 'Level 3 Urgent Alert',
        message: 'URGENT: Your eye review requires prompt clinical assessment within 24-48 hours. Please attend Tirunelveli Hospital or Aravind Eye Hospital immediately.',
        status: 'Disabled (Provider Not Configured)',
        failureReason: 'SMS Gateway credentials are not configured in environment variables.',
        consentGranted: true,
        createdAt: new Date(Date.now() - 43200000).toISOString()
      }
    ];

    this.data.auditLogs = [
      {
        logId: 'log-001',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        actorId: 'PID-1001',
        actorRole: 'patient',
        actorName: 'Muthuvel K.',
        action: 'IMAGE_UPLOAD',
        details: 'Patient submitted fundus image scr-101 with patient consent.'
      },
      {
        logId: 'log-002',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        actorId: 'doc-1',
        actorRole: 'doctor',
        actorName: 'Dr. Aruna Natarajan, MS (Ophth)',
        action: 'DOCTOR_REVIEW_SAVED',
        details: 'Clinician completed assessment for case scr-101. Set Urgency Level 2 (Follow-up needed).'
      },
      {
        logId: 'log-003',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        actorId: 'doc-2',
        actorRole: 'doctor',
        actorName: 'Dr. K. Sundaram, MD (Ophthal)',
        action: 'URGENCY_LEVEL_CHANGED',
        details: 'Clinician flagged case scr-103 as Level 3 (Urgent Review). Priority referral initiated.'
      }
    ];
  }
}

module.exports = new ResilientStore();
