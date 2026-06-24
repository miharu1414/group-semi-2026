# 班ゼミカレンダー セットアップスクリプト
# PowerShellで実行: .\setup.ps1

$ErrorActionPreference = "Stop"
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  班ゼミカレンダー セットアップ" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 1. npm install
Write-Host "[1/5] 依存関係をインストール中..." -ForegroundColor Yellow
Set-Location $ProjectDir
npm install
Write-Host "OK" -ForegroundColor Green

# 2. git init
Write-Host "[2/5] Git を初期化中..." -ForegroundColor Yellow
git init
git add .
git commit -m "feat: initial commit - 班ゼミカレンダーアプリ"
Write-Host "OK" -ForegroundColor Green

# 3. GitHub リポジトリ作成 (gh CLI が必要)
Write-Host "[3/5] GitHub プライベートリポジトリを作成中..." -ForegroundColor Yellow
$HasGH = Get-Command gh -ErrorAction SilentlyContinue
if ($HasGH) {
    gh repo create group-semi-2026 --private --source=. --remote=origin --push
    Write-Host "OK - GitHub リポジトリ作成完了" -ForegroundColor Green
} else {
    Write-Host "SKIP - gh CLI が見つかりません" -ForegroundColor DarkYellow
    Write-Host "  手動手順:" -ForegroundColor Gray
    Write-Host "  1. https://github.com/new でリポジトリ名 'group-semi-2026' をプライベートで作成" -ForegroundColor Gray
    Write-Host "  2. git remote add origin https://github.com/YOUR_USERNAME/group-semi-2026.git" -ForegroundColor Gray
    Write-Host "  3. git push -u origin main" -ForegroundColor Gray
}

# 4. Cloudflare D1 データベース作成
Write-Host "[4/5] Cloudflare D1 データベースを作成中..." -ForegroundColor Yellow
$HasWrangler = Get-Command wrangler -ErrorAction SilentlyContinue
if ($HasWrangler) {
    Write-Host "  wrangler d1 create を実行します..." -ForegroundColor Gray
    $D1Output = npx wrangler d1 create group-semi-2026-db 2>&1 | Out-String
    Write-Host $D1Output
    Write-Host ""
    Write-Host "  ↑ 出力に含まれる 'database_id' の値を wrangler.toml に貼り付けてください" -ForegroundColor Yellow
    Write-Host "  wrangler.toml の REPLACE_WITH_YOUR_DATABASE_ID を置き換えてください" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "  wrangler.toml を更新したら Enter を押してください"

    # マイグレーション実行
    Write-Host "  マイグレーションを実行中 (local)..." -ForegroundColor Gray
    npx wrangler d1 migrations apply DB --local
    Write-Host "OK" -ForegroundColor Green
} else {
    Write-Host "SKIP - wrangler が見つかりません (npm install後は npx wrangler を使用)" -ForegroundColor DarkYellow
    Write-Host "  手動手順:" -ForegroundColor Gray
    Write-Host "  1. npx wrangler login" -ForegroundColor Gray
    Write-Host "  2. npx wrangler d1 create group-semi-2026-db" -ForegroundColor Gray
    Write-Host "  3. wrangler.toml の database_id を更新" -ForegroundColor Gray
    Write-Host "  4. npx wrangler d1 migrations apply DB --local" -ForegroundColor Gray
}

# 5. 完了
Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "  セットアップ完了！" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor Cyan
Write-Host "  開発サーバー起動:  npm run dev" -ForegroundColor White
Write-Host "  ローカルプレビュー: npm run preview" -ForegroundColor White
Write-Host "  Cloudflare デプロイ: npm run deploy" -ForegroundColor White
Write-Host ""
