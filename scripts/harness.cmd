@echo off
powershell.exe -NoLogo -NoProfile -ExecutionPolicy RemoteSigned -File "%~dp0harness.ps1" %*
exit /b %errorlevel%
