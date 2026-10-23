const { v4: uuidv4 } = require('uuid');
const store = require('../config/db');
const { auditLog } = require('../middleware/auth');

// 1. Get Appointments (With RBAC Filtering)
exports.getAppointments = (req, res) => {
  const user = req.user;
  let list = [];

  if (user.role === 'patient') {
    list = store.data.appointments.filter(a => a.patientId === user.patientId);
  } else if (user.role === 'doctor') {
    list = store.data.appointments.filter(a => a.doctorId === user.id);
  } else if (user.role === 'admin') {
    list = store.data.appointments;
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Sort latest first
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.json({ total: list.length, appointments: list });
};

// 2. Create Appointment Request
exports.createAppointment = (req, res) => {
  const user = req.user;
  const b = req.body;

  const patientId = user.role === 'patient' ? user.patientId : (b.patientId || `PID-${uuidv4().slice(0, 6)}`);
  const patientName = user.role === 'patient' ? user.name : (b.patientName || 'Rural Patient');
  const mobile = user.role === 'patient' ? user.mobile : (b.mobile || '9876543210');

  if (!b.preferredDate) {
    return res.status(400).json({ error: 'Preferred appointment date is required' });
  }

  // Find requested doctor if specified
  let doctor = null;
  if (b.doctorId) {
    doctor = store.data.users.find(u => u.id === b.doctorId && u.role === 'doctor');
  }
  if (!doctor) {
    const docs = store.data.users.filter(u => u.role === 'doctor' && u.isVerified);
    doctor = docs[0] || { id: 'doc-1', name: 'Dr. Aruna Natarajan, MS (Ophth)' };
  }

  // Find centre
  let centre = null;
  if (b.centreId) {
    centre = store.data.healthCentres.find(c => c.id === b.centreId);
  }
  if (!centre) {
    centre = store.data.healthCentres[0] || { id: 'centre-amba-gh', name: 'Ambasamudram Taluk Government Hospital' };
  }

  const appointmentId = 'APT-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);

  const newAppointment = {
    appointmentId,
    patientId,
    patientName,
    mobile,
    doctorId: doctor.id,
    doctorName: doctor.name,
    centreId: centre.id,
    centreName: centre.name,
    preferredDate: b.preferredDate,
    preferredTime: b.preferredTime || '10:00 AM',
    reason: b.reason || 'Diabetic Retinopathy Follow-up Consultation',
    status: 'Pending',
    doctorNotes: '',
    rescheduledDate: null,
    createdAt: new Date().toISOString()
  };

  store.data.appointments.unshift(newAppointment);

  auditLog(req, 'APPOINTMENT_REQUESTED', `Appointment ${appointmentId} requested by ${patientName} with ${doctor.name}`);

  // Notification logging
  store.data.notifications.unshift({
    notificationId: 'notif-' + uuidv4().slice(0, 8),
    patientId,
    recipient: `${mobile} (${patientName})`,
    type: 'SMS',
    event: 'Appointment Requested',
    message: `DrishtiAI: Appointment request ${appointmentId} received for ${newAppointment.preferredDate} at ${centre.name}. Status: Pending Doctor Confirmation.`,
    status: 'Disabled (Provider Not Configured)',
    failureReason: 'SMS Gateway credentials are not configured in environment variables.',
    consentGranted: true,
    createdAt: new Date().toISOString()
  });

  store.save();

  return res.status(201).json({
    message: 'Appointment request submitted successfully',
    appointment: newAppointment
  });
};

// 3. Update Appointment Status (Doctor / Admin: Confirm, Reschedule, Complete, Cancel)
exports.updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status, doctorNotes, rescheduledDate, rescheduledTime } = req.body;
  const user = req.user;

  const validStatuses = ['Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const appointment = store.data.appointments.find(a => a.appointmentId === id);
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  // Doctor can only update their own appointments; Admin can update any
  if (user.role === 'doctor' && appointment.doctorId !== user.id) {
    return res.status(403).json({ error: 'You are only authorized to update appointments assigned to you.' });
  }

  appointment.status = status;
  if (doctorNotes !== undefined) appointment.doctorNotes = doctorNotes;
  if (rescheduledDate) {
    appointment.rescheduledDate = rescheduledDate;
    if (rescheduledTime) appointment.preferredTime = rescheduledTime;
  }
  appointment.updatedAt = new Date().toISOString();
  appointment.updatedBy = user.name;

  auditLog(req, 'APPOINTMENT_STATUS_UPDATE', `Appointment ${id} status updated to ${status} by ${user.name}`);

  // Notification log
  store.data.notifications.unshift({
    notificationId: 'notif-' + uuidv4().slice(0, 8),
    patientId: appointment.patientId,
    recipient: `${appointment.mobile} (${appointment.patientName})`,
    type: 'SMS',
    event: `Appointment ${status}`,
    message: `DrishtiAI: Your appointment ${id} with ${appointment.doctorName} is now ${status}. Notes: ${doctorNotes || 'None'}.`,
    status: 'Disabled (Provider Not Configured)',
    failureReason: 'SMS Gateway credentials are not configured in environment variables.',
    consentGranted: true,
    createdAt: new Date().toISOString()
  });

  store.save();

  return res.json({
    message: `Appointment ${id} successfully updated to ${status}`,
    appointment
  });
};
