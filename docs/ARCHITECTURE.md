# システム構成

最終更新: 2026-06-24

---

## 1. アーキテクチャ概要

```
┌─────────────────────────────────────────────────────┐
│                   ブラウザ (Client)                   │
│  Next.js App (React)  ←→  /api/* (fetch)            │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────┐
│              Cloudflare Pages (Edge)                 │
│  ┌────────────────────┐  ┌──────────────────────┐   │
│  │  Static Assets     │  │  API Routes          │   │
│  │  (HTML/CSS/JS)     │  │  (Edge Runtime)      │   │
│  └────────────────────┘  └──────────┬───────────┘   │
│                                     │ D1 Binding     │
│                          ┌──────────▼───────────┐   │
│                          │  Cloudflare D1       │   │
│                          │  (SQLite互換DB)       │   │
│                          └──────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 2. 技術スタック詳細

### フロントエンド
- **Next.js 14** (App Router) — React Server Components + Client Components
- **TypeScript** — 型安全な開発
- **Tailwind CSS** — ユーティリティファーストCSS
- **lucide-react** — アイコンライブラリ
- **date-fns / date-fns-tz** — 日付操作

### バックエンド
- **Next.js API Routes** (`app/api/`) — RESTful API
- **Edge Runtime** — Cloudflare Workers環境で動作
- **Cloudflare D1** — SQLite互換のサーバーレスDB

### インフラ
- **Cloudflare Pages** — ホスティング・CDN
- **@cloudflare/next-on-pages** — Next.js → Cloudflare Pages変換ツール
- **wrangler** — Cloudflare CLIツール

---

## 3. ディレクトリ構成

```
group-semi-2026/
├── app/                        # Next.js App Router
│   ├── api/
│   │   ├── seminars/
│   │   │   ├── route.ts        # GET（一覧）, POST（作成）
│   │   │   └── [id]/
│   │   │       └── route.ts    # GET（詳細）, PUT（更新）, DELETE（削除）
│   │   └── members/
│   │       ├── route.ts        # GET（一覧）, POST（作成）
│   │       └── [id]/
│   │           └── route.ts    # PUT（更新）, DELETE（削除）
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── CalendarApp.tsx         # ルートコンポーネント（状態管理）
│   ├── Calendar/
│   │   ├── CalendarView.tsx    # カレンダーグリッド（月表示）
│   │   └── SeminarCard.tsx     # 予定カード（種別色分け）
│   └── Modals/
│       ├── SeminarModal.tsx    # ゼミ作成・編集モーダル
│       └── MembersModal.tsx    # メンバー管理モーダル
│
├── lib/
│   ├── types.ts                # 型定義・SEMINAR_TYPES定数
│   └── api.ts                  # クライアント側APIラッパー
│
├── migrations/
│   └── 0001_schema.sql         # テーブル定義 + 初期データ
│
├── docs/                       # ドキュメント
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md         # このファイル
│   ├── PROGRESS.md
│   ├── SETUP.md
│   └── cloudflare-setup.md
│
├── CLAUDE.md                   # AI開発用ガイド
├── .env.example                # 環境変数テンプレート
├── cloudflare-env.d.ts         # D1型定義
├── wrangler.toml               # Cloudflare設定
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 4. API設計

### ゼミ予定 API

| メソッド | エンドポイント | 説明 | パラメータ |
|--------|-------------|------|----------|
| GET | `/api/seminars` | 一覧取得 | `?month=YYYY-MM`（任意）|
| POST | `/api/seminars` | 新規作成 | Body: SeminarFormData |
| GET | `/api/seminars/:id` | 詳細取得 | - |
| PUT | `/api/seminars/:id` | 更新 | Body: Partial\<SeminarFormData\> |
| DELETE | `/api/seminars/:id` | 削除 | - |

### メンバー API

| メソッド | エンドポイント | 説明 | パラメータ |
|--------|-------------|------|----------|
| GET | `/api/members` | 一覧取得 | - |
| POST | `/api/members` | 新規作成 | Body: MemberFormData |
| PUT | `/api/members/:id` | 更新 | Body: Partial\<MemberFormData\> |
| DELETE | `/api/members/:id` | 削除 | - |

---

## 5. データフロー

```
ユーザー操作
    │
    ▼
CalendarApp.tsx（状態管理）
    │ useEffect / イベントハンドラ
    ▼
lib/api.ts（fetch ラッパー）
    │ HTTP Request
    ▼
app/api/*/route.ts（Edge Runtime）
    │ D1 Binding
    ▼
Cloudflare D1（SQLite）
```

---

## 6. 環境構成

| 環境 | 説明 | DBアクセス |
|------|------|----------|
| ローカル開発 (`npm run dev`) | Next.js開発サーバー | D1バインディング不可（ローカルSQLiteなし）|
| ローカルプレビュー (`npm run preview`) | Wrangler + miniflare | ローカルSQLite（`.wrangler/`）|
| 本番 (`npm run deploy`) | Cloudflare Pages | Cloudflare D1（リモート）|

> **注意**: `npm run dev` では `getRequestContext()` が動作しないため、APIは404になります。
> APIのテストには `npm run preview` を使用してください。
