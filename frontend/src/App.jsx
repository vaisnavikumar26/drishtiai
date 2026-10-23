import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import WebRTCConsultModal from './components/WebRTCConsultModal.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import StartScreening from './pages/StartScreening.jsx';
import DoctorPortal from './pages/DoctorPortal.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ClinicFinder from './pages/ClinicFinder.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import LearnDR from './pages/LearnDR.jsx';

import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { isAuthenticated, isDoctor, isAdmin, isPatient } = useAuth();

  const [activeTab, setActiveTab] = useState('home');
  const [authRolePrompt, setAuthRolePrompt] = useState('patient');
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [screeningResult, setScreeningResult] = useState(null);
  const [isTelemedOpen, setIsTelemedOpen] = useState(false);
  const [selectedCentreForAppointment, setSelectedCentreForAppointment] = useState(null);

  // Helper to open Telemedicine modal
  const handleOpenTelemed = () => {
    setIsTelemedOpen(true);
  };

  // Helper when clicking "Book Visit Here" from ClinicFinder
  const handleSelectCentreForAppointment = (centre) => {
    setSelectedCentreForAppointment(centre);
    setActiveTab('appointments');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Landing Page */}
        {activeTab === 'home' && (
          <Home
            setActiveTab={setActiveTab}
            setAuthRolePrompt={setAuthRolePrompt}
          />
        )}

        {/* 2. Authentication & Patient Registration Page */}
        {activeTab === 'login' && (
          <Login
            setActiveTab={setActiveTab}
            authRolePrompt={authRolePrompt}
          />
        )}

        {/* 3. Patient Dashboard */}
        {activeTab === 'patient-dashboard' && (
          <PatientDashboard
            setActiveTab={setActiveTab}
            setScreeningResult={setScreeningResult}
            onOpenUpload={() => setActiveTab('screening')}
            onOpenAppointments={() => setActiveTab('appointments')}
            onOpenTelemed={handleOpenTelemed}
          />
        )}

        {/* 4. Retinal Screening Submission Wizard */}
        {activeTab === 'screening' && (
          <StartScreening
            setActiveTab={setActiveTab}
            setScreeningResult={setScreeningResult}
          />
        )}

        {/* 5. Doctor Clinical Station */}
        {activeTab === 'doctor' && (
          <DoctorPortal
            onOpenTelemed={handleOpenTelemed}
          />
        )}

        {/* 6. District Health Administration */}
        {activeTab === 'admin' && (
          <AdminDashboard />
        )}

        {/* 7. Nearby Health Centres Finder */}
        {activeTab === 'centres' && (
          <ClinicFinder
            onSelectCentreForAppointment={handleSelectCentreForAppointment}
          />
        )}

        {/* 8. Appointments Management */}
        {activeTab === 'appointments' && (
          <AppointmentsPage
            defaultCentre={selectedCentreForAppointment}
          />
        )}

        {/* 9. Eye Health Education Guide */}
        {activeTab === 'learn' && (
          <LearnDR />
        )}

      </main>

      {/* WebRTC Video Consultation Room Modal */}
      {isTelemedOpen && (
        <WebRTCConsultModal
          isOpen={isTelemedOpen}
          onClose={() => setIsTelemedOpen(false)}
        />
      )}

      {/* Global Accessible Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
