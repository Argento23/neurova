Write-Host "🔧 Iniciando Reparación de AdSíntesis Local..." -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ajustando Política de Ejecución de Scripts..." -ForegroundColor Yellow
# Desbloquea la ejecución de scripts para que npm y el launcher funcionen
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

$projectPath = "c:\Users\Gustavo\Downloads\neurova\adsniper-saas"

if (Test-Path $projectPath) {
    Set-Location $projectPath
    
    Write-Host "2. Verificando dependencias..." -ForegroundColor Yellow
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando node_modules por primera vez..." -ForegroundColor Cyan
        npm install
    }
    else {
        Write-Host "✅ node_modules encontrados." -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "3. Iniciando Servidor Local!" -ForegroundColor Green
    Write-Host "Presiona CTRL+C para detener el servidor cuando termines." -ForegroundColor Gray
    Write-Host ""
    Write-Host "🌍 Abriendo en: http://localhost:3000/dashboard" -ForegroundColor Cyan
    Start-Process "http://localhost:3000/dashboard"

    npm run dev
}
else {
    Write-Host "❌ Error: No se encontró la carpeta en $projectPath" -ForegroundColor Red
    Pause
}
