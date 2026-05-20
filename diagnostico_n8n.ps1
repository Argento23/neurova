$webhookUrl = Read-Host "Pega aquí tu URL de Producción de n8n (ej: https://n8n.tu-dominio.com/webhook/whatsapp-alex-chat)"

$body = @{
    data = @{
        key     = @{
            remoteJid = "5491112223334@s.whatsapp.net"
        }
        message = @{
            conversation = "Hola Alex, prueba desde script"
        }
    }
} | ConvertTo-Json

Write-Host "`nEnviando prueba a: $webhookUrl..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ ÉXITO! n8n ha recibido el mensaje." -ForegroundColor Green
    Write-Host "Respuesta de n8n: $($response | ConvertTo-Json)"
}
catch {
    Write-Host "❌ ERROR: No se pudo contactar con n8n." -ForegroundColor Red
    Write-Host "Detalle: $($_.Exception.Message)"
    if ($_.ErrorDetails) { Write-Host "Detalle del servidor: $($_.ErrorDetails)" }
}

Read-Host "`nPresiona Enter para cerrar"
