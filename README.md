# 班ゼミカレンダー 2026

班ゼミ（輪読ゼミ・全体ゼミ・研究共有）の予定・担当者を管理するWebアプリです。

**Tech Stack:** Next.js 14 + TypeScript + Tailwind CSS + Cloudflare Pages + Cloudflare D1

---

## セットアップ

### 1. 依存関係インストール
```bash
npm install
```

### 2. Cloudflare にログイン
```bash
npx wrangler login
```

### 3. D1 データベース作成
```bash
npx wrangler d1 create group-semi-2026-db
```

出力に含まれる `database_id` を `wrangler.toml` の `REPLACE_WITH_YOUR_DATABASE_ID` に貼り付けます。

### 4. マイグレーション実行

ローカル（開発用）:
```bash
npm run db:migrate
```

リモート（本番）:
```bash
npm run db:migrate:remote
```

### 5. 開発サーバー起動
```bash
npm run dev
# → http://localhost:3000
```

Cloudflare Workers/D1 バインディングを使ったローカルプレビュー:
```bash
npm run preview
# → http://localhost:8788
```

---

## Cloudflare Pages デプロイ

```bash
npm run deploy
```

または Cloudflare Dashboard の **Pages** から GitHub リポジトリを連携:
- Framework preset: `Next.js`
- Build command: `npx @cloudflare/next-on-pages@1`
- Build output directory: `.vercel/output/static`
- 環境変数: `NODE_VERSION=18`

D1 バインディングを Pages プロジェクトの設定から追加してください:
- Variable name: `DB`
- D1 database: `group-semi-2026-db`

---

## 機能一覧

| 機能 | 説明 |
|------|------|
| 月次カレンダー表示 | 大きく見やすいグリッドカレンダー |
| ゼミ種別色分け | 輪読ゼミ（インディゴ）/ 全体ゼミ（バイオレット）/ 研究共有（ティール） |
| 担当者表示 | A・B・C ロール別担当者名を各日付に表示 |
| CRUD 操作 | 予定の追加・編集・削除、メンバー管理 |
| レスポンシブ | PC・タブレット・スマートフォン対応 |

---

## 開発メモ

### ブランチ運用
- `main`: 本番環境
- `develop`: 開発ブランチ
- `feature/*`: 機能追加

### ディレクトリ構成
```
group-semi-2026/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── seminars/       # ゼミ予定 CRUD API
│   │   └── members/        # メンバー CRUD API
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── CalendarApp.tsx     # メインコンテナ（状態管理）
│   ├── Calendar/
│   │   ├── CalendarView.tsx
│   │   └── SeminarCard.tsx
│   └── Modals/
│       ├── SeminarModal.tsx
│       └── MembersModal.tsx
├── lib/
│   ├── types.ts            # 型定義
│   └── api.ts              # クライアント側 fetch ヘルパー
├── migrations/
│   └── 0001_schema.sql     # D1 スキーマ
├── wrangler.toml           # Cloudflare 設定
└── setup.ps1               # セットアップスクリプト
```
