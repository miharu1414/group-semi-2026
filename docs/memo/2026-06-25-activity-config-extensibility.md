# ゼミ活動設定の外部化・拡張性確保

## 背景

10月以降に輪読対象が変わる可能性があるため、活動（書籍・テーマ）固有の情報を
コードから切り離し、1 ファイルで管理できる設計に変更した。

## 変更内容

### `lib/activity-config.ts`（新規）

- `ActivityConfig` 型を定義（name / subtitle / purpose / roles / timeFlow / notes など）
- `ACTIVITIES` 配列に現在の活動「独学で鍛える数理思考２」を登録
- `CURRENT_ACTIVITY` エクスポートで「今アクティブな活動」を 1 か所で切り替え可能にした

### `components/Modals/InfoModal.tsx`

- ハードコードされていた書籍名・著者・目的・役割説明・進行目安をすべて
  `CURRENT_ACTIVITY` から参照するよう変更
- 新しい活動に切り替えた際、コード修正なしで概要モーダルの内容が更新される

### `components/Modals/MemberScheduleModal.tsx`

- 役割ラベル（`A（輪読）` など）をハードコードから `CURRENT_ACTIVITY.roles.*.short` に変更
- 活動のロール定義が変わっても自動追従する

### `components/Modals/SeminarModal.tsx`

- タイトル入力欄のプレースホルダーを `CURRENT_ACTIVITY.titlePlaceholder` から取得

### `docs/PROJECT_CONTEXT.json`

- `activityConfig` の場所と拡張方針を記録

## 活動を切り替える手順

1. `lib/activity-config.ts` の `ACTIVITIES` 配列に新しい `ActivityConfig` を追記
2. `CURRENT_ACTIVITY = ACTIVITIES[新しいインデックス]` に変更
3. `npm run build` で確認してデプロイ

## 将来のさらなる拡張（複数活動の並行管理）

1. `Seminar` 型に `activity_id?: string` フィールドを追加
2. API GET で activity_id フィルターを受け付ける
3. カレンダー・担当一覧で `ACTIVITIES.find(a => a.id === seminar.activity_id)` で設定を取得
4. ナビゲーションで「現在の活動を切り替える」UIを追加

現時点ではこの拡張は不要なため、コメントとして `activity-config.ts` に残してある。
