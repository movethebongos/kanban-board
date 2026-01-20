@echo off
REM Start Development Server Script for Windows
REM This script starts the Vite development server

echo.
echo 🚀 Starting Kanban Board development server...
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to script directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 node_modules not found. Installing dependencies first...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Start dev server
echo 🌐 Starting development server...
echo The app will open at http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
