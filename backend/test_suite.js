const http = require('http');
const assert = require('assert');

// Helper to make HTTP requests
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api' + path,
        method,
        headers
      },
      res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on('error', err => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('  RUNNING DRISHTIAI BACKEND INTEGRATION TEST SUITE  ');
  console.log('====================================================\n');

  try {
    // 1. Health check
    console.log('Test 1: Health check');
    const health = await new Promise((resolve, reject) => {
      http.get('http://localhost:5000/health', res => {
        let d = '';
        res.on('data', c => (d += c));
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
    assert.strictEqual(health.status, 'ONLINE');
    console.log('  ✓ Backend server is ONLINE\n');

    // 2. Admin Login
    console.log('Test 2: Admin login with password');
    const adminRes = await request('POST', '/auth/role-login', {
      email: 'admin@drishtiai.in',
      password: 'AdminSecure@2026',
      role: 'admin'
    });
    assert.strictEqual(adminRes.status, 200, `Admin login failed: ${JSON.stringify(adminRes.body)}`);
    assert(adminRes.body.token, 'Token must be returned');
    assert.strictEqual(adminRes.body.user.role, 'admin');
    const adminToken = adminRes.body.token;
    console.log(`  ✓ Admin authenticated: ${adminRes.body.user.name}\n`);

    // 3. Doctor Login
    console.log('Test 3: Doctor login with individual password');
    const docRes = await request('POST', '/auth/role-login', {
      email: 'doctor@drishtiai.in',
      password: 'DoctorPass@123',
      role: 'doctor'
    });
    assert.strictEqual(docRes.status, 200, `Doctor login failed: ${JSON.stringify(docRes.body)}`);
    assert.strictEqual(docRes.body.user.role, 'doctor');
    assert(docRes.body.user.regNumber, 'Doctor must have verified medical registration');
    const docToken = docRes.body.token;
    console.log(`  ✓ Doctor authenticated: ${docRes.body.user.name} (${docRes.body.user.regNumber})\n`);

    // 4. Shared Phone Patient Account Handling
    console.log('Test 4: Shared Phone Patient Architecture');
    console.log('  Subtest 4a: Login Patient 1 (Muthuvel K.) on shared phone 9876543210');
    const p1Res = await request('POST', '/auth/patient-login', {
      mobile: '9876543210',
      patientIdentifier: 'Muthuvel K.',
      password: 'Patient123!'
    });
    assert.strictEqual(p1Res.status, 200, `P1 login failed: ${JSON.stringify(p1Res.body)}`);
    assert.strictEqual(p1Res.body.user.patientId, 'PID-1001');
    const p1Token = p1Res.body.token;
    console.log(`  ✓ Patient 1 (Muthuvel K., PID-1001) logged in successfully`);

    console.log('  Subtest 4b: Login Patient 2 (Kuppammal M.) on SAME phone 9876543210 with different password');
    const p2Res = await request('POST', '/auth/patient-login', {
      mobile: '9876543210',
      patientIdentifier: 'Kuppammal M.',
      password: 'Kuppam@2026'
    });
    assert.strictEqual(p2Res.status, 200, `P2 login failed: ${JSON.stringify(p2Res.body)}`);
    assert.strictEqual(p2Res.body.user.patientId, 'PID-1002');
    console.log(`  ✓ Patient 2 (Kuppammal M., PID-1002) logged in successfully on same phone`);

    console.log('  Subtest 4c: Wrong password rejection on shared phone');
    const wrongPassRes = await request('POST', '/auth/patient-login', {
      mobile: '9876543210',
      patientIdentifier: 'Muthuvel K.',
      password: 'WrongPassword999'
    });
    assert.strictEqual(wrongPassRes.status, 401);
    console.log('  ✓ Incorrect password safely rejected');

    console.log('  Subtest 4d: Shared phone account discovery lookup');
    const lookupRes = await request('GET', '/auth/patient-lookup?mobile=9876543210');
    assert.strictEqual(lookupRes.status, 200);
    assert(lookupRes.body.accountsCount >= 2, 'Should find at least 2 accounts for phone 9876543210');
    console.log(`  ✓ Found ${lookupRes.body.accountsCount} separate patient accounts for phone 9876543210\n`);

    // 5. Patient Data Privacy & RBAC Isolation
    console.log('Test 5: Patient Medical Privacy & RBAC');
    const p1Screenings = await request('GET', '/screenings', null, p1Token);
    assert.strictEqual(p1Screenings.status, 200);
    // All screenings returned must strictly belong to PID-1001
    const hasForeignData = p1Screenings.body.screenings.some(s => s.patientId !== 'PID-1001');
    assert(!hasForeignData, 'Security violation: Patient can view another patient\'s screenings!');
    console.log(`  ✓ Patient PID-1001 strictly sees only their own screenings (${p1Screenings.body.screenings.length} records)`);

    console.log('  Subtest 5b: Patient cannot access admin dashboard stats');
    const unauthorizedAdmin = await request('GET', '/admin/stats', null, p1Token);
    assert.strictEqual(unauthorizedAdmin.status, 403);
    console.log('  ✓ Patient forbidden from accessing administrative endpoints (403)\n');

    // 6. Verified Health Centre Finder with Ambasamudram & Tirunelveli
    console.log('Test 6: Verified Health Centre Finder');
    const ambaQuery = await request('GET', '/centres?query=Ambasamudram');
    assert.strictEqual(ambaQuery.status, 200);
    assert(ambaQuery.body.centres.length > 0, 'Must find centres in Ambasamudram');
    console.log(`  ✓ Found ${ambaQuery.body.centres.length} centres matching "Ambasamudram":`);
    ambaQuery.body.centres.forEach(c => console.log(`     - ${c.name} (${c.category})`));

    const distQuery = await request('GET', '/centres?userLat=8.7062&userLng=77.4560'); // Ambasamudram coords
    assert.strictEqual(distQuery.status, 200);
    assert(distQuery.body.centres[0].distanceKm !== undefined, 'Distances must be computed');
    console.log(`  ✓ Geolocation distance computed. Nearest centre: ${distQuery.body.centres[0].name} (${distQuery.body.centres[0].distanceKm} km away)\n`);

    // 7. Clinical 3-Level Urgency Triage & Review
    console.log('Test 7: Clinical 3-Level Urgency Triage');
    const reviewRes = await request('PUT', '/screenings/scr-104/review', {
      urgencyLevel: 2,
      urgencyTimeframe: 'Within 3 weeks',
      clinicalAssessment: 'Clinician confirmed mild NPDR with localized hard exudates.',
      doctorNotes: 'Prescribed dilated fundus exam and advised glycemic maintenance.',
      referralRecommended: true,
      referralCenterId: 'centre-amba-gh',
      referralCenterName: 'Ambasamudram Taluk Government Hospital'
    }, docToken);
    assert.strictEqual(reviewRes.status, 200);
    assert.strictEqual(reviewRes.body.screening.urgencyLevel, 2);
    assert.strictEqual(reviewRes.body.screening.urgencyLabel, 'Level 2 – Follow-up needed');
    console.log(`  ✓ Urgency triage updated: ${reviewRes.body.screening.urgencyLabel} (${reviewRes.body.screening.urgencyTimeframe})\n`);

    // 8. Appointment Booking & Status Management
    console.log('Test 8: Appointment Booking and Status Lifecycle');
    const aptRes = await request('POST', '/appointments', {
      preferredDate: '2026-11-05',
      preferredTime: '11:00 AM',
      reason: 'Routine retinal dilated follow-up',
      centreId: 'centre-amba-gh',
      doctorId: 'doc-1'
    }, p1Token);
    assert.strictEqual(aptRes.status, 201);
    const newAptId = aptRes.body.appointment.appointmentId;
    console.log(`  ✓ Patient booked appointment: ${newAptId} (Status: ${aptRes.body.appointment.status})`);

    const confirmAptRes = await request('PUT', `/appointments/${newAptId}/status`, {
      status: 'Confirmed',
      doctorNotes: 'Slot confirmed. Please report to Room 4 Ophthal OPD.'
    }, docToken);
    assert.strictEqual(confirmAptRes.status, 200);
    assert.strictEqual(confirmAptRes.body.appointment.status, 'Confirmed');
    console.log(`  ✓ Doctor confirmed appointment ${newAptId}\n`);

    // 9. Two-way Messaging
    console.log('Test 9: Secure Patient-Doctor Messaging');
    const msgSend = await request('POST', '/messages', {
      text: 'Vanakkam doctor, should I take eye drops before coming for the dilated exam?',
      doctorId: 'doc-1'
    }, p1Token);
    assert.strictEqual(msgSend.status, 201);
    console.log(`  ✓ Patient sent message: "${msgSend.body.data.text}"`);

    const msgList = await request('GET', '/messages?patientId=PID-1001', null, docToken);
    assert.strictEqual(msgList.status, 200);
    assert(msgList.body.messages.length > 0);
    console.log(`  ✓ Doctor retrieved conversation (${msgList.body.messages.length} messages)\n`);

    // 10. Audit Trail & Notification Honesty
    console.log('Test 10: Audit Trail & Honest Notification Status');
    const auditRes = await request('GET', '/admin/audit-logs', null, adminToken);
    assert.strictEqual(auditRes.status, 200);
    assert(auditRes.body.logs.length > 0);
    console.log(`  ✓ Audit trail logged ${auditRes.body.total} sensitive clinical and operational events`);

    const notifRes = await request('GET', '/admin/notifications', null, adminToken);
    assert.strictEqual(notifRes.status, 200);
    const hasUnconfiguredNote = notifRes.body.notifications.some(n => n.status.includes('Disabled'));
    assert(hasUnconfiguredNote, 'Notification system must truthfully disclose unconfigured status when SMS credentials are not set');
    console.log(`  ✓ Notification delivery logs show truthful "Disabled (Provider Not Configured)" status when credentials are absent\n`);

    console.log('====================================================');
    console.log('  ALL INTEGRATION TESTS PASSED SUCCESSFULLY! (10/10)  ');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('TEST FAILURE:', err);
    process.exit(1);
  }
}

runTests();
