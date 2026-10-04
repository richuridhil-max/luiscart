@echo off
title Luiscart Premium E-Commerce Server
echo ===================================================
echo   Starting Luiscart Luxury E-Commerce Store...
echo ===================================================
echo.
echo Opening store in your default browser at http://localhost:3000 ...
start "" "http://localhost:3000"
echo.
echo Server active! Press Ctrl+C anytime to stop.
echo.
"C:\Users\VICTUS\AppData\Roaming\Antigravity\bin\agy-node.cmd" serve.js
if %errorlevel% neq 0 (
  echo.
  echo Notice: If node is not found, you can also directly double-click index.html!
  start "" "index.html"
)
pause
