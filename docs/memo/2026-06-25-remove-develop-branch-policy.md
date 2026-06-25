# Gitブランチ運用方針の変更：developブランチの廃止とmainブランチ直接PRフローへの移行

## 背景と概要

これまでは `feature/*` -> `develop` -> `main` という多段階のブランチ運用を採用していましたが、リポジトリの運用上、`develop` ブランチを経由せずとも直接 `main` ブランチに対してプルリクエスト（PR）を作成・検証・マージ可能であることが確認されました。

運用のシンプル化およびローカル同期の手間を削減するため、`develop` ブランチを廃止し、今後はすべての機能開発および修正を直接 `main` ブランチに対するPRとして管理する方針に変更します。

## 変更内容

### 1. GitHubリポジトリの設定・ブランチ削除
- リモートおよびローカルの `develop` ブランチを削除しました。
- GitHubのルールセット（Repository Ruleset）を「Protect main branch」に改名し、保護対象を `main` ブランチのみに変更しました。
- `@miharu1414`（管理者）による自己承認/バイパス設定は引き続き維持し、円滑な個人開発フローを継続可能としています。
- マージ済みの機能ブランチが自動的に削除されるよう、リポジトリ設定の `delete_branch_on_merge` を有効化しました。

### 2. CIワークフロー（Quality Gate）の変更
- `.github/workflows/quality.yml` から `develop` ブランチへのプッシュトリガーを削除しました。
- `main` へのPRが `develop` 以外から作成された際にエラーにするチェックステップ（Enforce branch flow）を削除しました。

### 3. ドキュメントおよびエージェント向け指示書の更新
- ローカル同期ルール（Branch Synchronization Rule）を以下のように更新しました：
  - 変更前：`git fetch origin` の後、`develop` と `main` をそれぞれ checkout して `origin/main` から rebase する。
  - 変更後：`git fetch origin` の後、`main` を checkout して `origin/main` から rebase する。
- 以下のファイルを更新して上記ルールを統一しました：
  - `docs/GOVERNANCE.md`
  - `CONTRIBUTING.md`
  - `INSTRUCTIONS.md`
  - `CLAUDE.md`
  - `GEMINI.md`
  - `.github/copilot-instructions.md`
  - `.cursor/rules/main.mdc`
