# 班ゼミカレンダー 2026

輪読ゼミ・全体ゼミ・研究共有の予定・担当者を管理するWebアプリです。

**Tech Stack:** Next.js 14 + TypeScript + Tailwind CSS + Cloudflare Pages + Cloudflare D1

---

## クイックスタート

```bash
# 1. 依存関係インストール
npm install

# 2. 環境変数設定
cp .env.example .env.local   # 値を入力する（または wrangler login でOK）

# 3. Cloudflare ログイン
npx wrangler login

# 4. wrangler.toml に database_id を設定（初回のみ）
#    → docs/SETUP.md 手順4 を参照

# 5. DBマイグレーション（ローカル）
npm run db:migrate

# 6. ローカルプレビュー起動（API込み）
npm run preview   # → http://localhost:8788
```

---

## ドキュメント

| ドキュメント | 内容 |
|------------|------|
| [docs/SETUP.md](docs/SETUP.md) | 詳細セットアップ手順（他PCでの開発開始方法）|
| [docs/cloudflare-setup.md](docs/cloudflare-setup.md) | Cloudflare手動セットアップ手順書 |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | 要件定義 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | システム構成・API設計 |
| [docs/PROGRESS.md](docs/PROGRESS.md) | 進捗管理・タスク一覧 |
| [CLAUDE.md](CLAUDE.md) | AI開発ガイド（Claude Code用）|

---

## 主要コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（UIのみ、APIなし）|
| `npm run preview` | フルローカルプレビュー（API + D1込み）|
| `npm run deploy` | Cloudflare Pagesへデプロイ |
| `npm run db:migrate` | ローカルDBマイグレーション |
| `npm run db:migrate:remote` | 本番DBマイグレーション |

---

## 機能

- 月次カレンダー表示（種別色分け：輪読/全体/研究共有）
- 担当者A・B・Cの表示・管理
- ゼミ予定のCRUD操作
- メンバー管理
- レスポンシブ対応（PC・スマホ）
