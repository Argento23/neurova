Write-Host "🚀 Iniciando AdSniper SaaS..." -ForegroundColor Green
Write-Host "Asegurate de tener n8n abierto con el workflow activo." -ForegroundColor Yellow

$projectPath = "c:\Users\Gustavo\Downloads\neurova\adsniper-saas"

if (Test-Path $projectPath) {
    Set-Location $projectPath
    
    # Check if node_modules exists
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependencias (esto pasa solo la primera vez)..." -ForegroundColor Cyan
        npm install
    }

    Write-Host "🌍 Abriendo navegador..." -ForegroundColor Cyan
    Start-Process "http://localhost:3000/dashboard"

    Write-Host "⚡ Iniciando servidor Next.js..." -ForegroundColor Green
    npm run dev
}
else {
    Write-Host "❌ Error: No encuentro la carpeta del proyecto en $projectPath" -ForegroundColor Red
    Pause
}
