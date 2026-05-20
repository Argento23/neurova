# Subir SOLO el panel actualizado al VPS
Write-Host "--- Subiendo Panel Actualizado a VPS ---" -ForegroundColor Cyan

$vpsIp = Read-Host "IP del VPS Contabo (217.216.52.136)"
if ([string]::IsNullOrEmpty($vpsIp)) { $vpsIp = "217.216.52.136" }

$vpsUser = "root"
$localPanel = "c:\Users\Gustavo\Downloads\neurova\panel\index.html"

Write-Host "`nSubiendo panel/index.html a $vpsUser@${vpsIp}:/root/neurova/panel/" -ForegroundColor Yellow
Write-Host "Te va a pedir la contraseña del VPS..." -ForegroundColor Gray

ssh "$vpsUser@$vpsIp" "mkdir -p /root/neurova/panel"
scp "$localPanel" "${vpsUser}@${vpsIp}:/root/neurova/panel/index.html"

Write-Host "`n✅ ¡Panel subido! Refrescá https://generarise.space/panel/" -ForegroundColor Green
