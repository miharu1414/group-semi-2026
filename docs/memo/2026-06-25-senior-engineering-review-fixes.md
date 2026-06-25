# 2026-06-25 senior-engineering-review-fixes

## 実施内容

- ゼミAPIのFirestoreレコード正規化を `lib/seminar-normalize.ts` に切り出した。
- ゼミ作成・更新時に文字列のtrim、時刻形式、終了時刻が開始時刻より前にならないことを検証するようにした。
- ゼミ取得・更新レスポンスで `assignee_b`、`custom_label`、`activity_id`、`start_time`、`end_time` の形を揃えた。
- メンバー更新APIで任意フィールドの素通しをやめ、`name`、`role`、`order_num` のみ更新するようにした。
- 空のメンバー名や不正な `order_num` を400で拒否するようにした。
- dev server起動中でも安全に回せる `npm run check:dev` と `npm run typecheck` を追加した。

## レビュー観点

- API境界で想定外のデータが保存されないこと。
- クライアントが受け取るデータ形状が作成・取得・更新で揃っていること。
- ローカル開発中のHMRを壊さない検証導線があること。
- その日のゼミの中で一番早い時刻を表示する方針は維持すること。

## 確認予定

- `npm run check:dev`
- dev server停止後に `npm run check`
