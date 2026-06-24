# CLAUDE.md — AI開発ガイド

このファイルはClaude Code（AIコーディングアシスタント）が本プロジェクトで作業する際に参照する指示書です。

---

## プロジェクト概要

**班ゼミカレンダー 2026** — 輪読ゼミ・全体ゼミ・研究共有の予定と担当者を管理するWebアプリ。

- 研究室メンバーが利用する内部ツール
- 認証なし（同研究室内の信頼環境を前提）
- モバイル・PC両対応

---

## Tech Stack

| 層 | 技術 |
|---|---|
| フロントエンド | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| バックエンド | Next.js API Routes (Edge Runtime) |
| DB | Cloudflare D1 (SQLite互換) |
| ホスティング | Cloudflare Pages |
| ORM | なし（D1 prepared statements直接使用）|

---

## ディレクトリ構成

```
group-semi-2026/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── seminars/       # ゼミ予定 CRUD API
│   │   │   ├── route.ts    # GET /api/seminars, POST /api/seminars
│   │   │   └── [id]/
│   │   │       └── route.ts # GET/PUT/DELETE /api/seminars/:id
│   │   └── members/        # メンバー CRUD API
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── CalendarApp.tsx     # メインコンテナ（状態管理・データfetch）
│   ├── Calendar/
│   │   ├── CalendarView.tsx  # カレンダーグリッド
│   │   └── SeminarCard.tsx   # 各日程カード
│   └── Modals/
│       ├── SeminarModal.tsx  # ゼミ追加・編集モーダル
│       └── MembersModal.tsx  # メンバー管理モーダル
├── lib/
│   ├── types.ts            # 型定義・定数
│   └── api.ts              # クライアント側 fetch ヘルパー
├── migrations/
│   └── 0001_schema.sql     # D1 スキーマ（初期データ含む）
├── docs/                   # ドキュメント（要件・構成・進捗・手順）
├── CLAUDE.md               # このファイル
├── .env.example            # 環境変数テンプレート
└── wrangler.toml           # Cloudflare設定
```

---

## 重要な制約事項（必ず守ること）

### Cloudflare Edge Runtime制約
- すべてのAPI routeは `export const runtime = 'edge'` が必要
- Node.js固有のAPIは使用不可（`fs`, `path`, `crypto`モジュール等）
- `crypto.randomUUID()` はWeb標準APIなのでOK
- `Date`は使用可能

### D1データベースアクセス
- APIルート内でのみDBアクセス可能
- `getRequestContext()` から `env.DB` を取得する
- クライアントコンポーネントからDBに直接アクセスしない

```typescript
// 正しいパターン
import { getRequestContext } from '@cloudflare/next-on-pages';
export const runtime = 'edge';

export async function GET() {
  const { env } = getRequestContext() as { env: CloudflareEnv };
  const result = await env.DB.prepare('SELECT * FROM seminars').all();
  // ...
}
```

### Cloudflare Pages制約
- サーバーサイドのコードはEdge Runtimeで動作
- `next/headers` の `cookies()` や `headers()` は使用可能だがEdge対応版のみ
- `next/image` の `unoptimized` prop が必要な場合あり

---

## コーディング規約

- **言語**: TypeScript（型は必ず定義、`any`は原則禁止）
- **スタイル**: Tailwind CSS（カスタムCSSは最小限）
- **コンポーネント**: 関数コンポーネント + React Hooks
- **状態管理**: React組み込み（useState, useEffect）— Zustand等は導入しない
- **フォーマット**: ESLint設定に従う（`npm run lint`でチェック）
- **コメント**: 自明なコードにコメント不要。WHYが非自明な場合のみ記述

### 命名規則
- コンポーネント: PascalCase (`SeminarCard.tsx`)
- ユーティリティ・型: camelCase (`lib/types.ts`)
- APIルート: Next.js App Router規約 (`app/api/seminars/route.ts`)
- DB列名: snake_case (`assignee_a`, `created_at`)

---

## よく使うコマンド

```bash
# 開発サーバー（通常）
npm run dev

# Cloudflare Workers互換のローカルプレビュー（D1バインディング使用）
npm run preview

# Cloudflare Pagesへデプロイ
npm run deploy

# DBマイグレーション（ローカル）
npm run db:migrate

# DBマイグレーション（本番リモート）
npm run db:migrate:remote

# 型チェック
npx tsc --noEmit

# Lint
npm run lint
```

---

## データモデル

### seminars テーブル
| 列 | 型 | 説明 |
|---|---|---|
| id | TEXT PK | UUID |
| date | TEXT | YYYY-MM-DD形式 |
| type | TEXT | `rinudoku` / `zentai` / `kenkyu` |
| title | TEXT | タイトル（空可）|
| assignee_a | TEXT | 担当者A |
| assignee_b | TEXT | 担当者B |
| assignee_c | TEXT | 担当者C |
| notes | TEXT | メモ |
| created_at | DATETIME | 作成日時 |
| updated_at | DATETIME | 更新日時 |

### members テーブル
| 列 | 型 | 説明 |
|---|---|---|
| id | TEXT PK | UUID |
| name | TEXT | 名前 |
| role | TEXT | 役職（M2/M1/B4等）|
| order_num | INTEGER | 表示順 |
| created_at | DATETIME | 作成日時 |

---

## ドキュメント

作業前に必ず参照：
- [要件定義](docs/REQUIREMENTS.md)
- [システム構成](docs/ARCHITECTURE.md)
- [進捗管理](docs/PROGRESS.md)
- [セットアップ手順](docs/SETUP.md)
- [Cloudflare手順書](docs/cloudflare-setup.md)
