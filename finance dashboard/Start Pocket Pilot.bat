@echo off
title Pocket Pilot  AI Finance Dashboard
color 0B
cls

echo.
echo  ============================================
echo     P O C K E T   P I L O T
echo     AI-Powered Finance Dashboard
echo  ============================================
echo.

:: Set working directory to script location
cd /d "%~dp0"

:: Kill anything already on port 5500
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| find ":5500" ^| find "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

:: Check for Node.js (primary)
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Node.js found. Starting server...
    start "" /b node "%~dp0server.js"
    timeout /t 2 /nobreak >nul
    echo  [OK] Server started on http://localhost:5500
    echo.
    echo  Opening Pocket Pilot in your browser...
    start "" "http://localhost:5500"
    goto :Running
)

:: Check for Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Python found. Starting server...
    start "" /b python -m http.server 5500
    timeout /t 2 /nobreak >nul
    echo  [OK] Server started on http://localhost:5500
    start "" "http://localhost:5500"
    goto :Running
)

python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Python3 found. Starting server...
    start "" /b python3 -m http.server 5500
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:5500"
    goto :Running
)

:: Fallback: open directly as file
echo  [INFO] No server runtime found. Opening as local file...
echo  TIP: Install Node.js from https://nodejs.org for best experience.
echo.
start "" "%~dp0index.html"
pause
exit /b

:Running
echo  ============================================
echo   Running at: http://localhost:5500
echo.
echo   Press any key to STOP the server.
echo  ============================================
echo.
pause >nul

:: Cleanup
echo.
echo  Stopping server...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| find ":5500" ^| find "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo  Server stopped. Goodbye!
timeout /t 1 /nobreak >nul
