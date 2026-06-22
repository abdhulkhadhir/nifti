@echo off
echo ============================================
echo  NiFTi Website - Local Server
echo ============================================
echo.
echo Starting server on port 8080...
echo.
echo Access from this machine:
echo   http://localhost:8080
echo.
echo Access from other devices on your network:
echo   http://10.68.61.212:8080
echo   http://172.28.19.47:8080
echo.
echo Press Ctrl+C to stop the server.
echo ============================================
echo.
cd /d "%~dp0"
python -m http.server 8080 --bind 0.0.0.0
