Set-Location "C:\Users\miharu\Documents\GitHub\group-semi-2026"
Write-Host "=== [1/4] npm install ===" -ForegroundColor Cyan
npm install
Write-Host "=== [2/4] git init ===" -ForegroundColor Cyan
git init
git config user.email "miharu.job.wu@gmail.com"
git config user.name "Miharu Namiki"
git branch -M main 2>$null; $true
Write-Host "=== [3/4] git add & commit ===" -ForegroundColor Cyan
git add .
git commit -m "feat: initial commit - 班ゼミカレンダーアプリ"
Write-Host "=== [4/4] gh repo create ===" -ForegroundColor Cyan
gh repo create group-semi-2026 --private --source=. --remote=origin --push
Write-Host "=== 完了! ===" -ForegroundColor Green
Read-Host "Enterで閉じる"
