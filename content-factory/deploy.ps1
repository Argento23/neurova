# ===================================================
# DEPLOY CONTENT FACTORY AL VPS CONTABO
# ===================================================
# Uso: .\deploy.ps1
# Sube todo el content-factory al VPS y reinicia el servicio.

Write-Host ""
Write-Host "  ==============================================" -ForegroundColor Cyan
Write-Host "     DEPLOY - Content Factory -> VPS Contabo  " -ForegroundColor Cyan
Write-Host "  ==============================================" -ForegroundColor Cyan
Write-Host ""

$vpsIp = Read-Host "IP del VPS Contabo (217.216.52.136)"
if ([string]::IsNullOrEmpty($vpsIp)) { $vpsIp = "217.216.52.136" }
$vpsUser = "root"
$remotePath = "/root/neurova/content-factory"

# Archivos y carpetas a subir (excluyendo node_modules, output, data/logs)
$items = @(
    "src",
    "assets",
    "data/calendar.json",
    "data/prompt_library.json",
    "package.json",
    "package-lock.json",
    "ecosystem.config.cjs",
    ".env"
)

Write-Host "[*] Preparando deploy..." -ForegroundColor Yellow
Write-Host "   Destino: ${vpsUser}@${vpsIp}:${remotePath}" -ForegroundColor Gray

# Crear directorio remoto si no existe
Write-Host "`n[*] Creando estructura remota..." -ForegroundColor Yellow
ssh "${vpsUser}@${vpsIp}" "mkdir -p ${remotePath}/data/logs ${remotePath}/output/images ${remotePath}/output/videos ${remotePath}/assets/fonts ${remotePath}/assets/music"

# Subir cada item
foreach ($item in $items) {
    $localPath = Join-Path $PSScriptRoot $item
    if (Test-Path $localPath) {
        $isDir = (Get-Item $localPath).PSIsContainer
        if ($isDir) {
            Write-Host "   -> Subiendo $item/..." -ForegroundColor Gray
            scp -r "$localPath" "${vpsUser}@${vpsIp}:${remotePath}/${item}"
        } else {
            $remoteDir = Split-Path "${remotePath}/${item}" -Parent
            ssh "${vpsUser}@${vpsIp}" "mkdir -p ${remoteDir}"
            Write-Host "   -> Subiendo $item..." -ForegroundColor Gray
            scp "$localPath" "${vpsUser}@${vpsIp}:${remotePath}/${item}"
        }
    } else {
        Write-Host "   [!] Skipping $item (no existe localmente)" -ForegroundColor DarkYellow
    }
}

# Instalar dependencias y reiniciar
Write-Host "`n[*] Instalando dependencias y reiniciando..." -ForegroundColor Yellow
ssh "${vpsUser}@${vpsIp}" @"
  cd ${remotePath}
  npm install --production --no-audit --no-fund 2>&1 | tail -3
  
  # Verificar si ffmpeg esta instalado
  which ffmpeg > /dev/null 2>&1 || apt-get install -y ffmpeg > /dev/null 2>&1
  
  # Reiniciar con PM2
  pm2 stop content-factory 2>/dev/null
  pm2 delete content-factory 2>/dev/null
  pm2 start ecosystem.config.cjs
  pm2 save
  
  echo ""
  echo "[OK] Content Factory desplegado!"
  pm2 status content-factory
"@

Write-Host ""
Write-Host "  [OK] ¡Deploy completado!" -ForegroundColor Green
Write-Host ""
Write-Host "  Dashboard: https://generarise.space/factory/" -ForegroundColor Cyan
Write-Host "  Videos:    https://generarise.space/media/videos/" -ForegroundColor Cyan
Write-Host ""
Write-Host "  IMPORTANTE: Configura nginx para hacer reverse proxy" -ForegroundColor Yellow
Write-Host "     del puerto 4000 a la ruta /factory/ (ver abajo)" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Agrega esto al nginx config del dominio generarise.space:" -ForegroundColor Gray
Write-Host ""
Write-Host "    # Content Factory Dashboard + Media" -ForegroundColor DarkGray
Write-Host '    location /factory/ {' -ForegroundColor DarkGray
Write-Host '        proxy_pass http://127.0.0.1:4000/;' -ForegroundColor DarkGray
Write-Host '        proxy_http_version 1.1;' -ForegroundColor DarkGray
Write-Host '        proxy_set_header Upgrade $http_upgrade;' -ForegroundColor DarkGray
Write-Host '        proxy_set_header Connection "upgrade";' -ForegroundColor DarkGray
Write-Host '        proxy_set_header Host $host;' -ForegroundColor DarkGray
Write-Host '        proxy_set_header X-Real-IP $remote_addr;' -ForegroundColor DarkGray
Write-Host '    }' -ForegroundColor DarkGray
Write-Host '' -ForegroundColor DarkGray
Write-Host '    location /media/ {' -ForegroundColor DarkGray
Write-Host '        proxy_pass http://127.0.0.1:4000/media/;' -ForegroundColor DarkGray
Write-Host '        proxy_set_header Host $host;' -ForegroundColor DarkGray
Write-Host '        client_max_body_size 100M;' -ForegroundColor DarkGray
Write-Host '    }' -ForegroundColor DarkGray
Write-Host ""
