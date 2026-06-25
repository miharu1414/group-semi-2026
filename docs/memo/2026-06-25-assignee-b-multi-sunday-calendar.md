# 担当者B複数化・A/C自動入力・日曜始まりカレンダー

## 変更内容

### 担当者Bの複数対応

- `lib/types.ts`: `Seminar.assignee_b` および `SeminarFormData.assignee_b` を `string` → `string[]` に変更
- `app/api/seminars/route.ts` / `app/api/seminars/[id]/route.ts`: `assignee_b` を `string[]` として受け取るよう型を更新。デフォルト値を `[]` に変更
- Firestore は schema-less なため既存データとの互換性は各コンポーネントで `Array.isArray` チェックで吸収

### A・C入力時の自動入力

- `components/Modals/SeminarModal.tsx`: A または C を変更したとき、両方に値があれば B に残りのメンバーを自動セット
- B のUIはチップ式トグルに変更（クリックで個別ON/OFF可能）
- 自動入力後もユーザーが手動でBを調整できる

### カレンダーの日曜始まり

- `components/Calendar/CalendarView.tsx`:
  - `weekStartsOn: 1` → `weekStartsOn: 0`
  - 曜日ヘッダーを `['日', '月', '火', '水', '木', '金', '土']` に変更
  - ヘッダーの色: 日（index 0）→ 赤、土（index 6）→ 青
