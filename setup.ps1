# Kanban Board Setup Script
# This script installs dependencies and verifies the setup

Write-Host "🚀 Setting up Kanban Board..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Then restart your terminal and run this script again." -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npm test -- --run
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Some tests failed" -ForegroundColor Yellow
} else {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
}
Write-Host ""

# Success message
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  • Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "  • Run 'npm test' to run tests" -ForegroundColor White
Write-Host "  • Run 'npm run build' to build for production" -ForegroundColor White
Write-Host ""
