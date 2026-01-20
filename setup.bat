@echo off
REM Kanban Board Setup Script for Windows
REM This script installs dependencies and verifies the setup

echo.
echo 🚀 Setting up Kanban Board...
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo Then restart your terminal and run this script again.
    pause
    exit /b 1
)

node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ Node.js version: %NODE_VERSION%
    echo ✅ npm version: %NPM_VERSION%
    echo.
)

REM Navigate to script directory
cd /d "%~dp0"

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully!
echo.

REM Run tests
echo 🧪 Running tests...
call npm test -- --run
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Some tests failed
) else (
    echo ✅ All tests passed!
)
echo.

REM Success message
echo ✅ Setup complete!
echo.
echo Next steps:
echo   • Run 'npm run dev' to start the development server
echo   • Run 'npm test' to run tests
echo   • Run 'npm run build' to build for production
echo.
pause
