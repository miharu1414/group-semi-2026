# 2026-06-25 カレンダーホバー UI・レイアウト・NoticeBoard 修正

## 変更概要

### 1. カレンダー — 開始時刻の表示位置改善
- 日付の右（＋ボタンと同列）にあった開始時刻 `13:30〜` を日付の真下に移動。
- 構造: 日付ナンバー → 今日ラベル（当日のみ） → 開始時刻、縦に並ぶ。

### 2. カレンダー — ホバー時の全予定表示（境界ベース）
- **変更前**: CSS `group-hover` → DOM 子要素（オーバーフロー部分のカード）をホバーしても元セルがホバー中のまま。隣接セルに移行しない。
- **変更後**: React state `hoveredDate` + `onMouseMove` で **自然なセル境界**（`getBoundingClientRect().bottom`）を判定。
  - カーソルがセルの元の高さの下端を越えた瞬間にホバー解除 → 下のセルのホバーに移行。
  - ホバー中は全カードを白背景＋シャドウのポップアップで表示。
- z-index を inline style で制御（React state 連動）。

### 3. CalendarApp — レイアウト修正
- 外側 div から `overflow-hidden` を削除（ホバーポップアップが消えるのを防止）。
- `main` から `overflow-y-auto` を削除、カレンダーが `flex-1 min-h-0` で確実に高さを確保。

### 4. NoticeBoard — レイアウト・モバイル対応
- `shrink-0 max-h-[28vh] flex flex-col` を追加、お知らせリストを内部スクロールに変更。
- 編集・削除ボタンの `opacity-0` をモバイルで解除（`sm:opacity-0 sm:group-hover/item:opacity-100`）。
  - スマホではボタン常時表示、PC ではホバー時のみ表示。

### 5. MemberScheduleModal — バグ修正
- 役割カウント集計でハードコードされた文字列（`'A（輪読）'` 等）を `RL.a` / `RL.b` / `RL.c` 参照に変更。
  - `CURRENT_ACTIVITY` を変更した際に集計が壊れる潜在バグを修正。

### 6. PROJECT_CONTEXT.json — フィールド文書化
- `notices` を `firestoreCollections` に追加。
- `seminarFields` セクションを新設し `activity_id`, `start_time`, `end_time`, `custom_label` を明記。
