# Instalar FFmpeg en Windows usando Winget
Write-Host "Instalando FFmpeg usando Winget..." -ForegroundColor Cyan

winget install -e --id Gyan.FFmpeg

Write-Host "FFmpeg instalado." -ForegroundColor Green
Write-Host "NOTA IMPORTANTE: Es posible que necesites CERRAR y VOLVER A ABRIR la consola para que reconozca el comando 'ffmpeg'." -ForegroundColor Yellow
