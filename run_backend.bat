@echo off
title Chronic Disease Agentic AI Backend Server
echo ===============================================================
echo   Starting Chronic Disease Early Prediction & Decision Support
echo ===============================================================
echo Backend API URL: http://127.0.0.1:8000
echo Swagger Docs:    http://127.0.0.1:8000/docs
echo.
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
