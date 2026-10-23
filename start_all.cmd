@echo off
echo ========================================================
echo       Starting DrishtiAI Rural Eye Care Platform
echo ========================================================

start "DrishtiAI - Backend Server (Port 5000)" cmd /k "cd /d C:\Users\HP\.gemini\antigravity\scratch\drishtiai\backend && node server.js"

timeout /t 2 /nobreak >nul

start "DrishtiAI - React Frontend (Port 5173)" cmd /k "cd /d C:\Users\HP\.gemini\antigravity\scratch\drishtiai\frontend && npm run dev"

echo.
echo DrishtiAI services launched!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000/health
echo ========================================================
