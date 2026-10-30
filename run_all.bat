@echo off
title Start Chronic Disease Full System
echo ===============================================================
echo   Starting Agentic AI Chronic Disease Full Stack System
echo ===============================================================
echo.
echo [1/2] Starting Backend API (FastAPI)...
start "Backend API (FastAPI)" cmd /c "%~dp0run_backend.bat"

echo [2/2] Starting Frontend UI (Next.js)...
start "Frontend UI (Next.js)" cmd /c "%~dp0run_frontend.bat"

echo.
echo Servers are launching in separate windows:
echo   - Backend Docs: http://127.0.0.1:8000/docs
echo   - Frontend App:  http://localhost:3000
echo.
timeout /t 5 >nul
start http://localhost:3000

