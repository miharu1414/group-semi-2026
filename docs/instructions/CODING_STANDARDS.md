# コーディング規約

> 参照元: [INDEX.md](./INDEX.md)  
> 関連: [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) | [DESIGN_RULES.md](./DESIGN_RULES.md)

---

## TypeScript

### 型安全

```typescript
// ✅ 正しい
interface Props { seminar: Seminar; onClick: (e: React.MouseEvent) => void; }

// ❌ 禁止 — any は使わない
const data: any = await res.json();

// ✅ 正しい — 型アサーションで明示する
const body = (await request.json()) as { date: string; type: SeminarType };
```

- `any` は原則禁止。どうしても必要な場合はコメントで理由を記載し `unknown` からナローイング
- `interface` を優先（`type` は Union型・交差型のみ）
- `null` チェックは Optional chaining (`?.`) と nullish coalescing (`??`) を使う

### インポート順序

1. React / Next.js
2. 外部ライブラリ（date-fns, lucide-react 等）
3. 内部モジュール（`@/lib/`, `@/components/`）

---

## Reactコンポーネント

### 基本形

```typescript
// 関数コンポーネント + Props interface を同ファイルに定義
interface Props {
  seminar: Seminar;
  onClose: () => void;
}

export default function SeminarModal({ seminar, onClose }: Props) {
  // ...
}
```

### ルール

| 項目 | ルール |
|---|---|
| コンポーネント形式 | 関数コンポーネントのみ（クラスコンポーネント禁止） |
| 状態管理 | `useState` / `useCallback` / `useEffect` のみ |
| 副作用 | `useEffect` 内に閉じる。cleanup関数を忘れない |
| イベントハンドラ名 | `handle〇〇`（例: `handleSubmit`, `handleDayClick`） |
| Props名のコールバック | `on〇〇`（例: `onClose`, `onSave`） |
| クライアントコンポーネント | ファイル先頭に `'use client'` を必ず記載 |

### 条件レンダリング

```typescript
// ✅ 早期returnパターン（モーダル等）
if (!open) return null;

// ✅ 三項演算子（短い場合）
{loading ? <Spinner /> : <Content />}

// ✅ && 演算子（falsy値に注意 — 0や''は表示される）
{items.length > 0 && <List items={items} />}
```

---

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネントファイル | PascalCase | `SeminarCard.tsx` |
| コンポーネント名 | PascalCase | `CalendarView` |
| ユーティリティ・ヘルパー | camelCase | `getSeminars`, `formatDate` |
| 型・インターフェース | PascalCase | `Seminar`, `SeminarFormData` |
| 定数オブジェクト | SCREAMING_SNAKE_CASE | `SEMINAR_TYPES` |
| DB列名 | snake_case | `assignee_a`, `created_at` |
| CSS変数・カスタムクラス | kebab-case | `modal-backdrop` |

---

## APIルート規約

```typescript
// 必須: ファイル先頭2行
import { getRequestContext } from '@cloudflare/next-on-pages';
export const runtime = 'edge';

// リクエストボディは型アサーションで受け取る
const body = (await request.json()) as { name: string; role?: string };

// バリデーションは必須フィールドのみチェック
if (!body.name?.trim()) {
  return Response.json({ error: 'name is required' }, { status: 400 });
}

// IDはcrypto.randomUUID()（Web標準）
const id = crypto.randomUUID();

// 日時はISO文字列
const now = new Date().toISOString();
```

---

## コメント方針

- **コメントは書かない**のがデフォルト。コード自体が自明であること
- 書くのは「WHYが非自明な場合」のみ（例: Edge制約の回避策、D1の挙動の注意点）
- 関数・コンポーネントのJSDocは書かない（型定義で十分）

---

## エラーハンドリング

```typescript
// クライアント側: try/catch でエラーをstateに保持し、UIに表示
const handleSave = async () => {
  try {
    await saveSeminar(form);
    onClose();
  } catch {
    setError('保存に失敗しました。もう一度お試しください。');
  }
};

// APIルート側: 想定外エラーはそのままthrow（Edge Runtimeが500を返す）
// 想定内エラー（Not found, Bad request）のみ明示的にResponse.jsonで返す
```

---

## Lint・フォーマット

```bash
npm run lint        # ESLint（`.eslintrc.json` の設定に従う）
npx tsc --noEmit    # 型チェック
```

PRマージ前に上記2コマンドがエラーなしで通ること。
