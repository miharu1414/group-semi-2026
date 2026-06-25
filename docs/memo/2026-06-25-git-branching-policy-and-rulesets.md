# 2026-06-25 git-branching-policy-and-rulesets

## 実施内容

- リポジトリの開発フローを `feature/*` -> `develop` -> `main` に移行するための設定とドキュメントの反映を行いました。
- GitHubの新しいリポジトリルールセット（Repository Ruleset）「Protect main branch」を「Protect main and develop branches」に更新しました。
  - ルール適用対象に `refs/heads/develop` ブランチを追加。
  - `require_last_push_approval` (最後にプッシュした以外のユーザーによる承認が必要) を `false` に変更。
  - レポジトリ管理者（Repository Admin）のバイパス設定を追加し、`@miharu1414` 本人であればセルフ承認およびマージできるように設定を調整。
  - 必須ステータスチェック（Required Status Checks）に `docs-and-lint` ジョブを追加し、チェックがパスしないとマージできないように保護を強化。
- `CONTRIBUTING.md` および `docs/GOVERNANCE.md` に以下の内容を反映しました。
  - `main` と `develop` の双方の保護ブランチ設定。
  - `feature/*` から `develop` へPRを作成・マージし、そこから `main` へPR・リリースする開発フローの明記。
  - `main` へのプルリクエストの送信元（source branch）は `develop` からのみに制限するルール（ Quality Gate による自動検証）を明記。
  - 管理者/オーナーによるセルフ承認マージの許容。
- GitHub Actions の Quality Gate ワークフロー（`.github/workflows/quality.yml`）を、`main` だけでなく `develop` ブランチへのプッシュ時にも起動するように変更し、`main` へのPRが `develop` 以外から作成された場合は自動的にエラー（`exit 1`）にするガードレールを追加しました。

## レビュー観点

- ドキュメント内の記述が開発フローの変更と一致していること。
- `quality.yml` の記述にシンタックスエラーがなく、制限が正しく動作すること。
- ローカル検証（`npm run check:dev`）が通ること。
