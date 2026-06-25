# 2026-06-24 commit-push-and-memo-rules

## 実施内容

- ユーザーの明示指示なしに `git commit` / `git push` を実行しないルールを追加した。
- 機能実装や運用ルール変更時に `docs/memo` へ日付付きMarkdownメモを残すルールを追加した。
- `docs/PROJECT_CONTEXT.json` に運用ルールを機械可読な形で追加した。
- `docs/GOVERNANCE.md`、AI別入口、`docs/instructions` に同じ運用ルールを反映した。
- `npm run docs:check` で、AI別入口にcommit / push許可ルールと `docs/memo` ルールが含まれることを検査するようにした。

## 背景

Claude、Codex、Gemini、Copilotなど複数AIで開発するため、リポジトリ操作と作業記録のルールを明文化し、自動チェックでも検出できるようにした。

## 確認項目

- `docs/PROJECT_CONTEXT.json` に運用ルールがあること。
- 主要なAI入口に `Do not commit or push without explicit user instruction.` があること。
- 主要なAI入口に `docs/memo` のメモ運用があること。
