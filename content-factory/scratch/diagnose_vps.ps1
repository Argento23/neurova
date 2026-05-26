# Quick VPS diagnostic script
$vpsIp = "217.216.52.136"
$vpsUser = "root"
$remotePath = "/root/neurova/content-factory"

Write-Host "`n=== VPS WHATSAPP DIAGNOSTIC ===" -ForegroundColor Cyan

Write-Host "`n[1] Checking .env on VPS..." -ForegroundColor Yellow
ssh "${vpsUser}@${vpsIp}" "cd ${remotePath} && grep -E '(WHATSAPP_PROVIDER|META_CLOUD_TOKEN|META_PHONE_NUMBER_ID|EVOLUTION_)' .env 2>/dev/null || echo '.env NOT FOUND'"

Write-Host "`n[2] Checking PM2 status..." -ForegroundColor Yellow
ssh "${vpsUser}@${vpsIp}" "pm2 status content-factory 2>/dev/null || echo 'PM2 not running'"

Write-Host "`n[3] Last 20 lines of logs..." -ForegroundColor Yellow
ssh "${vpsUser}@${vpsIp}" "pm2 logs content-factory --nostream --lines 20 2>/dev/null || echo 'No logs'"

Write-Host "`n[4] Testing Meta Cloud API token from VPS..." -ForegroundColor Yellow
ssh "${vpsUser}@${vpsIp}" @"
cd ${remotePath}
TOKEN=`$(grep META_CLOUD_TOKEN .env | cut -d= -f2)
PHONE=`$(grep META_PHONE_NUMBER_ID .env | cut -d= -f2)
VERSION=`$(grep META_API_VERSION .env | cut -d= -f2)
if [ -z "`$TOKEN" ] || [ -z "`$PHONE" ]; then
    echo "ERROR: META_CLOUD_TOKEN or META_PHONE_NUMBER_ID is EMPTY in .env"
else
    echo "Token (first 20 chars): `${TOKEN:0:20}..."
    echo "Phone Number ID: `$PHONE"
    echo "API Version: `$VERSION"
    curl -s "https://graph.facebook.com/`${VERSION:-v22.0}/`$PHONE?access_token=`$TOKEN" | head -c 500
fi
"@

Write-Host "`n`n=== DONE ===" -ForegroundColor Green
