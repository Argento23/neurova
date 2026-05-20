$ErrorActionPreference = "Stop"

Write-Host "=== AdSniper AI V2 (Ready to Use) ===" -ForegroundColor Cyan
Write-Host "Asegúrate de haber importado 'shopify_adsniper_v2.json' en n8n." -ForegroundColor Gray
Write-Host ""

$webhookUrl = Read-Host "1. Pega tu Webhook URL (Test o Production) de n8n"
if ([string]::IsNullOrWhiteSpace($webhookUrl)) { $webhookUrl = "http://localhost:5678/webhook-test/shopify-adsniper" } 
# Default to localhost test if empty

$productUrl = Read-Host "2. Pega la URL del producto Shopify"
if ([string]::IsNullOrWhiteSpace($productUrl)) { Write-Host "Debes ingresar una URL válida."; exit }

Write-Host ""
Write-Host "Generando anuncios ganadores..." -ForegroundColor Yellow

try {
    $body = @{ product_url = $productUrl } | ConvertTo-Json
    
    # Enviar solicitud POST
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"
    
    Write-Host ""
    Write-Host "¡ADS GENERADOS! 💰" -ForegroundColor Green
    Write-Host "-----------------------------"
    
    # Acceso directo a la propiedad estandarizada 'ads' del V2
    if ($response.ads) {
        $ads = $response.ads
        
        # Manejo de strings JSON si n8n no lo parseó antes
        if ($ads -is [string]) {
            try { $ads = $ads | ConvertFrom-Json } catch {}
        }

        $ads | ForEach-Object {
            Write-Host "TIPO: $($_.type)" -ForegroundColor Cyan
            Write-Host "TITULO: $($_.headline)" -ForegroundColor White
            Write-Host "TEXTO:" -ForegroundColor Gray
            Write-Host $_.primary_text
            Write-Host "IMAGEN PROMPT:" -ForegroundColor Magenta
            Write-Host $_.image_prompt
            Write-Host "-----------------------------"
        }
    }
    else {
        Write-Host "No se encontró la propiedad 'ads' en la respuesta. ¿Estás usando el workflow V2?" -ForegroundColor Red
        Write-Host "Raw Response:"
        $response | Format-List
    }
    
}
catch {
    Write-Host ""
    Write-Host "ERROR DE CONEXIÓN:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "Respuesta del Servidor:" -ForegroundColor Yellow
        Write-Host $body -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Presiona Enter para cerrar..."
Read-Host
