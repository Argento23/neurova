# Script de subida interactiva a VPS
Write-Host "--- Cargador de Proyectos Neurova a VPS ---" -ForegroundColor Cyan

$vpsIp = Read-Host "Cual es la IP de tu VPS de Contabo?"
$vpsUser = "root"
$localPath = "c:\Users\Gustavo\Downloads\neurova"

# Crear carpeta neurova en el VPS por si no existe
Write-Host "Preparando carpeta en el servidor..."
ssh "$vpsUser@$vpsIp" "mkdir -p /root/neurova"

Write-Host "`n🚀 Iniciando subida... Vas a tener que poner la contraseña un par de veces.`n"

# Subir Content Factory (motor principal)
Write-Host "📦 Subiendo Content Factory..."
scp -r "$localPath\content-factory" "$vpsUser@${vpsIp}:/root/neurova/"

# Subir Panel y Agency
Write-Host "📦 Subiendo Panel y Agency..."
scp -r "$localPath\panel" "$vpsUser@${vpsIp}:/root/neurova/"
scp -r "$localPath\agency" "$vpsUser@${vpsIp}:/root/neurova/"

# Subir otros proyectos
Write-Host "📦 Subiendo proyectos SaaS..."
scp -r "$localPath\austria-saas" "$vpsUser@${vpsIp}:/root/neurova/"
scp -r "$localPath\cilo-b2b" "$vpsUser@${vpsIp}:/root/neurova/"
scp -r "$localPath\template-saas" "$vpsUser@${vpsIp}:/root/neurova/"
scp -r "$localPath\adsniper-saas" "$vpsUser@${vpsIp}:/root/neurova/"

# Configuraciones
Write-Host "📦 Subiendo configuraciones..."
scp "$localPath\ecosystem.config.js" "$vpsUser@${vpsIp}:/root/neurova/"
scp "$localPath\nginx_config_complete.conf" "$vpsUser@${vpsIp}:/root/neurova/"

# Post-deploy: install deps + restart PM2
Write-Host "`n⚡ Instalando dependencias y reiniciando servicios en el VPS..."
ssh "$vpsUser@$vpsIp" @"
cd /root/neurova/content-factory && npm install --production 2>&1 | tail -3
cd /root/neurova && pm2 stop all 2>/dev/null
pm2 delete all 2>/dev/null
pm2 start ecosystem.config.js
pm2 save
echo '✅ PM2 reiniciado:'
pm2 list
"@

Write-Host "`n✅ ¡Todo subido y reiniciado!" -ForegroundColor Green
Write-Host "   📊 Dashboard: https://generarise.space/" -ForegroundColor Yellow
Write-Host "   🔍 Verificá con: ssh root@$vpsIp 'pm2 logs content-factory --lines 20'" -ForegroundColor DarkGray
