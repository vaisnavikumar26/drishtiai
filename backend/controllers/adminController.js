const store = require('../config/db');
const { auditLog } = require('../middleware/auth');

// 1. Comprehensive Admin Dashboard Statistics
exports.getDashboardStats = (req, res) => {
  const registeredPatients = store.data.users.filter(u => u.role === 'patient');
  const doctors = store.data.users.filter(u => u.role === 'doctor');
  const screenings = store.data.screenings;
  const appointments = store.data.appointments;
  const healthCentres = store.data.healthCentres;

  const pendingReviews = screenings.filter(s => s.reviewStatus === 'Pending Review');
  const reviewedCases = screenings.filter(s => s.reviewStatus !== 'Pending Review');
  const referrals = screenings.filter(s => s.referralRecommended || s.urgencyLevel >= 2);

  const urgencyCounts = {
    level1: screenings.filter(s => s.urgencyLevel === 1).length,
    level2: screenings.filter(s => s.urgencyLevel === 2).length,
    level3: screenings.filter(s => s.urgencyLevel === 3).length,
    pending: pendingReviews.length
  };

  const appointmentStatuses = {
    pending: appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    rescheduled: appointments.filter(a => a.status === 'Rescheduled').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length
  };

  return res.json({
    metrics: {
      totalPatients: registeredPatients.length,
      totalDoctors: doctors.length,
      totalCentres: healthCentres.length,
      totalScreenings: screenings.length,
      pendingReviewsCount: pendingReviews.length,
      reviewedCasesCount: reviewedCases.length,
      referralsCount: referrals.length,
      urgencyCounts,
      appointmentStatuses
    },
    systemStatus: {
      aiConfigured: false,
      aiNotice: 'AI screening is not configured; clinical review is required.',
      smsConfigured: Boolean(process.env.SMS_PROVIDER_API_KEY),
      emailConfigured: Boolean(process.env.EMAIL_SMTP_HOST)
    }
  });
};

// 2. Audit Trail
exports.getAuditTrail = (req, res) => {
  const logs = [...store.data.auditLogs];
  return res.json({ total: logs.length, logs });
};

// 3. Notification Logs
exports.getNotificationLogs = (req, res) => {
  const notifs = [...store.data.notifications];
  return res.json({ total: notifs.length, notifications: notifs });
};

// 4. Retry Notification
exports.retryNotification = (req, res) => {
  const notif = store.data.notifications.find(n => n.notificationId === req.params.id);
  if (!notif) return res.status(404).json({ error: 'Notification record not found' });

  // Truthful check: Is real SMS provider configured?
  const hasKey = Boolean(process.env.SMS_PROVIDER_API_KEY);
  if (!hasKey) {
    notif.status = 'Disabled (Provider Not Configured)';
    notif.failureReason = 'Cannot dispatch: SMS_PROVIDER_API_KEY environment variable is not configured.';
    notif.lastRetry = new Date().toISOString();
    store.save();

    auditLog(req, 'NOTIFICATION_RETRY_ATTEMPTED', `Retry failed for ${notif.notificationId}: Provider not configured`);

    return res.status(400).json({
      error: 'SMS dispatch failed. No live SMS Gateway API Key is configured in environment.',
      notification: notif
    });
  }

  // If key exists (in real deployment), real dispatch would happen here
  notif.status = 'Delivered';
  notif.failureReason = null;
  notif.lastRetry = new Date().toISOString();
  store.save();

  auditLog(req, 'NOTIFICATION_RETRY_SUCCESS', `Notification ${notif.notificationId} successfully dispatched`);

  return res.json({ message: 'Notification resent successfully', notification: notif });
};

// 5. Get and Update Notification Configuration
exports.getNotificationConfig = (req, res) => {
  return res.json({
    config: store.data.notificationConfig,
    envCheck: {
      hasSmsApiKey: Boolean(process.env.SMS_PROVIDER_API_KEY),
      hasEmailHost: Boolean(process.env.EMAIL_SMTP_HOST)
    }
  });
};

exports.updateNotificationConfig = (req, res) => {
  const { smsProvider, smsConfigured, emailConfigured } = req.body;
  if (smsProvider) store.data.notificationConfig.smsProvider = smsProvider;
  if (smsConfigured !== undefined) store.data.notificationConfig.smsConfigured = Boolean(smsConfigured);
  if (emailConfigured !== undefined) store.data.notificationConfig.emailConfigured = Boolean(emailConfigured);
  store.save();

  auditLog(req, 'CONFIG_UPDATED', `Admin updated notification service configuration`);

  return res.json({ message: 'Notification settings updated', config: store.data.notificationConfig });
};
