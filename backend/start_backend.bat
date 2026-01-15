@echo off
REM CulinaryLens Backend Startup Script

echo ===============================================
echo    CulinaryLens ML Perception Backend
echo ===============================================
echo.

cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.10+
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
if not exist "venv\Lib\site-packages\fastapi" (
    echo Installing dependencies...
    pip install -r requirements.txt
)

REM Check environment file
if not exist ".env" (
    echo WARNING: .env file not found, using defaults
)

REM Start server
echo.
echo Starting server at http://localhost:8000
echo Press Ctrl+C to stop
echo.
python main.py

pause
