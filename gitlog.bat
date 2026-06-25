@echo off
cd /d C:\Users\miharu\Documents\GitHub\group-semi-2026
git log --oneline -4
echo.
git status --short
pause
del /f gitlog.bat
