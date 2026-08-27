@echo off
setlocal
set "PORTFOLIO_ROOT=%~dp0"
set "PHP_EXE=C:\laragon\bin\php\php-8.3.33-Win32-vs16-x64\php.exe"

netstat -ano | findstr /R /C:":8080 .*LISTENING" >nul
if errorlevel 1 (
  start "Portfolio local server" /min "%PHP_EXE%" -S 127.0.0.1:8080 -t "%PORTFOLIO_ROOT%"
  timeout /t 2 /nobreak >nul
)

start "" "http://127.0.0.1:8080/admin/"
