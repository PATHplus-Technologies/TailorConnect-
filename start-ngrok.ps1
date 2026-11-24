# start-ngrok.ps1
# Exposes TailorConnect on ngrok and starts both backend and frontend.

param(
    [ValidateSet("next", "vite")]
    [string]$Frontend = "next",
    [int]$Port = 0
)

$ErrorActionPreference = "Stop"
$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) { $ScriptDir = $PWD.Path }

function Test-PortInUse([int]$TargetPort) {
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $TargetPort)
        $listener.Start()
        $listener.Stop()
        return $false
    } catch {
        return $true
    }
}

Clear-Host
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "      TailorConnect ngrok Launcher       " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Determine frontend port
if ($Port -eq 0) {
    if (Test-PortInUse 3000) {
        Write-Host "Port 3000 is already in use by another application." -ForegroundColor DarkYellow
        Write-Host "Automatically selecting port 3001 for TailorConnect..." -ForegroundColor DarkYellow
        $Port = 3001
    } else {
        $Port = 3000
    }
}

Write-Host "Selected Frontend Port: $Port" -ForegroundColor Cyan

# 1. Start ngrok on the selected port
Write-Host "1. Starting ngrok tunnel on port $Port (via 127.0.0.1)..." -ForegroundColor Yellow
Start-Process ngrok -ArgumentList "http 127.0.0.1:$Port --host-header=127.0.0.1:$Port" -WindowStyle Normal

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
$backendCmd = "cd '$ScriptDir'; .\TCvenv\Scripts\activate; `$env:CORS_EXTRA_ORIGIN='$PublicUrl'; python manage.py runserver 127.0.0.1:8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal

# 5. Start the Frontend dev server in a separate window
$frontendDir = if ($Frontend -eq "vite") { "$ScriptDir\tailorconnect-frontend-vite" } else { "$ScriptDir\tailorconnect-frontend" }
$frontendLabel = if ($Frontend -eq "vite") { "Vite" } else { "Next.js" }
Write-Host "4. Starting $frontendLabel frontend dev server on port $Port..." -ForegroundColor Yellow

$frontendCmd = if ($Frontend -eq "vite") {
    "cd '$frontendDir'; npm run dev -- --port $Port"
} else {
    "cd '$frontendDir'; npm run dev -- -p $Port"
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -WindowStyle Normal

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host " TailorConnect is now live online! " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host " Access your app at: $PublicUrl" -ForegroundColor Green
Write-Host " Keep these windows open while developing." -ForegroundColor Yellow
Write-Host " Press any key to exit this launcher script..." -ForegroundColor Cyan

if ([System.Environment]::UserInteractive -and -not [Console]::IsInputRedirected) {
    try {
        [void][System.Console]::ReadKey($true)
    } catch {}
}
