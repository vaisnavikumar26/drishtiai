# Project Audit & Technical Architecture Review
**Platform:** DrishtiAI – Rural Diabetic Retinopathy Screening & Eye Care System  
**Date:** October 2026  
**Auditor:** Senior Full-Stack Healthcare Application Architect

---

## 1. Executive Summary

This comprehensive audit examines the existing codebase of **DrishtiAI**, located at `C:\Users\HP\.gemini\antigravity\scratch\drishtiai`. The objective is to evaluate its technical architecture, user interface, clinical workflows, data privacy, and medical safety against requirements for a real-world, rural-accessible healthcare platform serving **Patients, Doctors, and Administrators**.

---

## 2. Existing Technology Stack

| Layer | Technology | Current Status | Findings & Assessment |
|---|---|---|---|
| **Frontend Framework** | React 18.3.1 (Vite 5.4.6) | Functional | Fast build, uses Tailwind CSS 3.4 and Lucide React icons. |
| **Local Storage / Offline** | Dexie.js 4.0.8 (IndexedDB) | Functional | Basic offline cache exists; lacks clinical integrity validation. |
| **Backend API** | Node.js Express 4.19.2 | Partial / Insecure | Server starts on port 5000; lacks real authentication, authorization, and rate limiting. |
| **WebSockets** | `ws` 8.16.0 | Partial | Simple broadcast signalling on `/ws/telemed`; WebRTC client is a mock UI. |
| **Database** | JSON File Store (`data_store.json`) | Insecure | Resilient in-memory/file JSON store without schema enforcement, password hashing, or RBAC. |
| **AI Microservice** | Python FastAPI 0.141.1 + OpenCV + NumPy | Mock / Unsafe | Uses green channel standard deviation heuristics and synthetic images to guess DR stages. Generates fake confidence scores. |
| **Styling** | Tailwind CSS 3.4.11 | Dark-mode only | Dark futuristic theme (`bg-slate-950`) difficult for elderly rural users to read; lacks high-contrast healthcare accessibility. |
| **Internationalization** | Custom Context (`LanguageContext.jsx`) | Incomplete | Only ~38 keys translated; 90% of UI is hardcoded in English. |

---

## 3. Critical Problems & Gaps Identified

### 3.1 Medical Safety & AI Diagnostic Integrity
* **Unsound Heuristic Classification:** The Python microservice in `ai-service/app/model.py` and client-side `localInference.js` compute pseudo-diagnoses based on basic image standard deviation or sample ID strings, appending fake confidence numbers (e.g., 91%, 94%).
* **Violation of Clinical Safety:** Automated labeling as "No DR" or "Severe NPDR" without a validated, certified clinical deep-learning model poses severe clinical risk.
* **Remediation:** In accordance with medical safety principles, when no certified clinical model is actively loaded and verified, the system must clearly and prominently display:
  > *"AI automated screening is not configured; authorised clinical review by a qualified ophthalmologist is required."*
  Screenings must be routed to clinician queues where an ophthalmologist records a genuine assessment, assigns an urgency level, and can override automated suggestions.

### 3.2 Authentication, Authorization & Shared-Phone Rural Reality
* **Insecure Authentication:** `authController.js` creates mock JWT tokens (`jwt_mock_token_...`) without cryptographic signature or expiry. Passwords are not hashed with `bcrypt` nor checked upon login.
* **Shared Mobile Phone Challenge in Rural Families:** Currently, the system assumes 1 mobile phone = 1 patient. In rural households, multiple family members (e.g., grandparent, parent) share a single mobile handset.
* **Remediation:** 
  1. Each patient will have a unique Patient Account Identifier (`PID-XXXXX`), their own Full Name, and a private personal password.
  2. Support multiple patient accounts registered to the same mobile phone.
  3. Patient login must require Patient Name + Phone Number + Personal Password.
  4. Passwords must be securely hashed using `bcryptjs`.
  5. Server-side JWT authentication middleware with role-based access control (Admin, Doctor, Patient).
  6. Patients can strictly only view their own medical records, preventing intra-family privacy breaches.

### 3.3 Clinical Urgency Workflow (Three Urgency Levels)
* **Missing Standardized 3-Level Triage:** The existing code uses inconsistent labels ("Low Risk", "Moderate / Referable Risk", "High / Advanced Risk").
* **Remediation:** Implement a clear 3-level clinical triage workflow:
  * **Level 1 – Routine:** No urgent finding identified. Annual routine eye check-up recommended.
  * **Level 2 – Follow-up Needed:** Further examination or ophthalmology appointment needed within a clinician-specified window (e.g., 2–4 weeks).
  * **Level 3 – Urgent Review:** Prompt clinical assessment required within 24–48 hours. Clear immediate action instructions and contact channels.

### 3.4 Image Upload, Validation, and Storage
* **Missing Robust Capture & File Controls:** Currently, file upload lacks strict MIME-type validation, size limits (max 10MB), aspect ratio verification, and camera device constraints (`accept="image/*" capture="environment"`).
* **Missing Consent Checkpoint:** No explicit patient consent or privacy notice prior to fundus image transmission.
* **Remediation:** Build a complete camera capture and file upload modal with live webcam capture, file drag-and-drop, image preview, retake button, file size validation, explicit informed consent checkbox, and progress indicator.

### 3.5 Nearby Health Centre & Hospital Directory
* **Static, Incomplete Data:** Currently only has 4 synthetic clinics in Madurai, Chennai, Coimbatore, Trichy.
* **Missing Key Rural Regions:** Does not include rural and semi-urban centres such as **Ambasamudram** and **Tirunelveli**.
* **Remediation:**
  1. Build a verified directory of Primary Health Centres (PHCs), Government Taluk/District Hospitals, and Eye Hospitals covering Tirunelveli, Ambasamudram, Madurai, and surrounding Tamil Nadu districts.
  2. Implement browser geolocation with explicit user permission and accurate distance computation via the Haversine formula.
  3. Provide manual search by village, town, district, or PIN code.
  4. Display verified contact numbers, services, opening hours, directions links, and emergency guidance.
  5. Provide an Admin management interface to add, update, and maintain centre records.

### 3.6 Telemedicine, Messaging & Notifications
* **Simulated WebRTC & Chat:** `WebRTCConsultModal.jsx` previously simulated a video call and printed fake canned replies with `setTimeout`.
* **Remediation:**
  1. Implement genuine WebRTC peer connection logic using standard `RTCPeerConnection` and WebSocket signalling.
  2. If video hardware, permissions, or remote peer are unavailable, display a clean and informative **Unavailable State** instead of a fake connection.
  3. Real two-way doctor-patient messaging backed by persistent server records.
  4. Appointment scheduling workflow with statuses: `Pending`, `Confirmed`, `Rescheduled`, `Completed`, `Cancelled`.
  5. Notification status dashboard showing SMS / Email configuration status, delivery states (`Pending`, `Sent`, `Failed`), patient consent, and retry controls. Do not fake sent messages when credentials are absent.

### 3.7 Complete Bilingual Translation (Tamil & English)
* **Deficiency:** Over 90% of the UI contains hardcoded English strings.
* **Remediation:**
  1. Centralize comprehensive bilingual dictionaries in `src/translations/`.
  2. Cover 100% of the platform: landing page, role login, patient onboarding, image upload, screening wizard, reports, doctor portal, admin controls, appointment booking, and emergency notices.
  3. Persist user language choice in `localStorage`.

---

## 4. Remediation Plan & Phases

* **Phase 1:** Codebase audit & architecture documentation (*Completed*).
* **Phase 2:** Design system overhaul (accessible healthcare theme, clear landing page with the 6 required primary action buttons, complete English/Tamil translation engine).
* **Phase 3:** Robust backend authentication, RBAC, password hashing, and shared-phone patient account architecture.
* **Phase 4:** Retinal image upload pipeline with camera capture, retake, validation, consent, and honest medical safety clinical review routing.
* **Phase 5:** 3-tier clinical urgency triage, doctor assessment workflow, appointment booking, and verified PHC/hospital directory (including Ambasamudram and Tirunelveli).
* **Phase 6:** Real WebRTC tele-consultation with unavailable fallback, doctor-patient messaging, and notification configuration management.
* **Phase 7:** End-to-end automated testing, verification, and operational documentation.
