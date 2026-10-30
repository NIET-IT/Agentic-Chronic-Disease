@echo off
title Chronic Disease Agentic AI Backend Server
echo ===============================================================
echo   Starting Chronic Disease Early Prediction & Decision Support
echo ===============================================================
echo Backend API URL: http://127.0.0.1:8000
echo Swagger Docs:    http://127.0.0.1:8000/docs
echo.

IF EXIST ".\backend\venv\Scripts\python.exe" (
    SET "PY_CMD=.\backend\venv\Scripts\python.exe"
) ELSE IF EXIST ".\.venv\Scripts\python.exe" (
    SET "PY_CMD=.\.venv\Scripts\python.exe"
) ELSE (
    SET "PY_CMD=python"
)

%PY_CMD% -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
