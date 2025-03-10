@echo off
echo Internet Cafe Guest Agent Installer
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if running as administrator
net session >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo This script requires administrator privileges.
    echo Please run as administrator.
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install

echo.
echo Setting up configuration...
set /p SERVER_URL=Enter server URL (e.g., https://your-heroku-app.herokuapp.com): 
set /p COMPUTER_NUMBER=Enter computer number: 

echo.
echo Writing configuration to config.json...
echo {> config.json
echo   "serverUrl": "%SERVER_URL%",>> config.json
echo   "guestId": "guest-%COMPUTER_NUMBER%",>> config.json
echo   "computerNumber": %COMPUTER_NUMBER%>> config.json
echo }>> config.json

echo.
echo Creating Windows service...
echo This will install the agent as a Windows service that starts automatically.

REM Download NSSM (Non-Sucking Service Manager) if not present
if not exist nssm.exe (
    echo Downloading NSSM...
    powershell -Command "Invoke-WebRequest -Uri 'https://nssm.cc/release/nssm-2.24.zip' -OutFile 'nssm.zip'"
    powershell -Command "Expand-Archive -Path 'nssm.zip' -DestinationPath 'nssm-temp' -Force"
    copy nssm-temp\nssm-2.24\win64\nssm.exe .
    rmdir /s /q nssm-temp
    del nssm.zip
)

REM Install the service
nssm.exe install "InternetCafeAgent" "%~dp0node.exe" "%~dp0agent.js"
nssm.exe set "InternetCafeAgent" DisplayName "Internet Cafe Agent"
nssm.exe set "InternetCafeAgent" Description "Agent for Internet Cafe Management System"
nssm.exe set "InternetCafeAgent" AppDirectory "%~dp0"
nssm.exe set "InternetCafeAgent" Start SERVICE_AUTO_START

REM Start the service
echo Starting the service...
net start InternetCafeAgent

echo.
echo Installation complete!
echo The agent is now running as a Windows service.
echo.
echo Press any key to exit...
pause > nul 