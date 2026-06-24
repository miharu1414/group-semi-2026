@echo off
cd /d C:\Users\miharu\Documents\GitHub\group-semi-2026
echo.
echo === [1/4] npm install ===
call npm install
echo.
echo === [2/4] git init ===
git init
git config user.email "miharu.job.wu@gmail.com"
git config user.name "Miharu Namiki"
git branch -M main
echo.
echo === [3/4] git add . ^^^& commit ===
git add .
git commit -m "feat: initial commit - 班ゼミカレンダーアプリ"
echo.
echo === [4/4] GitHub private repo 作成 ===
gh repo create group-semi-2026 --private --source=. --remote=origin --push
echo.
echo ============================================
echo  完了しました！
echo  次: npm run dev  で開発サーバー起動
echo ============================================
pause
