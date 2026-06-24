# Cloudflare デプロイ手順書

> **整合性**: この手順を変更した場合、`docs/SETUP.md` と `wrangler.toml` も確認してください。

---

## 前提

- Cloudflare アカウント作成済み
- `wrangler login` 済み（`docs/SETUP.md 手順4` 参照）
- `wrangler.toml` の `database_id` 設定済み

---

## 初回デプロイ手順

### 1. D1データベースを作成する

```bash
# ローカルで実行
npx wrangler d1 create group-semi-2026-db
```

出力例:
```
✅ Successfully created DB 'group-semi-2026-db'

[[d1_databases]]
binding = "DB"
database_name = "group-semi-2026-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

`wrangler.toml` の `database_id` を上記の値に更新してください。

---

### 2. 本番DBにマイグレーションを適用する

```bash
npm run db:migrate:remote
# → migrations/0001_schema.sql が本番D1に適用される
```

---

### 3. Cloudflare Pages プロジェクトを作成する（初回のみ）

Cloudflare ダッシュボード（https://dash.cloudflare.com）で:

1. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. GitHubリポジトリ `group-semi-2026` を選択
3. ビルド設定:
   - **Framework preset**: `Next.js`（自動検出されない場合は手動選択）
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
4. **Environment variables**: 現時点では不要
5. **Save and Deploy**

> または、CLIでデプロイ:
> ```bash
> npm run deploy
> ```

---

### 4. D1バインディングをPagesプロジェクトに設定する

Cloudflareダッシュボードで:

1. **Workers & Pages** → `group-semi-2026` → **Settings** → **Bindings**
2. **Add binding** → **D1 database**
3. 変数名: `DB`（大文字、`wrangler.toml` の `binding` と一致させること）
4. D1データベース: `group-semi-2026-db` を選択
5. **Save**

> ⚠️ この設定をしないとAPIが動作しません。

---

### 5. 再デプロイして確認

```bash
npm run deploy
```

デプロイ後、`https://group-semi-2026.pages.dev`（またはカスタムドメイン）でアクセスして動作確認。

---

## 2回目以降のデプロイ

```bash
# コードを変更してプッシュ → Cloudflareが自動ビルド＆デプロイ
git push origin main

# または手動デプロイ
npm run deploy
```

---

## DBスキーマを変更した場合

```bash
# 新しいマイグレーションファイルを作成
# ファイル名: migrations/0002_xxxx.sql（連番）

# ローカルに適用
npm run db:migrate

# 本番に適用
npm run db:migrate:remote
```

---

## GitHub Actions 自動デプロイの設定（任意）

`main` ブランチへのプッシュで自動デプロイされるよう設定できます。

### 1. API Token の作成

Cloudflare Dashboard → **My Profile** → **API Tokens** → **Create Token**

- テンプレート「**Edit Cloudflare Workers**」を選択
- 追加で以下の権限を付与:
  - `D1:Edit`（D1データベースへのアクセス）
  - `Cloudflare Pages:Edit`

### 2. GitHub Secrets に登録

リポジトリ → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret名 | 値 | 取得場所 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | 上で作成したトークン | Cloudflare → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | アカウントID | Cloudflare Dashboard 右サイドバー |

### 3. 動作確認

`main` にプッシュするとGitHub Actions（`.github/workflows/deploy.yml`）が起動し、自動でビルド＆デプロイされます。

---

## カスタムドメインの設定

1. Cloudflareダッシュボード → `group-semi-2026` → **Custom domains**
2. ドメインを追加（Cloudflareで管理しているドメインが必要）

---

## トラブルシューティング

| 症状 | 確認箇所 |
|---|---|
| APIが500エラー | D1バインディングが設定されているか確認 |
| `database_id` が `REPLACE_WITH_YOUR_DATABASE_ID` のまま | `wrangler.toml` を更新 |
| ビルドエラー | `npm run pages:build` をローカルで実行してエラーを確認 |
| D1にデータがない | `npm run db:migrate:remote` を実行 |
| Edge Runtime エラー | APIルートに `export const runtime = 'edge'` があるか確認 |
