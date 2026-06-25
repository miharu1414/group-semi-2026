# ADR 0001: Firestoreを現在のデータストアとする

## Status

Accepted

## Date

2026-06-24

## Context

このアプリはNext.js APIルートからFirebase Admin SDKを使い、ゼミ予定とメンバー情報をFirestoreに保存する実装になっている。

以前の資料には別のデータストアやデプロイ前提が残っていたため、複数AIで開発すると古い前提へ戻るリスクがあった。

## Decision

現在の正式なデータストアはFirestoreとする。

サーバー側のFirestoreアクセスは `lib/firebase-admin.ts` に集約し、APIルートはそこから `db` を import する。

## Consequences

- Firebase Admin SDKのサービスアカウント情報が必要になる。
- `.env.local` とデプロイ先の環境変数にFirebase Admin SDK用の値を設定する。
- クライアントコンポーネントからFirebase Admin SDKを使わない。
- 古いデータストア前提のドキュメント、スクリプト、手順は復活させない。
