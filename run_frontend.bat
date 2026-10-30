@echo off
title Chronic Disease Frontend Client
echo ===============================================================
echo   Starting Next.js Frontend Client (Pulsepath)
echo ===============================================================
echo Frontend URL: http://localhost:3000
echo.
cd /d "%~dp0frontend"
call npm run dev
pause

