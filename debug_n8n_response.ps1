$ErrorActionPreference = "Stop"

Write-Host "=== AdSniper DEBUGGER ===" -ForegroundColor Cyan
Write-Host "Este script analizará EXACTAMENTE qué está devolviendo tu n8n." -ForegroundColor Gray
Write-Host ""

# 1. URL Input
$webhookUrl = Read-Host "Pega tu Webhook URL de n8n (Test o Producción)"
if ([string]::IsNullOrWhiteSpace($webhookUrl)) { Write-Host "URL inválida."; exit }

# 2. Product Input
$productUrl = "https://cilo.com.ar/productos/galletitas-trio/" # Default test URL or ask user
Write-Host "Usando producto de prueba: $productUrl" -ForegroundColor DarkGray

# 3. Request
Write-Host ""
Write-Host "Enviando solicitud..." -ForegroundColor Yellow

try {
    $body = @{ product_url = $productUrl; language = "es" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ Respuesta recibida." -ForegroundColor Green
    Write-Host ""
    
    # 4. Analysis
    Write-Host "--- ANÁLISIS DE DATOS ---" -ForegroundColor White
    
    # Check Root keys
    $keys = $response.PSObject.Properties.Name -join ", "
    Write-Host "Claves en la raíz del JSON: $keys" -ForegroundColor Yellow
    
    # Check Ads Array
    $ads = $null
    if ($response.ads) { $ads = $response.ads }
    elseif ($response.output) { $ads = $response.output }
    elseif ($response -is [array]) { $ads = $response }
    
    if ($ads) {
        Write-Host "✅ Se encontró un array de datos." -ForegroundColor Green
        $firstAd = $ads[0]
        
        # Check first ad keys
        if ($firstAd) {
            $adKeys = $firstAd.PSObject.Properties.Name -join ", "
            Write-Host "Claves del primer anuncio: $adKeys" -ForegroundColor Cyan
            
            # CRITICAL CHECK
            if ($firstAd.generated_image_url) {
                Write-Host "✅ 'generated_image_url' EXISTE." -ForegroundColor Green
                Write-Host "Valor: $($firstAd.generated_image_url)" -ForegroundColor Gray
            }
            else {
                Write-Host "❌ 'generated_image_url' NO EXISTE." -ForegroundColor Red
                Write-Host "⚠️  ESTO ES EL PROBLEMA. Estás usando una versión vieja del workflow o no se guardó." -ForegroundColor Red
            }
        }
    }
    else {
        Write-Host "❌ No se encontró array de anuncios (ads/output)." -ForegroundColor Red
        Write-Host "Respuesta completa:"
        $response | ConvertTo-Json -Depth 3
    }

}
catch {
    Write-Host "❌ Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
pause
