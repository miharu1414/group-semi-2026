# セットアップ手順

他のPCで開発を始める場合や、初回セットアップの手順書です。

---

## 前提条件

- Node.js 18以上
- npm 9以上
- Git
- Cloudflareアカウント（[cloudflare-setup.md](cloudflare-setup.md) 参照）

---

## 1. リポジトリクローン

```bash
git clone https://github.com/<your-org>/group-semi-2026.git
cd group-semi-2026
```

---

## 2. 依存関係インストール

```bash
npm install
```

---

## 3. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成します。

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# Mac/Linux
cp .env.example .env.local
```

`.env.local` を開き、値を入力します：

```env
CLOUDFLARE_API_TOKEN=<Cloudflare APIトークン>
CLOUDFLARE_ACCOUNT_ID=<CloudflareアカウントID>
```

> **ブラウザログインで済ませる場合** (推奨・ローカル開発時):
> ```bash
> npx wrangler login
> ```
> この場合、`.env.local` の設定は不要です。

---

## 4. Cloudflare D1 データベース設定

### 4-a. D1データベースが未作成の場合（初回のみ）

詳細は [cloudflare-setup.md](cloudflare-setup.md) を参照してください。

```bash
npx wrangler d1 create group-semi-2026-db
```

出力例：
```
✅ Successfully created DB 'group-semi-2026-db'

[[d1_databases]]
binding = "DB"
database_name = "group-semi-2026-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

`database_id` の値を `wrangler.toml` に貼り付けます：
```toml
[[d1_databases]]
binding = "DB"
database_name = "group-semi-2026-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # ← ここを更新
```

### 4-b. D1データベースが既に存在する場合（2台目以降のPC）

チームメンバーから `database_id` を共有してもらい、`wrangler.toml` に記入します。
既に `wrangler.toml` にIDが記入されてコミットされていれば、そのまま使用できます。

---

## 5. DBマイグレーション実行

### ローカル開発用（miniflare環境）

```bash
npm run db:migrate
```

`.wrangler/state/v3/d1/` にローカルSQLiteが作成されます。

### 本番リモート（初回デプロイ時のみ）

```bash
npm run db:migrate:remote
```

---

## 6. ローカル開発サーバー起動

### 通常開発（UIの確認のみ）
```bash
npm run dev
# → http://localhost:3000
```
> **注意**: このモードではAPIが動作しません。UIの見た目確認のみ。

### API込みフルプレビュー（推奨）
```bash
npm run preview
# → http://localhost:8788
```
Cloudflare Workers + D1ローカルバインディングが動作します。
初回は少し時間がかかります。

---

## 7. デプロイ

```bash
npm run deploy
```

または GitHub連携による自動デプロイ（[cloudflare-setup.md](cloudflare-setup.md) の手順7参照）。

---

## トラブルシューティング

### `wrangler login` でブラウザが開かない
```bash
npx wrangler login --no-browser
```
表示されるURLを手動でブラウザに貼り付けてください。

### D1マイグレーションエラー
```bash
# ローカルのD1状態をリセット
rm -rf .wrangler/state
npm run db:migrate
```

### `npm run preview` でビルドエラー
```bash
# キャッシュクリア
rm -rf .next .vercel
npm run preview
```
