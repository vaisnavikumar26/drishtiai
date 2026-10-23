# DrishtiAI – Comprehensive Project Audit Report
**Project**: Diabetic Retinopathy Screening and Rural Eye Care Website  
**Date**: October 21, 2026  
**Auditor**: Lead Full-Stack Architect, AI/ML & Cybersecurity Specialist  
**Status**: Phase 1 Complete (Baseline Audit & Backup Secured)  
**Backup Location**: `C:\Users\HP\.gemini\antigravity\scratch\drishtiai_backup_initial`

---

## 1. Existing Technology Stack

| Layer | Technologies Currently Detected | Status & Health |
|---|---|---|
| **Frontend UI** | React 18.3, Vite 5.4, Tailwind CSS 3.4, Lucide Icons | Production build succeeds (`vite build` exit code 0). Clean dark-mode healthcare UI. |
| **Offline Storage** | Dexie.js 4.0 (IndexedDB wrapper) | Working offline schema for ASHA camp workers (`offlineScreenings` queue). |
| **Backend Gateway** | Node.js v20.18.0, Express 4.19, `ws` 8.16, `cors`, `multer` | Server initializes cleanly on port 5000. Basic HTTP endpoints and WebSocket signaling mounted. |
| **Data Persistence** | `data_store.json` (Custom JSON file-backed ResilientStore) | In-memory with JSON file dump (`config/db.js`). Functional for simple demo, but lacks ACID transactions, relational integrity, migrations, and indexing. |
| **AI Microservice** | Python 3.11.9, FastAPI 0.141, Uvicorn 0.52, OpenCV 5.0, NumPy 2.4, SciPy 1.17, Pillow 12.3 | Dependencies installed and operational. CLAHE contrast enhancement, green channel metrics, and synthetic retina generator functional. |
| **Authentication** | Mock OTP + Mock JWT (`jwt_mock_token_`) | Insecure prototype. Role can be spoofed by client; no password hashing or JWT signature verification. |
| **Audio / Speech** | Web Speech API (`SpeechSynthesis`, `webkitSpeechRecognition`) | Native browser API for Tamil (`ta-IN`) and English (`en-IN`). |
| **Video Telemedicine** | Custom WebRTC signaling over WebSocket | Scaffolding present in `server.js` (`/ws/telemed`); frontend modal currently runs simulated chat. |

---

## 2. Current Project Structure

```text
C:\Users\HP\.gemini\antigravity\scratch\drishtiai\
├── README.md                          # Hackathon prototype documentation
├── start_all.cmd                      # 1-Click launcher for all 3 services
├── ai-service/
│   ├── requirements.txt               # Python package dependencies
│   └── app/
│       ├── main.py                    # FastAPI app endpoints (/ai/quality-check, /ai/preprocess, /ai/full-screening)
│       ├── model.py                   # 5-class severity prediction (currently heuristic/randomized)
│       ├── quality.py                 # 0-100 weighted image quality score
│       ├── preprocessing.py           # Green-channel CLAHE contrast normalization
│       ├── lesion_detector.py         # Retinal lesion counter (microaneurysms, hemorrhages, exudates)
│       ├── gradcam.py                 # Grad-CAM heatmap & alpha overlay generator
│       ├── crosscheck.py              # Prediction vs. evidence consistency evaluation
│       └── schemas.py                 # Pydantic data models
├── backend/
│   ├── .env                           # Environment settings (PORT, AI_SERVICE_URL, JWT_SECRET)
│   ├── package.json                   # Node dependencies (bcryptjs, express, jsonwebtoken, multer, ws)
│   ├── server.js                      # Express HTTP + WebSocket server entry
│   ├── data_store.json                # JSON persistent file
│   ├── config/
│   │   └── db.js                      # ResilientStore class
│   ├── controllers/
│   │   ├── authController.js          # Patient OTP and role login (prototype)
│   │   ├── screeningController.js     # Screening CRUD operations
│   │   ├── syncController.js          # Offline Dexie sync handler
│   │   ├── ivrController.js           # Automated voice call / SMS trigger (simulated)
│   │   └── simController.js           # MATLAB/Simulink screening capacity forecast
│   └── routes/
│       └── api.js                     # Express REST routes
└── frontend/
    ├── package.json                   # React, Vite, Tailwind, Dexie, Lucide
    ├── index.html                     # HTML root entry
    ├── vite.config.js                 # Vite bundler configuration
    ├── tailwind.config.js             # Styling tokens and color palette
    ├── src/
    │   ├── main.jsx                   # React DOM root
    │   ├── App.jsx                    # Navigation and tab switcher
    │   ├── context/
    │   │   ├── AuthContext.jsx        # User state and mock authentication methods
    │   │   ├── LanguageContext.jsx    # Bilingual context (English / Tamil dictionary)
    │   │   └── OfflineContext.jsx     # Dexie sync state manager
    │   ├── components/                # Modular UI widgets (Navbar, Footer, VoiceAssistant, etc.)
    │   ├── pages/                     # Application screens (Home, Screening, DoctorPortal, etc.)
    │   ├── services/                  # API client, DB, and Web Speech bridge
    │   └── data/                      # Demo fundus cases, clinic listings, wellness herbs
```

---

## 3. Features Already Working

1. **Frontend Production Build**: Vite compiles all JSX/CSS assets cleanly into `dist/` without errors.
2. **AI Microservice Core Pipeline**:
   - Automated fundus image quality assessment (0–100 scale analyzing blur, exposure, contrast, and optic disc clarity).
   - Green-channel CLAHE contrast enhancement for vascular tree visualization.
   - Morphological lesion detection for microaneurysms, hemorrhages, and hard exudates.
   - Synthetic retinal fundus generator for offline demo screenings.
3. **Offline-First Camp Architecture**: Dexie.js successfully maintains local screening records in the browser's IndexedDB when offline.
4. **Interactive Image Visualizers**:
   - Interactive Before/After CLAHE slider component.
   - Grad-CAM 3-way toggle (Original Fundus, Heatmap, Alpha Overlay).
5. **Speech Synthesis**: Browser-based speech synthesis in Tamil (`ta-IN`) and English (`en-IN`).
6. **Capacity Simulation**: Discrete mathematical simulation forecasting patient throughput at screening camps.

---

## 4. Features Partially Implemented

1. **Bilingual Support (Tamil / English)**:
   - `LanguageContext.jsx` contains basic navigation keys (~35 terms), but the vast majority of form labels, doctor profiles, clinical reports, disease stages, educational pages, error messages, and dialogs are hardcoded in English.
   - Initial language selection gate is missing (defaults directly to English).
2. **AI Severity Classification**:
   - `model.py` derives stage from basic green channel variance and assigns confidence using a randomized jitter (`base_conf - random.uniform(0.0, 0.04)`).
   - Does not yet connect to an actual PyTorch/ONNX deep learning weights file or present an honest, clinically transparent "Model Weights Not Configured" state when offline.
3. **Authentication & Authorization**:
   - `authController.js` generates a mock string `jwt_mock_token_` without verifying credentials or checking role permissions.
   - Any client can request Doctor or Admin privileges simply by sending `{ role: 'doctor' }`.
4. **Healthcare Facilities & Geolocation**:
   - `clinicsData.js` contains a hardcoded static list of 5 hospitals.
   - Browser geolocation (`navigator.geolocation`) is not integrated with an interactive map (OpenStreetMap/Leaflet) or dynamic distance calculations.
5. **Tele-Ophthalmology WebRTC**:
   - Signaling WebSocket exists in `server.js`, but frontend `WebRTCConsultModal.jsx` displays a simulated conversation with canned responses rather than real peer-to-peer audio/video streaming via `getUserMedia`.
6. **Telephony & Reminders (IVR / SMS)**:
   - `ivrController.js` returns a hardcoded `DISPATCHED_TO_GATEWAY` mock response rather than verifying Twilio / SMS credentials or reporting configuration state.

---

## 5. Features Missing

1. **Language Selection Splash / Modal**: Compulsory bilingual gate on first visit to choose English or தமிழ்.
2. **Relational Database & Migrations**: ACID-compliant transactional persistence (SQLite / PostgreSQL) with models for Users, Patients, Doctors, Facilities, Screenings, Images, Appointments, Consents, AuditLogs, and Prescriptions.
3. **Secure Password Hashing & JWT Verification**: `bcryptjs` password hashing, real signed JWT tokens with expiration, and server-side RBAC middleware protecting patient records.
4. **Comprehensive Patient Screening Registration Form**: Full demographics (door/house no, street, locality, city, district, state, PIN), diabetes duration, and explicit timestamped consent checkboxes.
5. **Secure Fundus Image Upload**: MIME type checking, magic-byte inspection, file size capping, randomized storage filenames, and private non-public storage with token authorization.
6. **Transparent AI Pipeline**: Real inference pipeline when model weights are provided, or clear, honest "Model Weights Awaiting Configuration" diagnostic status without fabricated scores.
7. **Appointment Booking & Double-Booking Protection**: Transactional appointment scheduling with doctor availability slots and cancellation workflows.
8. **Interactive OpenStreetMap (Leaflet)**: Real interactive map with geolocation pin, radius search, and directions.
9. **Compliant Medicine Order Request Workflow**: Indian Drugs & Cosmetics Act compliant prescription upload and verification workflow.
10. **Comprehensive Automated Tests**: Vitest frontend unit tests, API tests, and translation key verification.
11. **Complete Standard Documentation**: Suite of markdown documentation files as specified in Section 25.

---

## 6. Bugs & Security Vulnerabilities Identified

1. **Authentication Bypass & Privilege Escalation (CRITICAL)**:
   - `POST /api/auth/login` accepts any arbitrary `role` parameter and generates a login token without requiring a password.
2. **Missing Route Authorization (CRITICAL)**:
   - `/api/screenings`, `/api/screenings/:id`, and `/api/screenings/:id/review` have no JWT authentication middleware. Any anonymous user can view or alter patient medical records.
3. **Public Exposure of Medical Images (HIGH)**:
   - `server.js` serves `app.use('/uploads', express.static(...))`, making uploaded retinal scans accessible via public URLs without authentication.
4. **Fabricated Confidence & Delivery Statuses (ETHICAL / REGULATORY)**:
   - `model.py` invents confidence using `random.uniform()`.
   - `ivrController.js` returns "DISPATCHED" without verifying external telephony credentials.
5. **Race Conditions in Storage (MEDIUM)**:
   - `data_store.json` relies on synchronous file overwrites on every write request, which will corrupt data under concurrent load.

---

## 7. Required Dependencies & External Services

| Service / Library | Purpose | Status |
|---|---|---|
| `better-sqlite3` or `sqlite3` | ACID transactional local database with migrations | To be configured in Backend |
| `leaflet`, `react-leaflet` | Interactive OpenStreetMap integration | To be added in Frontend |
| `vitest`, `@testing-library/react` | Automated test suite for components & translations | To be configured |
| `Twilio / SMTP` | Real SMS, WhatsApp, and Email alerts | Configured with environment variable guards & honest status indicators |
| `PyTorch / Torchvision` | Retinal fundus classification neural network | Configured with model weight detection and honest fallback |

---

## 8. Prioritized Implementation Plan (Phases 1 - 16)

- **Phase 1**: Inspection, Audit, and Backup Checkpoint. *(Completed)*
- **Phase 2**: Fix Build Warnings & Preserve Working Features.
- **Phase 3**: Establish Complete Tamil & English Internationalization with Language Gate.
- **Phase 4**: Implement Transactional Database Schema & Migrations (SQLite/PostgreSQL).
- **Phase 5**: Secure Authentication, Password Hashing (bcrypt), and Server-Side RBAC.
- **Phase 6**: Patient Demographics, Diabetes History, and Consent Registration Form.
- **Phase 7**: Secure Private Fundus Image Upload & MIME Validation.
- **Phase 8**: Transparent AI Screening Architecture (Weights Detection + Honest Unavailable State).
- **Phase 9**: Risk-Based Referral & Clinician Sign-Off Workflow.
- **Phase 10**: Geolocation & Interactive OpenStreetMap (Leaflet) Healthcare Facility Finder.
- **Phase 11**: Doctor Directory & Transactional Appointment Scheduling.
- **Phase 12**: Real Telephony (Twilio / SMTP) Provider Gateway with Status Reporting.
- **Phase 13**: WebRTC Audio/Video Consultation with Media Permissions & Voice-Note Fallback.
- **Phase 14**: Bilingual AI Voice Assistant (Tamil & English Educational Guidance).
- **Phase 15**: Compliant Prescription Medicine Order Request Workflow.
- **Phase 16**: Security Hardening, Automated Testing Suite, and Comprehensive Documentation.
