# スケジュール投入・概要ページ・担当一覧・UI/UX改善

## 変更内容

### スケジュールデータ投入

- `scripts/seed-seminars.mjs`: 2026年7〜9月の輪読ゼミ13件をAPIへ投入するスクリプトを追加
- 参加者: 並木（M2）・近藤（M1）・有田（B4）・篠塚（B4）
- 7/1 全体ゼミ後・7/15 研究共有（別エントリ）も含む
- 重複チェック付き（date + type + title でキー照合）

### InfoModal（概要・役割説明）

- `components/Modals/InfoModal.tsx` を新規作成
- 表示内容: 目的、参加者・日程、A/B/C各担当の役割、進行目安（タイムライン）、全体メモ
- モバイルではボトムシート形式（下から出現）、PC ではセンターモーダル
- ヘッダーの「概要」ボタン（BookOpen アイコン）から開く

### MemberScheduleModal（担当一覧）

- `components/Modals/MemberScheduleModal.tsx` を新規作成
- メンバーをチップで選択 → 全セミナーから担当回をテーブル表示
- 表示列: 日付 / 種別バッジ / 章タイトル / 役割（A・B・C） / 備考（sm以上）
- 集計バッジ（A×n回、B×n回、C×n回）を上部に表示
- 全セミナーを `getSeminars()` で取得（月フィルタなし）
- ヘッダーの「担当確認」ボタン（User アイコン）から開く

### CalendarApp ヘッダー更新

- 「概要」「担当確認」「メンバー」の3ボタン構成に変更
- モバイル: アイコンのみ、sm以上: アイコン+テキスト
- `h-dvh` に変更しモバイルのブラウザUI考慮

### UI/UX 改善

- カレンダーセル高さ: `minmax(100px, 1fr)` → `clamp(72px, 14vw, 120px)` でモバイル最適化
- クイック追加ボタン: `touch-manipulation` 追加・focus 時にも表示
- InfoModal / MemberScheduleModal: モバイルでボトムシート、ハンドルバー表示
- MemberScheduleModal テーブル: `overflow-x-auto` で横スクロール対応
