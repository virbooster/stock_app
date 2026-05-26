Write-Host "--- Iniciando StockApp ---" -ForegroundColor Cyan

Write-Host "1. Instalando dependencias..."
npm install
if ($LASTEXITCODE -ne 0) { Write-Error "Error: npm install falló"; exit }

Write-Host "2. Levantando servidor de desarrollo..."
npm run dev
