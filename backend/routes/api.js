const express = require('express');
const router = express.Router();

const { authenticateToken, requireRole, rateLimiter } = require('../middleware/auth');
const upload = require('../middleware/upload');

const authCtrl = require('../controllers/authController');
const screeningCtrl = require('../controllers/screeningController');
const healthCentreCtrl = require('../controllers/healthCentreController');
const appointmentCtrl = require('../controllers/appointmentController');
const messageCtrl = require('../controllers/messageController');
const adminCtrl = require('../controllers/adminController');
const syncCtrl = require('../controllers/syncController');
const simCtrl = require('../controllers/simController');

// Rate limiters for security
const authLimiter = rateLimiter({ windowMs: 60000, maxRequests: 20, message: 'Too many login attempts. Please wait 1 minute.' });
const uploadLimiter = rateLimiter({ windowMs: 60000, maxRequests: 15, message: 'Upload limit reached. Please wait.' });

// 1. Authentication & User Management
router.post('/auth/register-patient', authLimiter, authCtrl.registerPatient);
router.post('/auth/patient-login', authLimiter, authCtrl.patientLogin);
router.get('/auth/patient-lookup', authCtrl.lookupAccountsByPhone);
router.post('/auth/role-login', authLimiter, authCtrl.roleLogin);
router.get('/auth/me', authenticateToken, authCtrl.getMe);
router.get('/doctors', authenticateToken, authCtrl.getAllDoctors);
router.put('/doctors/:id', authenticateToken, requireRole('admin'), authCtrl.updateDoctor);
router.get('/patients', authenticateToken, requireRole('admin', 'doctor'), authCtrl.getAllPatients);

// 2. Screening & Clinical Reviews (Protected by RBAC)
router.get('/screenings', authenticateToken, screeningCtrl.getAllScreenings);
router.get('/screenings/:id', authenticateToken, screeningCtrl.getScreeningById);
router.post('/screenings', authenticateToken, uploadLimiter, upload.single('image'), screeningCtrl.createScreening);
router.put('/screenings/:id/review', authenticateToken, requireRole('doctor', 'admin'), screeningCtrl.updateDoctorReview);
router.put('/screenings/:id/assign', authenticateToken, requireRole('admin'), screeningCtrl.assignDoctor);

// 3. Health Centres & Hospitals (Directory accessible to all, management to Admin)
router.get('/centres', healthCentreCtrl.getAllCentres);
router.get('/centres/:id', healthCentreCtrl.getCentreById);
router.post('/centres', authenticateToken, requireRole('admin'), healthCentreCtrl.createCentre);
router.put('/centres/:id', authenticateToken, requireRole('admin'), healthCentreCtrl.updateCentre);
router.delete('/centres/:id', authenticateToken, requireRole('admin'), healthCentreCtrl.deleteCentre);

// 4. Appointments & Consultations
router.get('/appointments', authenticateToken, appointmentCtrl.getAppointments);
router.post('/appointments', authenticateToken, appointmentCtrl.createAppointment);
router.put('/appointments/:id/status', authenticateToken, requireRole('doctor', 'admin'), appointmentCtrl.updateAppointmentStatus);

// 5. Patient-Doctor Messages
router.get('/messages', authenticateToken, messageCtrl.getMessages);
router.post('/messages', authenticateToken, messageCtrl.sendMessage);

// 6. District Administration & Audit Trail
router.get('/admin/stats', authenticateToken, requireRole('admin'), adminCtrl.getDashboardStats);
router.get('/admin/audit-logs', authenticateToken, requireRole('admin'), adminCtrl.getAuditTrail);
router.get('/admin/notifications', authenticateToken, requireRole('admin'), adminCtrl.getNotificationLogs);
router.post('/admin/notifications/:id/retry', authenticateToken, requireRole('admin'), adminCtrl.retryNotification);
router.get('/admin/notification-config', authenticateToken, requireRole('admin'), adminCtrl.getNotificationConfig);
router.put('/admin/notification-config', authenticateToken, requireRole('admin'), adminCtrl.updateNotificationConfig);

// 7. Camp Sync & Operational Capacity Modeling
router.post('/sync', authenticateToken, syncCtrl.syncOfflineRecords);
router.post('/simulate/capacity', simCtrl.runSimulinkModel);

module.exports = router;
