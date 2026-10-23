import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginPatient, registerPatient, loginRole, fetchMe } from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('drishtiai_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('drishtiai_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('drishtiai_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('drishtiai_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('drishtiai_token', token);
    } else {
      localStorage.removeItem('drishtiai_token');
    }
  }, [token]);

  // Login as Patient (Handles Shared Phone + Name/ID + Password)
  const loginPatientUser = async (mobile, patientIdentifier, password) => {
    setLoading(true);
    try {
      const res = await loginPatient(mobile, patientIdentifier, password);
      setCurrentUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  // Register New Patient
  const registerPatientUser = async (data) => {
    setLoading(true);
    try {
      const res = await registerPatient(data);
      setCurrentUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  // Login as Doctor or Admin
  const loginRoleUser = async (email, password, role) => {
    setLoading(true);
    try {
      const res = await loginRole(email, password, role);
      setCurrentUser(res.user);
      setToken(res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('drishtiai_user');
    localStorage.removeItem('drishtiai_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        isAuthenticated: Boolean(token && currentUser),
        role: currentUser?.role || null,
        isDoctor: currentUser?.role === 'doctor',
        isAdmin: currentUser?.role === 'admin',
        isPatient: currentUser?.role === 'patient',
        loginPatientUser,
        registerPatientUser,
        loginRoleUser,
        logout,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
