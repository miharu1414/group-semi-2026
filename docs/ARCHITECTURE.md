# システム構成書

> **整合性**: APIエンドポイントやDB構成を変更した場合、`INSTRUCTIONS.md` のチェックリストを実行してください。

## 全体構成図

```
ブラウザ (React/Next.js)
    │
    │  HTTP (fetch)
    ▼
Cloudflare Pages (Edge Runtime)
    │  Next.js App Router
    ├── /                          → app/page.tsx → CalendarApp
    └── /api/seminars              → app/api/seminars/route.ts
        /api/seminars/:id          → app/api/seminars/[id]/route.ts
        /api/members               → app/api/members/route.ts
        /api/members/:id           → app/api/members/[id]/route.ts
    │
    │  D1 binding (env.DB)
    ▼
Cloudflare D1 (SQLite)
    ├── seminars
    └── members
```

---

## API エンドポイント一覧

### ゼミ予定 `/api/seminars`

| メソッド | パス | 説明 | クエリ/ボディ |
|---|---|---|---|
| GET | `/api/seminars` | 全ゼミ取得（月絞り込み可） | `?month=yyyy-MM` |
| POST | `/api/seminars` | ゼミ新規作成 | `{ date, type, title?, assignee_a?, assignee_b?, assignee_c?, notes? }` |
| GET | `/api/seminars/:id` | 単件取得 | — |
| PUT | `/api/seminars/:id` | 更新（部分更新可） | 同上 |
| DELETE | `/api/seminars/:id` | 削除 | — |

### メンバー `/api/members`

| メソッド | パス | 説明 | ボディ |
|---|---|---|---|
| GET | `/api/members` | 全メンバー取得（order_num順） | — |
| POST | `/api/members` | メンバー新規作成 | `{ name, role?, order_num? }` |
| GET | `/api/members/:id` | 単件取得 | — |
| PUT | `/api/members/:id` | 更新 | `{ name?, role?, order_num? }` |
| DELETE | `/api/members/:id` | 削除 | — |

---

## DBスキーマ

→ `migrations/0001_schema.sql` が正。`lib/types.ts` と整合性を保つこと。

### seminars

| 列 | 型 | 制約 |
|---|---|---|
| id | TEXT | PK, UUID |
| date | TEXT | NOT NULL, YYYY-MM-DD |
| type | TEXT | NOT NULL, CHECK(`rinudoku`/`zentai`/`kenkyu`) |
| title | TEXT | DEFAULT '' |
| assignee_a | TEXT | DEFAULT '' |
| assignee_b | TEXT | DEFAULT '' |
| assignee_c | TEXT | DEFAULT '' |
| notes | TEXT | DEFAULT '' |
| created_at | DATETIME | NOT NULL |
| updated_at | DATETIME | NOT NULL |

### members

| 列 | 型 | 制約 |
|---|---|---|
| id | TEXT | PK, UUID |
| name | TEXT | NOT NULL |
| role | TEXT | DEFAULT '' |
| order_num | INTEGER | DEFAULT 0 |
| created_at | DATETIME | NOT NULL |

---

## コンポーネント構成

```
app/page.tsx (Edge)
└── components/CalendarApp.tsx ('use client' — 状態管理ハブ)
    ├── components/Calendar/CalendarView.tsx  (カレンダーグリッド)
    │   └── components/Calendar/SeminarCard.tsx  (1予定のカード)
    └── components/Modals/
        ├── SeminarModal.tsx  (予定追加・編集)
        └── MembersModal.tsx  (メンバー管理)
```

---

## データフロー

1. `CalendarApp` が月変更のたびに `/api/seminars?month=yyyy-MM` と `/api/members` をfetch
2. `CalendarView` はpropsとして受け取り表示のみ担当
3. モーダルでの保存・削除は `CalendarApp` のハンドラが担当し、楽観的UIで即時反映
4. エラー時はモーダル内にエラーメッセージを表示
