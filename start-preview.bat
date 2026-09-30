@echo off
title MojiGana Preview
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\nodejs-portable;%PATH%"

powershell -NoProfile -Command "try { $c = New-Object System.Net.Sockets.TcpClient; $c.Connect('127.0.0.1', 5173); $c.Close(); exit 0 } catch { exit 1 }"
if %ERRORLEVEL%==0 (
  start "" "http://127.0.0.1:5173/"
  echo MojiGana is already running. Opened it in your browser.
  timeout /t 4 >nul
  exit /b 0
)

echo Starting MojiGana...
echo Leave this window open while you use the site. Close it to stop the preview.
echo.
npm run dev -- --open --host 127.0.0.1
echo.
echo The preview stopped.
pause
