# INSTRUCTIONS.md

このリポジトリで作業するAIエージェント向けの入口です。

## First Read

1. `docs/GOVERNANCE.md`
2. `docs/PROJECT_CONTEXT.json`
3. `docs/ARCHITECTURE.md`
4. `docs/instructions/INDEX.md`

## 現在の実装方針

- Next.js 14 App Routerを使う
- APIルートはサーバー側でFirebase Admin SDKを使う
- 永続化はFirestoreを使う
- Firebaseサービスアカウント情報は `.env.local` に置き、コミットしない
- `.ps1` / `.bat` など個人環境向け初期化スクリプトは追加しない
- Do not commit or push without explicit user instruction.
- ユーザーから明示的な指示がない限り、`git commit` と `git push` は実行しない
- Do not run npm run build while the dev server is running.
- ローカル開発中は `npm run dev` のホットリロードを使い、dev server起動中に `npm run build` を実行しない
- 機能実装や運用ルール変更を行った場合は、`docs/memo` に `YYYY-MM-DD-kebab-case-summary.md` 形式のメモを残す
- アーキテクチャ、DB、環境変数、セットアップ手順を変える場合は `docs/PROJECT_CONTEXT.json` と関連ドキュメントを同時に更新する

## 自動読み込みファイル

| Tool | File |
| --- | --- |
| Claude Code | `CLAUDE.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Cursor | `.cursor/rules/main.mdc` |
| Gemini CLI | `GEMINI.md` |

## 整合性チェック

```bash
npm run docs:check
```
