const BASE_URL = 'http://localhost:5000/api';

function getAuthHeader() {
  const token = localStorage.getItem('drishtiai_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    ...getAuthHeader(),
    ...options.headers
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || `HTTP error ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// 1. Authentication & Accounts
export async function loginPatient(mobile, patientIdentifier, password) {
  return await request('/auth/patient-login', {
    method: 'POST',
    body: JSON.stringify({ mobile, patientIdentifier, password })
  });
}

export async function registerPatient(patientData) {
  return await request('/auth/register-patient', {
    method: 'POST',
    body: JSON.stringify(patientData)
  });
}

export async function lookupAccountsByPhone(mobile) {
  return await request(`/auth/patient-lookup?mobile=${encodeURIComponent(mobile)}`);
}

export async function loginRole(email, password, role) {
  return await request('/auth/role-login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
}

export async function fetchMe() {
  return await request('/auth/me');
}

export async function fetchAllDoctors() {
  return await request('/doctors');
}

export async function updateDoctor(id, data) {
  return await request(`/doctors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function fetchAllPatients() {
  return await request('/patients');
}

// 2. Screenings & Clinical Assessment
export async function fetchAllScreenings() {
  return await request('/screenings');
}

export async function fetchScreeningById(id) {
  return await request(`/screenings/${id}`);
}

export async function submitScreening(payload, imageFile = null) {
  if (imageFile) {
    const formData = new FormData();
    Object.keys(payload).forEach(key => formData.append(key, payload[key]));
    formData.append('image', imageFile);
    return await request('/screenings', {
      method: 'POST',
      body: formData
    });
  }
  return await request('/screenings', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateDoctorReview(id, reviewData) {
  return await request(`/screenings/${id}/review`, {
    method: 'PUT',
    body: JSON.stringify(reviewData)
  });
}

export async function assignDoctorToScreening(id, doctorId) {
  return await request(`/screenings/${id}/assign`, {
    method: 'PUT',
    body: JSON.stringify({ doctorId })
  });
}

// 3. Health Centres & Hospitals
export async function fetchHealthCentres(params = {}) {
  const queryParts = [];
  if (params.query) queryParts.push(`query=${encodeURIComponent(params.query)}`);
  if (params.district) queryParts.push(`district=${encodeURIComponent(params.district)}`);
  if (params.userLat && params.userLng) {
    queryParts.push(`userLat=${params.userLat}&userLng=${params.userLng}`);
  }
  const qs = queryParts.length ? `?${queryParts.join('&')}` : '';
  return await request(`/centres${qs}`);
}

export async function fetchHealthCentreById(id) {
  return await request(`/centres/${id}`);
}

export async function createHealthCentre(data) {
  return await request('/centres', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateHealthCentre(id, data) {
  return await request(`/centres/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteHealthCentre(id) {
  return await request(`/centres/${id}`, {
    method: 'DELETE'
  });
}

// 4. Appointments
export async function fetchAppointments() {
  return await request('/appointments');
}

export async function createAppointment(data) {
  return await request('/appointments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAppointmentStatus(id, data) {
  return await request(`/appointments/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// 5. Messages
export async function fetchMessages(patientId = null, doctorId = null) {
  const queryParts = [];
  if (patientId) queryParts.push(`patientId=${encodeURIComponent(patientId)}`);
  if (doctorId) queryParts.push(`doctorId=${encodeURIComponent(doctorId)}`);
  const qs = queryParts.length ? `?${queryParts.join('&')}` : '';
  return await request(`/messages${qs}`);
}

export async function sendMessage(data) {
  return await request('/messages', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 6. District Administration & Operations
export async function fetchAdminStats() {
  return await request('/admin/stats');
}

export async function fetchAuditLogs() {
  return await request('/admin/audit-logs');
}

export async function fetchNotificationLogs() {
  return await request('/admin/notifications');
}

export async function retryNotification(id) {
  return await request(`/admin/notifications/${id}/retry`, {
    method: 'POST'
  });
}

export async function fetchNotificationConfig() {
  return await request('/admin/notification-config');
}

export async function updateNotificationConfig(config) {
  return await request('/admin/notification-config', {
    method: 'PUT',
    body: JSON.stringify(config)
  });
}

// 7. Camp Offline Records Synchronization
export async function syncOfflineRecordsToBackend(records) {
  return await request('/sync', {
    method: 'POST',
    body: JSON.stringify({ records })
  });
}

