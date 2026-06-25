# ドキュメント整合性ガバナンス

このリポジトリでは、複数のAIツールが同時期に作業しても設計判断がぶれないように、ドキュメントを「読むもの」ではなく「検査できる作業契約」として扱います。

## 単一の基準

最初に確認する基準は `docs/PROJECT_CONTEXT.json` です。

このファイルには、現在の技術スタック、主要なソースオブトゥルース、必要な環境変数、廃止済みの前提、運用ルールを記録します。READMEやAI向け指示がここから外れた場合は、文書か実装のどちらかを更新してください。

## 読む順番

AIエージェントと人間のどちらも、作業前に次の順番で確認します。

1. `docs/GOVERNANCE.md`
2. `docs/PROJECT_CONTEXT.json`
3. `docs/ARCHITECTURE.md`
4. `docs/instructions/INDEX.md`
5. 作業対象に近いコードとドキュメント

## 絶対ルール

- Do not commit or push without explicit user instruction.
- ユーザーから明示的な指示がない限り、`git commit` と `git push` は実行しない。
- commit / push が必要そうに見える場合でも、必ずユーザーの許可を先に取る。
- Do not run npm run build while the dev server is running.
- ローカル開発中は `npm run dev` のホットリロードを使い、dev server起動中に `npm run build` を実行しない。
- 機能実装、設計変更、運用ルール変更を行った場合は、`docs/memo` に `YYYY-MM-DD-kebab-case-summary.md` 形式のメモを残す。

## 変更ルール

- アーキテクチャ、DB、デプロイ先、環境変数を変えたら `docs/PROJECT_CONTEXT.json` を更新する。
- APIやデータ構造を変えたら `docs/ARCHITECTURE.md` と `docs/instructions/DATA_MODEL.md` を更新する。
- セットアップ手順を変えたら `README.md` と `docs/SETUP.md` を更新する。
- AI向けの作業ルールを変えたら `CLAUDE.md`、`GEMINI.md`、`.github/copilot-instructions.md`、`.cursor/rules/main.mdc` の入口が同じ基準を指していることを確認する。
- 大きな設計判断は `docs/decisions/` にADRとして残す。

## 自動チェック

手元で次を実行します。

```bash
npm run check:dev
```

GitHub Actionsの `Quality Gate` でも、pull request と `main` へのpush時に `npm run docs:check` と `npm run lint` を実行します。

このチェックでは、次を検査します。

- 必須ドキュメントが存在すること
- AI別の入口が `docs/GOVERNANCE.md` と `docs/PROJECT_CONTEXT.json` を参照していること
- AI別の入口にcommit / push許可ルールと `docs/memo` ルールが含まれること
- AI別の入口にdev server起動中のbuild禁止ルールが含まれること
- 現在のスタックが主要ドキュメントに反映されていること
- 廃止済みの前提が主要ドキュメントに復活していないこと
- Firebase Admin SDKに必要な環境変数が `.env.example` とセットアップ資料に載っていること

## レビュー観点

ドキュメント変更のレビューでは、文章のきれいさより次を優先します。

- 実装と矛盾していないか
- セットアップ手順が実行可能か
- AIが古い前提でコードを書かないか
- 秘密情報を誘導・露出していないか
- commit / push の実行条件が曖昧になっていないか
- 実装メモが `docs/memo` に残っているか
- 読者が「次に何を見ればよいか」を迷わないか
