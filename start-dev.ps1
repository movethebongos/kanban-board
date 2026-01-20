# Start Development Server Script
# This script starts the Vite development server

Write-Host "🚀 Starting Kanban Board development server..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    node --version | Out-Null
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 node_modules not found. Installing dependencies first..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Start dev server
Write-Host "🌐 Starting development server..." -ForegroundColor Green
Write-Host "The app will open at http://localhost:5173" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
