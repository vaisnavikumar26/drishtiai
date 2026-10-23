const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const store = require('../config/db');
const { JWT_SECRET, auditLog } = require('../middleware/auth');

// Helper to sanitize user object for response
function sanitizeUser(u) {
  const { passwordHash, ...safe } = u;
  return safe;
}

// 1. Patient Registration (Supports Shared Family Phones)
exports.registerPatient = (req, res) => {
  const {
    patientName,
    mobile,
    password,
    age,
    gender,
    village,
    district,
    address,
    diabetesDurationYears,
    preferredLanguage = 'ta'
  } = req.body;

  if (!patientName || !patientName.trim()) {
    return res.status(400).json({ error: 'Patient full name is required' });
  }
  if (!mobile || !/^\d{10}$/.test(mobile.trim())) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Personal password must be at least 6 characters' });
  }

  const cleanMobile = mobile.trim();
  const cleanName = patientName.trim();

  // Check if an account with this exact name already exists on this same mobile
  const duplicate = store.data.users.find(
    u => u.role === 'patient' &&
         u.mobile === cleanMobile &&
         u.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (duplicate) {
    return res.status(409).json({
      error: `A patient account named "${cleanName}" is already registered under mobile ${cleanMobile}. Please log in or use your Patient ID: ${duplicate.patientId}`,
      patientId: duplicate.patientId
    });
  }

  // Generate sequential Patient ID
  const patientCount = store.data.users.filter(u => u.role === 'patient').length;
  const patientId = `PID-${1001 + patientCount}`;

  const salt = bcrypt.genSaltSync(8);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newPatient = {
    id: 'usr-pat-' + uuidv4().slice(0, 8),
    patientId,
    role: 'patient',
    name: cleanName,
    mobile: cleanMobile,
    passwordHash,
    age: parseInt(age) || 50,
    gender: gender || 'Unspecified',
    village: village ? village.trim() : 'Rural Location',
    district: district ? district.trim() : 'Tirunelveli',
    address: address ? address.trim() : `${village || 'Village'}, ${district || 'Tirunelveli'}`,
    diabetesDurationYears: parseInt(diabetesDurationYears) || 0,
    preferredLanguage,
    registeredAt: new Date().toISOString()
  };

  store.data.users.push(newPatient);
  store.save();

  auditLog(req, 'PATIENT_REGISTERED', `New patient registered: ${patientId} (${cleanName}) on phone ${cleanMobile}`);

  const token = jwt.sign(
    {
      id: newPatient.id,
      patientId: newPatient.patientId,
      role: 'patient',
      name: newPatient.name,
      mobile: newPatient.mobile
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    message: 'Patient registered successfully',
    token,
    user: sanitizeUser(newPatient)
  });
};

// 2. Patient Login (Handles Shared Phone Number + Name/ID + Password)
exports.patientLogin = (req, res) => {
  const { patientIdentifier, mobile, password } = req.body;

  if (!mobile || !mobile.trim()) {
    return res.status(400).json({ error: '10-digit mobile number is required' });
  }
  if (!patientIdentifier || !patientIdentifier.trim()) {
    return res.status(400).json({ error: 'Patient name or Patient ID is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Personal password is required' });
  }

  const cleanMobile = mobile.trim();
  const cleanIdOrName = patientIdentifier.trim().toLowerCase();

  // Find all accounts registered under this mobile
  const accountsOnMobile = store.data.users.filter(
    u => u.role === 'patient' && u.mobile === cleanMobile
  );

  if (accountsOnMobile.length === 0) {
    return res.status(404).json({
      error: `No patient account registered with mobile number ${cleanMobile}. Please register first.`
    });
  }

  // Match specific account by name OR patientId
  const patient = accountsOnMobile.find(u =>
    (u.patientId && u.patientId.toLowerCase() === cleanIdOrName) ||
    u.name.toLowerCase() === cleanIdOrName ||
    u.name.toLowerCase().includes(cleanIdOrName)
  );

  if (!patient) {
    const familyNames = accountsOnMobile.map(a => `${a.name} (${a.patientId})`).join(', ');
    return res.status(404).json({
      error: `No patient matching "${patientIdentifier}" found under phone ${cleanMobile}. Available registered accounts on this phone: [${familyNames}]`,
      availableAccounts: accountsOnMobile.map(a => ({ patientId: a.patientId, name: a.name }))
    });
  }

  // Validate personal password
  const isMatch = bcrypt.compareSync(password, patient.passwordHash);
  if (!isMatch) {
    return res.status(401).json({
      error: `Incorrect password for ${patient.name} (${patient.patientId}). Please check your password or use Account Recovery.`
    });
  }

  auditLog(req, 'PATIENT_LOGIN', `Patient logged in: ${patient.patientId} (${patient.name})`);

  const token = jwt.sign(
    {
      id: patient.id,
      patientId: patient.patientId,
      role: 'patient',
      name: patient.name,
      mobile: patient.mobile
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    message: `Welcome back, ${patient.name}!`,
    token,
    user: sanitizeUser(patient)
  });
};

// 3. Shared Phone Account Discovery (Safe, does not leak passwords)
exports.lookupAccountsByPhone = (req, res) => {
  const { mobile } = req.query;
  if (!mobile || !mobile.trim()) {
    return res.status(400).json({ error: 'Mobile number query parameter is required' });
  }

  const cleanMobile = mobile.trim();
  const accounts = store.data.users
    .filter(u => u.role === 'patient' && u.mobile === cleanMobile)
    .map(u => ({
      patientId: u.patientId,
      name: u.name,
      village: u.village,
      district: u.district,
      registeredAt: u.registeredAt
    }));

  return res.json({
    mobile: cleanMobile,
    accountsCount: accounts.length,
    accounts
  });
};

// 4. Secure Doctor and Admin Login
exports.roleLogin = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Official email address is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Account password is required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Find user by email and expected role (doctor or admin)
  const user = store.data.users.find(u =>
    u.email && u.email.toLowerCase() === cleanEmail &&
    (role ? u.role === role : (u.role === 'doctor' || u.role === 'admin'))
  );

  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials. No authorized staff account found with this email.'
    });
  }

  // Verify password with bcrypt
  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({
      error: 'Invalid credentials. Password does not match our records.'
    });
  }

  // Check verification status for doctors
  if (user.role === 'doctor' && !user.isVerified) {
    return res.status(403).json({
      error: 'Clinical credentials pending institutional verification. Contact District Health Admin.'
    });
  }

  auditLog(req, 'STAFF_LOGIN', `${user.role.toUpperCase()} logged in: ${user.name} (${user.email})`);

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      specialization: user.specialization || null,
      hospital: user.hospital || null,
      regNumber: user.regNumber || null
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  return res.json({
    message: `Authenticated as ${user.name} (${user.role.toUpperCase()})`,
    token,
    user: sanitizeUser(user)
  });
};

// 5. Get Current User Profile
exports.getMe = (req, res) => {
  const user = store.data.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User record not found' });
  }
  return res.json({ user: sanitizeUser(user) });
};

// 6. Admin: List All Doctors
exports.getAllDoctors = (req, res) => {
  const doctors = store.data.users
    .filter(u => u.role === 'doctor')
    .map(sanitizeUser);
  return res.json({ total: doctors.length, doctors });
};

// 7. Admin: List All Patients
exports.getAllPatients = (req, res) => {
  const patients = store.data.users
    .filter(u => u.role === 'patient')
    .map(sanitizeUser);
  return res.json({ total: patients.length, patients });
};

// 8. Admin: Update Doctor Verification / Profile
exports.updateDoctor = (req, res) => {
  const doc = store.data.users.find(u => u.id === req.params.id && u.role === 'doctor');
  if (!doc) {
    return res.status(404).json({ error: 'Doctor not found' });
  }

  const { name, specialization, hospital, regNumber, isVerified, availableHours } = req.body;
  if (name) doc.name = name;
  if (specialization) doc.specialization = specialization;
  if (hospital) doc.hospital = hospital;
  if (regNumber) doc.regNumber = regNumber;
  if (isVerified !== undefined) doc.isVerified = Boolean(isVerified);
  if (availableHours) doc.availableHours = availableHours;

  store.save();
  auditLog(req, 'DOCTOR_UPDATED', `Admin updated doctor profile ${doc.id} (${doc.name})`);

  return res.json({ message: 'Doctor profile updated', doctor: sanitizeUser(doc) });
};
