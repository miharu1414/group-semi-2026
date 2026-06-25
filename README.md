# Group Seminar Calendar 2026

研究室の輪読ゼミ、全体ゼミ、研究共有会の予定と担当者を管理するWebアプリです。

**Tech Stack:** Next.js 14 + TypeScript + Tailwind CSS + Firebase Admin SDK + Firestore

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

## Documentation Governance

アーキテクチャ、DB、環境変数、セットアップ手順、AI向け指示を変更する前に、次を確認してください。

1. `docs/GOVERNANCE.md`
2. `docs/PROJECT_CONTEXT.json`
3. `docs/ARCHITECTURE.md`
4. `docs/instructions/INDEX.md`

関連する変更を終える前に、ドキュメント整合性チェックを実行します。

```bash
npm run docs:check
```

## Environment Variables

`.env.local` にFirebase Admin SDKのサービスアカウント情報を設定します。

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

`FIREBASE_PRIVATE_KEY` は改行を `\n` に変換し、ダブルクォートで囲んでください。

`.env.local` はgitignore対象です。秘密鍵やダウンロードしたサービスアカウントJSONはコミットしないでください。

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Next.js開発サーバーを起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | ビルド済みアプリを起動 |
| `npm run lint` | ESLintチェック |
| `npm run docs:check` | ドキュメント整合性チェック |
| `npm run check` | ドキュメント、lint、buildをまとめて確認 |

## Main Files

| Path | Purpose |
| --- | --- |
| `app/api/seminars` | ゼミ予定API |
| `app/api/members` | メンバーAPI |
| `lib/firebase-admin.ts` | Firebase Admin SDK初期化 |
| `lib/types.ts` | 共有型定義 |
| `components/CalendarApp.tsx` | カレンダーUIの状態管理 |

## Documentation

| Document | Description |
| --- | --- |
| `docs/GOVERNANCE.md` | ドキュメント整合性ルール |
| `docs/PROJECT_CONTEXT.json` | 機械可読なプロジェクト文脈 |
| `docs/SETUP.md` | 開発環境セットアップ |
| `docs/ARCHITECTURE.md` | システム構成 |
| `docs/REQUIREMENTS.md` | 要件定義 |
| `docs/PROGRESS.md` | 進捗管理 |
