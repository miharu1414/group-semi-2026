# システム構成

## 全体像

```text
Browser
  |
  | fetch
  v
Next.js 14 App Router
  |
  | Firebase Admin SDK
  v
Firestore
```

このプロジェクトは TypeScript と Tailwind CSS を使ったNext.jsアプリです。APIルートはサーバー側でFirebase Admin SDKを使い、Firestoreへアクセスします。

## Frontend

- `app/page.tsx` が `components/CalendarApp.tsx` を表示します。
- `CalendarApp` が月表示、予定、メンバー、モーダル状態を管理します。
- UIは `components/Calendar` と `components/Modals` に分割されています。

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/seminars` | 予定一覧を取得。`?month=yyyy-MM` で絞り込み |
| POST | `/api/seminars` | 予定を作成 |
| GET | `/api/seminars/:id` | 予定を1件取得 |
| PUT | `/api/seminars/:id` | 予定を更新 |
| DELETE | `/api/seminars/:id` | 予定を削除 |
| GET | `/api/members` | メンバー一覧を取得 |
| POST | `/api/members` | メンバーを作成 |
| GET | `/api/members/:id` | メンバーを1件取得 |
| PUT | `/api/members/:id` | メンバーを更新 |
| DELETE | `/api/members/:id` | メンバーを削除 |

## Data Layer

Firebase Admin SDKの初期化は `lib/firebase-admin.ts` に集約しています。

必要な環境変数:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Firestore collections:

- `seminars`
- `members`

## Data Shape

### seminars

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Firestore document ID |
| `date` | string | `YYYY-MM-DD` |
| `type` | string | `rinudoku` / `zentai` / `kenkyu` |
| `title` | string | optional text |
| `assignee_a` | string | presenter/progress owner |
| `assignee_b` | string | recorder |
| `assignee_c` | string | materials/support |
| `notes` | string | notes |
| `created_at` | string | ISO timestamp |
| `updated_at` | string | ISO timestamp |

### members

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Firestore document ID |
| `name` | string | member name |
| `role` | string | grade/role |
| `order_num` | number | display order |
| `created_at` | string | ISO timestamp |
