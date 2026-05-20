$ErrorActionPreference = "Stop"

Write-Host "=== AdSniper AI Test Script (DEBUG MODE) ===" -ForegroundColor Cyan
Write-Host ""

$webhookUrl = Read-Host "1. Pega tu Webhook URL (Test) de n8n"
if ([string]::IsNullOrWhiteSpace($webhookUrl)) { Write-Host "Debes ingresar una URL válida."; exit }

$productUrl = Read-Host "2. Pega la URL del producto Shopify"
if ([string]::IsNullOrWhiteSpace($productUrl)) { Write-Host "Debes ingresar una URL válida."; exit }

Write-Host ""
Write-Host "Disparando AdSniper... (Puede tardar 10-20 segundos)" -ForegroundColor Yellow

try {
    $body = @{ product_url = $productUrl } | ConvertTo-Json
    
    # Enviar solicitud POST
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"
    
    Write-Host ""
    Write-Host "¡RESPUESTA RECIBIDA! 🎯" -ForegroundColor Green
    Write-Host "RAW DATA (JSON):" -ForegroundColor DarkGray
    $response | ConvertTo-Json -Depth 5 
    Write-Host "-----------------------------"
    
    # Intentar acceder a la propiedad de salida de LangChain
    if ($response.text) { 
        $ads = $response.text 
    }
    elseif ($response.output) { 
        $ads = $response.output 
    }
    elseif ($response.response) {
        $ads = $response.response
    }
    else {
        $ads = $response
    }

    # Si es un string (JSON encoded), intentar parsearlo
    if ($ads -is [string]) {
        try {
            # Limpiar markdown code blocks si existen (```json ... ```)
            $ads = $ads -replace "^```json", "" -replace "```$", ""
            $ads = $ads.Trim()
            $ads = $ads | ConvertFrom-Json
        }
        catch {
            Write-Host "No se pudo parsear como JSON. Es texto plano." -ForegroundColor Yellow
        }
    }

    # Si es array de n8n items [{json:...}]
    if ($ads -is [array] -and $ads[0].json) {
        $ads = $ads | ForEach-Object { $_.json }
    }
    
    # Mostrar resultados
    if ($ads -is [array]) {
        $ads | ForEach-Object {
            Write-Host "TIPO: $($_.type)" -ForegroundColor Cyan
            Write-Host "TITULO: $($_.headline)" -ForegroundColor White
            Write-Host "TEXTO: $($_.primary_text)" -ForegroundColor Gray
            Write-Host "PROMPT IMAGEN: $($_.image_prompt)" -ForegroundColor Magenta
            Write-Host "-----------------------------"
        }
    }
    else {
        Write-Host "NO SE DETECTÓ ESTRUCTURA DE ARRAY DE ANUNCIOS." -ForegroundColor Red
        Write-Host "Contenido:"
        $ads | Format-List
    }
    
}
catch {
    Write-Host ""
    Write-Host "ERROR CRÍTICO:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.InnerException) {
        Write-Host "Detalles: $($_.Exception.InnerException.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Presiona Enter para cerrar..."
Read-Host
