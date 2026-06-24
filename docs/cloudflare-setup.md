# Cloudflare 手動セットアップ手順書

このドキュメントはCloudflareダッシュボードで手動で行う作業をまとめた手順書です。
コマンド操作は [SETUP.md](SETUP.md) を参照してください。

---

## 事前準備

### 必要なもの
- Cloudflareアカウント（無料プランでOK）
- GitHubアカウント
- このリポジトリへのアクセス権

---

## 手順 1: Cloudflareアカウント作成

1. [https://cloudflare.com](https://cloudflare.com) にアクセス
2. 「Sign Up」をクリック
3. メールアドレスとパスワードを入力して登録
4. メール認証を完了する

---

## 手順 2: APIトークン作成

CLIツール（wrangler）からCloudflareを操作するためのトークンを作成します。

1. Cloudflareダッシュボードにログイン
2. 右上のアバター → **「My Profile」** をクリック
3. 左メニューの **「API Tokens」** をクリック
4. **「Create Token」** ボタンをクリック
5. **「Edit Cloudflare Workers」** テンプレートを選択
6. 以下の権限を確認・追加:
   - `Cloudflare Pages:Edit`
   - `D1:Edit`
   - `Workers Scripts:Edit`
7. **「Continue to Summary」** → **「Create Token」**
8. 表示されたトークンをコピーして `.env.local` の `CLOUDFLARE_API_TOKEN` に設定

> **注意**: トークンは作成直後しか表示されません。必ずコピーしてください。

---

## 手順 3: アカウントIDの確認

1. Cloudflareダッシュボードのホームページ（Workers & Pages）を開く
2. 右側サイドバーに **「Account ID」** が表示されている
3. コピーして `.env.local` の `CLOUDFLARE_ACCOUNT_ID` に設定

---

## 手順 4: D1 データベース作成（CLIで実行）

ダッシュボードからも作成できますが、CLIが推奨です。

```bash
npx wrangler d1 create group-semi-2026-db
```

出力された `database_id` を `wrangler.toml` に貼り付けてください。

### ダッシュボードで確認する場合

1. Cloudflareダッシュボード → 左メニュー **「Storage & Databases」** → **「D1 SQL Database」**
2. 作成したデータベース **「group-semi-2026-db」** をクリック
3. **「Settings」** タブで `database_id` を確認

---

## 手順 5: Cloudflare Pages プロジェクト作成（GitHubの自動デプロイ設定）

### 5-1. Pages プロジェクト作成

1. Cloudflareダッシュボード → **「Workers & Pages」**
2. **「Create application」** → **「Pages」** タブ → **「Connect to Git」**
3. GitHubアカウントを連携
4. リポジトリ **「group-semi-2026」** を選択
5. **「Begin setup」** をクリック

### 5-2. ビルド設定

| 設定項目 | 値 |
|---------|---|
| Production branch | `main` |
| Framework preset | `Next.js` |
| Build command | `npx @cloudflare/next-on-pages@1` |
| Build output directory | `.vercel/output/static` |

### 5-3. 環境変数設定（Pagesビルド用）

「Environment variables (advanced)」を展開して以下を追加:

| 変数名 | 値 | 環境 |
|-------|---|------|
| `NODE_VERSION` | `18` | Production & Preview |

6. **「Save and Deploy」** をクリック

---

## 手順 6: D1バインディングをPagesプロジェクトに追加

> **重要**: この手順を完了しないとAPIが動作しません。

1. Cloudflareダッシュボード → **「Workers & Pages」** → 作成した `group-semi-2026` プロジェクトをクリック
2. **「Settings」** タブ → **「Bindings」** をクリック
3. **「Add」** → **「D1 database」** を選択
4. 以下を入力:
   - **Variable name**: `DB`（大文字・完全一致）
   - **D1 database**: `group-semi-2026-db` を選択
5. **「Save」** をクリック
6. 設定反映のため、**「Deployments」** タブから最新のデプロイを **「Retry deployment」**

---

## 手順 7: 本番DBマイグレーション実行

ローカルのターミナルで実行:

```bash
npm run db:migrate:remote
```

これで本番のD1にテーブルと初期データが作成されます。

---

## 手順 8: 動作確認

1. PagesプロジェクトのURL（例: `https://group-semi-2026.pages.dev`）にアクセス
2. カレンダーが表示されることを確認
3. ゼミ予定の追加・編集・削除が動作することを確認

---

## Cloudflare リソース一覧

セットアップ完了後、以下のリソースが作成されます:

| リソース | 名前 | 場所 |
|---------|------|------|
| Pages プロジェクト | `group-semi-2026` | Workers & Pages |
| D1 データベース | `group-semi-2026-db` | Storage & Databases → D1 |

---

## よくある問題

### デプロイ後にAPIが500エラーになる
→ 手順6のD1バインディングが設定されているか確認。設定後に再デプロイが必要。

### ビルドが失敗する
→ 手順5-3の `NODE_VERSION=18` が設定されているか確認。

### 本番DBにデータが入らない
→ 手順7の `npm run db:migrate:remote` を実行したか確認。
