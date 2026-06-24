# 開発環境セットアップ手順

> **整合性**: 手順を変更した場合、`docs/cloudflare-setup.md` と `CLAUDE.md#よく使うコマンド` も確認してください。

## 前提条件

- Node.js 20 以上
- npm 10 以上
- Cloudflare アカウント（無料プランで可）
- `wrangler` CLI（手順内でインストール）

---

## 手順 1 — リポジトリのクローン

```bash
git clone https://github.com/miharu1414/group-semi-2026.git
cd group-semi-2026
```

---

## 手順 2 — 依存パッケージのインストール

```bash
npm install
```

---

## 手順 3 — 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` の中身（現時点では空で可。D1はwrangler経由でバインドされるため）:

```
# Cloudflare D1のバインディングはwrangler.tomlで設定するため、
# ローカル開発時は .env.local は不要です。
```

---

## 手順 4 — Cloudflare D1 データベースの作成

> Cloudflareアカウントへのログインが必要です。

```bash
# wranglerにログイン
npx wrangler login

# D1データベースを作成（初回のみ）
npm run db:create
# → 出力された database_id をコピーする
```

`wrangler.toml` の `database_id` を更新:

```toml
[[d1_databases]]
binding = "DB"
database_name = "group-semi-2026-db"
database_id = "ここに貼り付ける"  # ← 上で取得したID
migrations_dir = "migrations"
```

---

## 手順 5 — DBマイグレーション（ローカル）

```bash
npm run db:migrate
# → migrations/0001_schema.sql が実行され、テーブルとサンプルデータが作成される
```

---

## 手順 6 — 開発サーバー起動

### 通常の Next.js 開発サーバー（高速、D1なし）

```bash
npm run dev
# → http://localhost:3000
```

> D1なしで起動するためAPIは動作しません。UIの確認のみ可能。

### Cloudflare Workers互換プレビュー（D1バインディングあり）

```bash
npm run preview
# → http://localhost:8788
```

> APIとD1が動作します。本番に最も近い環境です。

---

## 手順 7 — 本番デプロイ

→ `docs/cloudflare-setup.md` を参照

---

## よく使うコマンド

```bash
npm run dev            # 通常開発サーバー（localhost:3000）
npm run preview        # Cloudflare互換ローカルプレビュー（localhost:8788）
npm run deploy         # Cloudflare Pagesへデプロイ
npm run db:migrate     # ローカルDBにマイグレーション適用
npm run db:migrate:remote  # 本番DBにマイグレーション適用
npm run lint           # ESLintチェック
npx tsc --noEmit       # 型チェック
```
