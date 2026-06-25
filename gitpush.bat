@echo off
cd /d C:\Users\miharu\Documents\GitHub\group-semi-2026
if exist .git\index.lock del /f .git\index.lock
echo === git status ===
git status --short
echo.
echo === git add ===
git add -A
echo.
echo === git commit ===
git commit -m "feat: mobile calendar bar indicator, system-wide UX polish"
echo.
echo === git push ===
git push origin main
echo.
echo === Done ===
pause
del /f gitpush.bat
