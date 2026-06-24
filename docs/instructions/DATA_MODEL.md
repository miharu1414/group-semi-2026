# データモデル定義（SSOT）

> 参照元: [INDEX.md](./INDEX.md)  
> **このファイルはプロジェクト全体のデータ定義の唯一の正です。**  
> `lib/types.ts`・`migrations/*.sql`・`DESIGN_RULES.md` の色定義はここと整合性を保つこと。

---

## ゼミ種別定義（変更時は必ずすべての参照箇所を同時更新）

| コード | 日本語名 | 色系統 | 用途 |
|---|---|---|---|
| `rinudoku` | 輪読ゼミ | Indigo | 書籍・論文の輪読と発表 |
| `zentai` | 全体ゼミ | Violet | 研究室全体での発表・議論 |
| `kenkyu` | 研究共有会 | Teal | 個人研究の進捗共有 |

### 種別変更時の更新箇所（必須）

1. `migrations/` に新しいマイグレーションSQL（CHECK制約の更新）
2. `lib/types.ts` の `SeminarType` Union型
3. `lib/types.ts` の `SEMINAR_TYPES` オブジェクト
4. `DESIGN_RULES.md` のゼミ種別カラーテーブル
5. `docs/REQUIREMENTS.md` のゼミ種別定義

---

## 担当者ロール定義

| ロール | 表示キー | 意味 | 表示例 |
|---|---|---|---|
| A | `assignee_a` | 発表・進行担当 | `A 田中 太郎` |
| B | `assignee_b` | 記録・議事録担当 | `B 鈴木 花子` |
| C | `assignee_c` | 資料準備・補佐担当 | `C 佐藤 次郎` |

- A/B/Cはすべて任意。未設定の場合は空文字 `''`（NULLは使わない）
- UIでは常に設定されているロールのみ表示する

---

## DBスキーマ

> 正は `migrations/0001_schema.sql`。下記はリファレンス用サマリー。

### seminars テーブル

```sql
CREATE TABLE seminars (
  id          TEXT PRIMARY KEY,           -- crypto.randomUUID()
  date        TEXT NOT NULL,              -- YYYY-MM-DD
  type        TEXT NOT NULL               -- CHECK(type IN ('rinudoku','zentai','kenkyu'))
              CHECK(type IN ('rinudoku', 'zentai', 'kenkyu')),
  title       TEXT NOT NULL DEFAULT '',
  assignee_a  TEXT NOT NULL DEFAULT '',
  assignee_b  TEXT NOT NULL DEFAULT '',
  assignee_c  TEXT NOT NULL DEFAULT '',
  notes       TEXT NOT NULL DEFAULT '',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### members テーブル

```sql
CREATE TABLE members (
  id          TEXT PRIMARY KEY,           -- crypto.randomUUID()
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',   -- 例: 'M2', 'B4', '教員'
  order_num   INTEGER NOT NULL DEFAULT 0, -- 表示順（昇順）
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## TypeScript型定義

> 正は `lib/types.ts`。下記はリファレンス用サマリー。

```typescript
type SeminarType = 'rinudoku' | 'zentai' | 'kenkyu';

interface Seminar {
  id: string;
  date: string;         // YYYY-MM-DD
  type: SeminarType;
  title: string;
  assignee_a: string;
  assignee_b: string;
  assignee_c: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface Member {
  id: string;
  name: string;
  role: string;         // 'M2' | 'M1' | 'B4' | 'B3' | 'D3' | 'D2' | 'D1' | '教員' | 'その他'
  order_num: number;
  created_at: string;
}

interface SeminarFormData {
  date: string;
  type: SeminarType;
  title: string;
  assignee_a: string;
  assignee_b: string;
  assignee_c: string;
  notes: string;
}

interface MemberFormData {
  name: string;
  role: string;
  order_num: number;
}
```

---

## ID・日時の扱い

| 項目 | 形式 | 生成方法 |
|---|---|---|
| ID | UUID文字列 | `crypto.randomUUID()`（Web標準API） |
| 日付 | `YYYY-MM-DD` | `format(date, 'yyyy-MM-dd')` (date-fns) |
| 日時 | ISO 8601文字列 | `new Date().toISOString()` |

---

## APIレスポンス形式

D1の `.all()` は `{ results: T[] }` を返す。APIルートでは `result.results` を返すこと:

```typescript
const result = await env.DB.prepare('SELECT * FROM seminars').all();
return Response.json(result.results); // ← result ではなく result.results
```
