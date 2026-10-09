# HydroSense Multi-Service Startup Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "💧 Starting HydroSense - Smart Water Management Platform" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start ML Microservice
Write-Host "`n[1/3] Launching Python ML Microservice (Port 8000)..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "app.py" -WorkingDirectory "$PSScriptRoot\ml-service" -WindowStyle Minimized

# 2. Start Backend API
Write-Host "[2/3] Launching Node.js Backend API (Port 5000)..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "src/server.js" -WorkingDirectory "$PSScriptRoot\backend" -WindowStyle Minimized

# 3. Start Frontend React Vite
Write-Host "[3/3] Launching React Vite Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory "$PSScriptRoot\frontend"

Write-Host "`n✅ All services initiated!" -ForegroundColor Green
Write-Host "📡 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📡 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "📡 ML API:   http://127.0.0.1:8000" -ForegroundColor Cyan
