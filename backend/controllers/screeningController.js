const { v4: uuidv4 } = require('uuid');
const store = require('../config/db');
const { auditLog } = require('../middleware/auth');

// 1. Get Screenings (Strict Role-Based Access Control)
exports.getAllScreenings = (req, res) => {
  const user = req.user;
  let list = [];

  if (user.role === 'patient') {
    // A patient can strictly only view their own screenings
    list = store.data.screenings.filter(s => s.patientId === user.patientId);
  } else if (user.role === 'doctor') {
    // A doctor views cases assigned to them or unassigned pending cases in queue
    list = store.data.screenings.filter(s =>
      s.assignedDoctorId === user.id ||
      !s.assignedDoctorId ||
      s.reviewStatus === 'Pending Review'
    );
  } else if (user.role === 'admin') {
    // Admin views all cases
    list = store.data.screenings;
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }

  return res.json({
    total: list.length,
    screenings: list
  });
};

// 2. Get Single Screening By ID (With RBAC check)
exports.getScreeningById = (req, res) => {
  const user = req.user;
  const item = store.data.screenings.find(s => s.screeningId === req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Screening record not found' });
  }

  // Ensure patient cannot inspect another patient's report
  if (user.role === 'patient' && item.patientId !== user.patientId) {
    return res.status(403).json({ error: 'Access denied. You can only view your own medical reports.' });
  }

  return res.json(item);
};

// 3. Create / Upload Retinal Screening
exports.createScreening = (req, res) => {
  const body = req.body;
  const user = req.user;

  // Determine patient details
  const patientId = user.role === 'patient' ? user.patientId : (body.patientId || `PID-${uuidv4().slice(0, 6)}`);
  const patientName = user.role === 'patient' ? user.name : (body.patientName || 'Rural Patient');
  const mobile = user.role === 'patient' ? user.mobile : (body.mobile || '9876543210');

  // Verify Patient Consent
  if (body.patientConsent !== true && body.patientConsent !== 'true') {
    return res.status(400).json({
      error: 'Patient consent is required before retinal image submission for screening review.',
      code: 'CONSENT_REQUIRED'
    });
  }

  // Handle uploaded image file if present from multer
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (body.imageUrl) {
    imageUrl = body.imageUrl;
  } else if (body.imageBase64) {
    imageUrl = body.imageBase64;
  }

  if (!imageUrl) {
    return res.status(400).json({ error: 'Fundus retinal image file is required.' });
  }

  // Find an available verified doctor for assignment
  const verifiedDoctors = store.data.users.filter(u => u.role === 'doctor' && u.isVerified);
  const assignedDoctor = verifiedDoctors.length > 0
    ? (body.assignedDoctorId ? verifiedDoctors.find(d => d.id === body.assignedDoctorId) || verifiedDoctors[0] : verifiedDoctors[0])
    : null;

  const screeningId = 'scr-' + Math.floor(100000 + Math.random() * 900000);

  const newScreening = {
    screeningId,
    patientId,
    patientName,
    mobile,
    age: parseInt(body.age) || 50,
    gender: body.gender || 'Unspecified',
    village: body.village || 'Ambasamudram',
    district: body.district || 'Tirunelveli',
    diabetesDurationYears: parseInt(body.diabetesDurationYears) || 0,
    screeningDate: new Date().toISOString(),
    imageUrl,
    assignedDoctorId: assignedDoctor ? assignedDoctor.id : null,
    assignedDoctorName: assignedDoctor ? assignedDoctor.name : 'Unassigned (General Queue)',
    // Medical safety: Truth in AI - never invent an AI diagnosis
    aiConfigured: false,
    aiStatus: 'AI screening is not configured; clinical review is required.',
    urgencyLevel: null,
    urgencyLabel: 'Pending Clinician Triage',
    urgencyTimeframe: 'Awaiting clinical review',
    clinicalAssessment: '',
    doctorNotes: '',
    referralRecommended: false,
    referralCenterId: null,
    referralCenterName: null,
    reviewStatus: 'Pending Review',
    reviewedAt: null,
    patientConsent: true,
    consentTimestamp: new Date().toISOString(),
    source: body.source || (user.role === 'patient' ? 'Patient Direct Portal' : 'Clinic / Camp Upload')
  };

  store.data.screenings.unshift(newScreening);

  // Record audit log
  auditLog(req, 'IMAGE_UPLOAD', `Screening submitted: ${screeningId} for patient ${patientId} (${patientName})`);

  // Record notification attempt (Notification provider status honest check)
  store.data.notifications.unshift({
    notificationId: 'notif-' + uuidv4().slice(0, 8),
    patientId,
    recipient: `${mobile} (${patientName})`,
    type: 'SMS',
    event: 'Screening Submitted',
    message: `DrishtiAI: Your retinal image (ID: ${screeningId}) has been received and routed to ${newScreening.assignedDoctorName} for clinical review.`,
    status: 'Disabled (Provider Not Configured)',
    failureReason: 'SMS Gateway credentials (TWILIO/FAST2SMS) are not configured in environment variables.',
    consentGranted: true,
    createdAt: new Date().toISOString()
  });

  store.save();

  return res.status(201).json({
    message: 'Retinal image submitted successfully and routed for clinical review.',
    screening: newScreening
  });
};

// 4. Update Doctor Clinical Assessment & 3-Level Urgency Triage
exports.updateDoctorReview = (req, res) => {
  const { id } = req.params;
  const {
    urgencyLevel,
    urgencyTimeframe,
    clinicalAssessment,
    doctorNotes,
    referralRecommended,
    referralCenterId,
    referralCenterName,
    reviewStatus
  } = req.body;

  const item = store.data.screenings.find(s => s.screeningId === id);
  if (!item) {
    return res.status(404).json({ error: 'Screening record not found' });
  }

  // Doctor or Admin authorization
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only an authorized doctor or administrator can record clinical assessments.' });
  }

  // Validate 3-level urgency
  const parsedUrgency = parseInt(urgencyLevel);
  if (![1, 2, 3].includes(parsedUrgency)) {
    return res.status(400).json({
      error: 'Valid urgency level required: Level 1 (Routine), Level 2 (Follow-up needed), or Level 3 (Urgent review).'
    });
  }

  let label = 'Level 1 – Routine';
  let defaultTimeframe = 'Annual routine check-up (12 months)';
  if (parsedUrgency === 2) {
    label = 'Level 2 – Follow-up needed';
    defaultTimeframe = 'Within 2 to 4 weeks';
  } else if (parsedUrgency === 3) {
    label = 'Level 3 – Urgent review';
    defaultTimeframe = 'Prompt clinical assessment required within 24 to 48 hours';
  }

  item.urgencyLevel = parsedUrgency;
  item.urgencyLabel = label;
  item.urgencyTimeframe = urgencyTimeframe || defaultTimeframe;
  item.clinicalAssessment = clinicalAssessment || 'Clinical evaluation performed by attending ophthalmologist.';
  item.doctorNotes = doctorNotes || '';
  item.referralRecommended = Boolean(referralRecommended || parsedUrgency >= 2);
  item.referralCenterId = referralCenterId || item.referralCenterId || null;
  item.referralCenterName = referralCenterName || item.referralCenterName || null;
  item.reviewStatus = reviewStatus || (parsedUrgency === 3 ? 'Refer Immediately' : 'Reviewed');
  item.reviewedAt = new Date().toISOString();
  item.reviewedByDoctorId = req.user.id;
  item.reviewedByDoctorName = req.user.name;

  auditLog(req, 'DOCTOR_REVIEW_SAVED', `Clinician ${req.user.name} reviewed case ${id}. Set Urgency: ${label}`);

  // Create notification record
  store.data.notifications.unshift({
    notificationId: 'notif-' + uuidv4().slice(0, 8),
    patientId: item.patientId,
    recipient: `${item.mobile} (${item.patientName})`,
    type: 'SMS',
    event: 'Clinical Assessment Complete',
    message: `DrishtiAI: Dr. ${req.user.name} reviewed your retinal screening. Urgency: ${label}. Timeframe: ${item.urgencyTimeframe}. Please check your report.`,
    status: 'Disabled (Provider Not Configured)',
    failureReason: 'SMS Gateway credentials are not configured in environment variables.',
    consentGranted: true,
    createdAt: new Date().toISOString()
  });

  store.save();

  return res.json({
    message: 'Clinical assessment and urgency triage updated successfully.',
    screening: item
  });
};

// 5. Admin: Assign Screening to Doctor
exports.assignDoctor = (req, res) => {
  const { id } = req.params;
  const { doctorId } = req.body;

  const screening = store.data.screenings.find(s => s.screeningId === id);
  if (!screening) return res.status(404).json({ error: 'Screening record not found' });

  const doctor = store.data.users.find(u => u.id === doctorId && u.role === 'doctor');
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

  screening.assignedDoctorId = doctor.id;
  screening.assignedDoctorName = doctor.name;
  store.save();

  auditLog(req, 'CASE_ASSIGNED', `Admin assigned case ${id} to ${doctor.name}`);

  return res.json({
    message: `Case successfully assigned to ${doctor.name}`,
    screening
  });
};
