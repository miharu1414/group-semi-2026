# 「その他」種別・custom_label・夏合宿データ追加

## 概要

輪読/全体/研究共有以外のイベントに対応するため、`SeminarType` に `'other'` を追加し、
カスタムラベル入力（`custom_label`）フィールドを全レイヤーに実装した。
あわせて夏合宿（2026-08-27〜29）のシードデータを投入した。

## 変更内容

### lib/types.ts
- `SeminarType` に `'other'` を追加
- `SEMINAR_TYPES.other` をオレンジ系カラーで定義
- `Seminar` / `SeminarFormData` に `custom_label: string` フィールドを追加

### app/api/seminars/route.ts / [id]/route.ts
- GET: `custom_label` を `''` にフォールバックして返す
- POST: `custom_label` を保存
- PUT: allowlist に `custom_label` を追加

### components/Modals/SeminarModal.tsx
- `EMPTY_FORM` に `custom_label: ''` を追加
- 種別ボタンを `grid-cols-2 sm:grid-cols-4` の 2×2 グリッドに変更（4種類対応）
- `form.type === 'other'` のとき下にカスタムラベル入力欄を表示

### components/Calendar/SeminarCard.tsx
- `type === 'other'` のとき `shortLabel` の代わりに `custom_label || 'その他'` を表示

### components/Modals/DayDetailModal.tsx
- `type === 'other'` のとき `label` の代わりに `custom_label || 'その他'` を表示

### components/Modals/MemberScheduleModal.tsx
- 種別カラムで `type === 'other'` のとき `custom_label || 'その他'` を表示

### components/Modals/InfoModal.tsx
- カレンダー凡例セクションを追加（輪読/全体/研究/その他の4色を説明）

### components/CalendarApp.tsx
- ヘッダー凡例に「その他」（オレンジ）を追加

### scripts/seed-seminars.mjs
- 夏合宿エントリを追加（2026-08-27, 08-28, 08-29、`type: 'other'`, `custom_label: '夏合宿'`）
- スクリプト実行済み（3件投入確認）
