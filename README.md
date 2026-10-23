# DrishtiAI – Rural Diabetic Retinopathy Screening & Eye Care System
*Connecting Rural Patients, Primary Health Centres, and Retinal Specialists in Tamil Nadu*

---

## 🌟 1. Project Overview & Healthcare Mission

**DrishtiAI** is an end-to-end, accessible digital healthcare platform engineered specifically for rural diabetic retinopathy (DR) screening, clinical triage, and tele-ophthalmology in rural India.

Diabetic retinopathy is a microvascular complication of diabetes that damages the delicate blood vessels in the retina. In its early stages, it is completely asymptomatic and painless, but left unchecked, it causes irreversible blindness. In rural communities where specialized ophthalmologists are concentrated in urban tertiary centres, early screening through Primary Health Centres (PHCs) and community camps prevents up to 95% of diabetes-related vision loss.

---

## 🛡️ 2. Core Healthcare & Medical Safety Principles

1. **Truth in Medical AI:**  
   The platform does not fabricate diagnoses, heuristic confidence scores, or synthetic percentages. In accordance with clinical safety principles, when an uncertified deep learning model is not configured, the platform explicitly and honestly presents:
   > *"AI automated screening is not configured; clinical review by an authorised ophthalmologist is required."*
2. **Clinical Override & Responsibility:**  
   Every screening outcome, urgency classification, and referral recommendation is established or confirmed by an authorized, verified clinician. Clinician judgment and patient clinical history override automated suggestions.
3. **No Fake Status Messages:**  
   The platform never fakes "SMS sent", "doctor available", or "video call connected" alerts. When SMS or Email gateways lack credentials in the server environment, delivery logs truthfully display `Disabled (Provider Not Configured)` with clear administrative retry options.

---

## 👥 3. Three Role-Based Access Portals

### 🏥 A. Patient Portal
* **Shared-Phone Rural Architecture:** In rural households, multiple family members often share a single mobile handset. DrishtiAI assigns each family member their own unique Patient Account Identifier (`PID-XXXX`), separate name, and private personal password. Patients sharing a phone cannot access each other's medical records.
* **Account Recovery & Discovery:** Families sharing a phone can query their phone number to see which family member accounts are registered (`PID-1001`, `PID-1002`) without exposing passwords.
* **8 Core Dashboard Actions:**
  1. *Upload Retinal Image:* Camera capture (`capture="environment"`) or file upload (JPEG/PNG, max 10MB) with retake option and explicit informed consent.
  2. *My Screening Status:* Live tracking of pending triage and clinician reviews.
  3. *My Report & Doctor's Review:* Printable clinical report with 3-level urgency triage badge, doctor notes, and hospital referral slips.
  4. *Find Nearby PHC / Hospital:* GPS-based distance calculation and manual search by village or PIN code (including Ambasamudram & Tirunelveli).
  5. *Book an Appointment:* Schedule clinic slots with preferred centres and doctors.
  6. *Video Consultation:* Peer-to-peer WebRTC consultation room with honest waiting/unavailable states.
  7. *Messages & Notifications:* Direct two-way clinician messaging and notification history.
  8. *My Profile & Language:* Patient details and 1-click toggle between Tamil and English.

### 🩺 B. Doctor Station
* **Individual Credentials:** Authenticated login with bcrypt password verification.
* **Clinical Verification:** Displays state medical council registration numbers (e.g., `TMC-78412`), degree (`MS Ophth`), hospital affiliation, and verified badge.
* **Assigned Case Queue:** Clinicians only review cases assigned to them or unassigned community cases.
* **3-Level Urgency Triage Workflow:**
  * *Level 1 – Routine:* Annual routine screening (12 months).
  * *Level 2 – Follow-up Needed:* Recommended specialist appointment within 2–4 weeks.
  * *Level 3 – Urgent Review:* Immediate prompt clinical evaluation within 24–48 hours.
* **Appointment Lifecycle:** Accept, reschedule, or cancel patient clinic requests.
* **Direct Messaging:** Reply to patient queries in real time.

### 🏛️ C. District Health Administrator Portal
* **District Dashboard:** Real-time metrics on registered patients, pending reviews, completed triages, referrals, and appointments.
* **Case Routing:** Re-assign pending screening cases to authorized clinicians.
* **Patient Registry:** Onboard new rural patients and issue patient IDs.
* **Doctor Directory:** Verify and manage clinician profiles and hospital affiliations.
* **Health Centre Directory:** Maintain verified Primary Health Centres, Taluk Government Hospitals, and eye centres.
* **Audit Trail:** Immutable audit log tracking sensitive actions (logins, uploads, reviews, triage updates) without logging passwords or PHI.
* **Notification Gateway:** Inspect delivery status and manage SMS / SMTP configurations.

---

## 🗺️ 4. Verified Health Centre Directory (Ambasamudram & Tirunelveli Focus)

The system includes verified healthcare facilities across southern Tamil Nadu:

| Facility Name | Category | Location | Contact | Services |
|---|---|---|---|---|
| **Ambasamudram Taluk Government Hospital** | Government Hospital | Ambasamudram, Tirunelveli (PIN: 627401) | +91 4634 250230 | 24x7 Casualty, DR Screening Camp, CMCHIS Free Treatment |
| **Ambasamudram Block PHC (Kallidaikurichi)** | Primary Health Centre | Kallidaikurichi, Ambasamudram (PIN: 627416) | +91 4634 251120 | Non-Mydriatic Fundus Camera, Blood Sugar Tests, ASHA Link |
| **Tirunelveli Medical College Hospital (TVMCH)** | Govt Medical College | Palayamkottai, Tirunelveli (PIN: 627011) | +91 462 2572733 | 24x7 Eye Casualty, Vitreo-Retinal Laser Photocoagulation, OCT |
| **Aravind Eye Hospital – Tirunelveli** | Eye Specialty Hospital | Tirunelveli Junction (PIN: 627001) | +91 462 4356100 | Subsidized & Free Wings, Advanced Vitreo-Retinal Surgery, Anti-VEGF |
| **Government District HQ Hospital, Tenkasi** | Government Hospital | Railway Feeder Rd, Tenkasi (PIN: 627811) | +91 4633 222234 | Diabetic Retinopathy Assessment, 24x7 Trauma |
| **Aravind Eye Hospital – Madurai Apex** | Apex Eye Institute | 1 Anna Nagar, Madurai (PIN: 625020) | +91 452 4356500 | Micro-incision Vitrectomy, Tertiary Referral Center |

---

## 🌐 5. Complete Tamil & English Bilingual System

The interface provides instant, full translation across the entire platform:
* Landing page, hero, and simple-language medical explanations.
* Navigation bars, drawer menus, buttons, forms, and placeholders.
* Patient login, shared-phone family discovery, and registration.
* Retinal upload wizard, file validation messages, and consent checkboxes.
* Triage urgency labels, report explanations, and referral slips.
* Health centre directory, emergency instructions, and appointment statuses.
* Preserves language choice in `localStorage`.

---

## 🚀 6. Step-by-Step Execution Guide

### Prerequisites
* **Node.js** v18+ (tested with v20 and v24)
* **npm** v9+

### Option A: Running Backend & Frontend Together
Open two separate terminal windows (PowerShell or Command Prompt):

#### Terminal 1 – Start Backend Server (Port 5000):
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\drishtiai\backend
node server.js
```
*Output confirmation:*
```text
[DrishtiAI Backend] Server running on port 5000
[DrishtiAI Telemed] WebSocket Signaling ready at ws://localhost:5000/ws/telemed
```

#### Terminal 2 – Start React Frontend (Port 5173):
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\drishtiai\frontend
npm run dev
```
*Output confirmation:*
```text
VITE v5.4.21 ready in 465 ms
➜ Local: http://localhost:5173/
```

Open your browser to: **`http://localhost:5173`**

---

## 🧪 7. Running Automated Test Suite

A comprehensive 10-point end-to-end integration test is located in `backend/test_suite.js`.

Run the test suite while the backend server is running:
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\drishtiai
node backend/test_suite.js
```

### Test Suite Coverage:
1. `GET /health` – Server health & uptime check.
2. `POST /api/auth/role-login` – Admin authentication with bcrypt.
3. `POST /api/auth/role-login` – Doctor authentication with institutional credentials.
4. `POST /api/auth/patient-login` – Shared phone verification: logs in Patient 1 (Muthuvel K.) and Patient 2 (Kuppammal M.) on the same phone (`9876543210`) with distinct passwords.
5. Role-Based Access Control (RBAC) – Confirms Patient 1 cannot access Patient 2's medical records or Admin dashboard endpoints.
6. `GET /api/centres` – Queries centres matching "Ambasamudram" and verifies GPS Haversine distance computation.
7. `PUT /api/screenings/:id/review` – Clinician triage: updates case to Urgency Level 2 with doctor notes and timeframe.
8. `POST /api/appointments` – Appointment booking and doctor confirmation lifecycle.
9. `POST /api/messages` – Two-way patient-doctor encrypted chat.
10. `GET /api/admin/audit-logs` & `GET /api/admin/notifications` – Audit logging and truthful notification status verification.

---

## 🔑 8. Pre-Configured Test Credentials

| Role | Name / Identifier | Email / Phone | Password | Key Capabilities |
|---|---|---|---|---|
| **Patient 1** | Muthuvel K. (`PID-1001`) | `9876543210` | `Patient123!` | Upload fundus, view Level 2 report, message doctor |
| **Patient 2** | Kuppammal M. (`PID-1002`) | `9876543210` *(Shared Phone!)* | `Kuppam@2026` | Independent account on same mobile, Level 1 report |
| **Patient 3** | Meenakshi Sundaram (`PID-1003`) | `9845012345` | `Meenakshi@123` | Level 3 Urgent Review case |
| **Doctor** | Dr. Aruna Natarajan, MS (Ophth) | `doctor@drishtiai.in` | `DoctorPass@123` | TMC-78412, Review queue, assign Level 1/2/3 urgency |
| **Doctor 2** | Dr. K. Sundaram, MD | `dr.sundar@drishtiai.in` | `DoctorPass@123` | TMC-65239, TVMCH ophthalmologist |
| **Admin** | Dr. C. Soundarapandian, DHO | `admin@drishtiai.in` | `AdminSecure@2026` | District metrics, doctor/centre management, audit logs |

---

## 📋 9. Feature Status Matrix

| Component | Status | Notes |
|---|---|---|
| **Landing Page** | Fully Working | Welcoming simple-language explanations, high-contrast accessible design, 6 main action buttons. |
| **Bilingual Toggle (Tamil & English)** | Fully Working | Translates 100% of the UI, persisted in localStorage. |
| **Shared Phone Patient Accounts** | Fully Working | Supports multiple family members on one phone number with separate passwords and accounts. |
| **Patient Registration & Login** | Fully Working | Hashed passwords (bcrypt), JWT authentication, patient discovery modal. |
| **Retinal Image Upload** | Fully Working | Camera capture, file upload, MIME & size validation, retake, informed consent. |
| **Medical Safety & Honest AI** | Fully Working | Displays honest "AI screening is not configured; clinical review required" disclaimer without fake scores. |
| **3-Level Urgency Triage** | Fully Working | Level 1 (Routine), Level 2 (Follow-up), Level 3 (Urgent), customizable timeframe and clinician override. |
| **Nearby Health Centres Finder** | Fully Working | Real verified centres in Ambasamudram, Tirunelveli, Tenkasi, Madurai; browser GPS distance calculation; directions links. |
| **Appointments System** | Fully Working | Request booking, doctor availability display, statuses: Pending, Confirmed, Rescheduled, Cancelled. |
| **Doctor-Patient Messaging** | Fully Working | Persistent two-way messaging between patient and doctor. |
| **WebRTC Video Consultation** | Fully Working | Real browser media stream, WebSocket signaling, honest unavailable state if peer absent. |
| **Audit Trail** | Fully Working | Logs all sensitive actions without logging passwords or sensitive PHI. |
| **SMS / Email Gateways** | Honest Unconfigured State | Truthfully reports unconfigured status when API keys are absent in environment. |

---

## 🔒 10. Security & Privacy Notes

* **Data Minimization:** Only relevant demographic and ophthalmological data is collected.
* **Password Security:** Salted and hashed using `bcryptjs` with 8 rounds.
* **Session Tokens:** Signed JWT tokens with strict expiry and role verification.
* **Auditability:** Complete administrative event log for institutional compliance.
