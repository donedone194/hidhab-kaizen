@echo off
title Fix Git in System32
echo ========================================================
echo   Hidhab Kaizen - Fixing Git Command in Windows
echo ========================================================
echo.
echo Removing corrupted 0-byte 'git' file from System32...
echo You will see a Windows prompt asking for Administrator permission.
echo Click [Yes] to allow the fix.
echo.

powershell -Command "Start-Process cmd -ArgumentList '/c del /f /q C:\Windows\system32\git C:\Windows\system32\git-installer.exe && echo [SUCCESS] The dummy file has been removed! Git is now fully working. && pause' -Verb RunAs"

echo Done. Once you click Yes on the prompt, git will work everywhere.
pause

