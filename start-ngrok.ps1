# start-ngrok.ps1
# Exposes TailorConnect on ngrok and starts both backend and frontend.

$ErrorActionPreference = "Stop"

Clear-Host
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "      TailorConnect ngrok Launcher       " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Start ngrok on port 3000 (explicitly using IPv4 127.0.0.1 to avoid [::1] IPv6 errors)
Write-Host "1. Starting ngrok tunnel on port 3000 (via 127.0.0.1)..." -ForegroundColor Yellow
Start-Process ngrok -ArgumentList "http 127.0.0.1:3000 --host-header=127.0.0.1:3000" -WindowStyle Normal

# 2. Wait for ngrok to initialize and query the local API to get the public URL
Write-Host "2. Retrieving public ngrok URL..." -ForegroundColor Yellow
$MaxRetries = 10
$RetryDelay = 1
$PublicUrl = $null

for ($i = 1; $i -le $MaxRetries; $i++) {
    try {
        $tunnels = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels"
        $PublicUrl = $tunnels.tunnels[0].public_url
        if ($PublicUrl) {
            break
        }
    } catch {
        Start-Sleep -Seconds $RetryDelay
    }
}

if (-not $PublicUrl) {
    Write-Host "[ERROR] Could not connect to ngrok local API or fetch public URL." -ForegroundColor Red
    Write-Host "Please ensure:" -ForegroundColor Red
    Write-Host "  a) ngrok is installed and on your PATH" -ForegroundColor Red
    Write-Host "  b) You have added your authtoken using: ngrok config add-authtoken <TOKEN>" -ForegroundColor Red
    Exit 1
}

Write-Host "SUCCESS: Public ngrok URL is: $PublicUrl" -ForegroundColor Green

# 3. Export environment variables for the current session to inherit
$env:CORS_EXTRA_ORIGIN = $PublicUrl

# 4. Start the Django Backend in a separate window
Write-Host "3. Starting Django backend server on http://127.0.0.1:8000..." -ForegroundColor Yellow
$backendCmd = "cd '$PWD'; .\TCvenv\Scripts\activate; `$env:CORS_EXTRA_ORIGIN='$PublicUrl'; python manage.py runserver 127.0.0.1:8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal

# 5. Start the Next.js Frontend in a separate window
Write-Host "4. Starting Next.js frontend dev server..." -ForegroundColor Yellow
$frontendCmd = "cd '$PWD\tailorconnect-frontend'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -WindowStyle Normal

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host " TailorConnect is now live online! " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host " Access your app at: $PublicUrl" -ForegroundColor Green
Write-Host " Keep these windows open while developing." -ForegroundColor Yellow
Write-Host " Press any key to exit this launcher script..." -ForegroundColor Cyan
[void][System.Console]::ReadKey($true)
