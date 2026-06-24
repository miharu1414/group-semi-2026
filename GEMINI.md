# Gemini Instructions — 班ゼミカレンダー 2026

このファイルはGemini CLIが自動で読み込む設定ファイルです。

## 必読ドキュメント

作業前に以下を読んでください（優先順）:

1. [`docs/instructions/INDEX.md`](docs/instructions/INDEX.md) — 全体マップ
2. [`docs/instructions/DATA_MODEL.md`](docs/instructions/DATA_MODEL.md) — ゼミ種別・型定義（SSOT）
3. [`docs/instructions/SYSTEM_DESIGN.md`](docs/instructions/SYSTEM_DESIGN.md) — Edge制約・アーキ原則
4. [`docs/instructions/CODING_STANDARDS.md`](docs/instructions/CODING_STANDARDS.md) — コーディング規約
5. [`docs/instructions/DESIGN_RULES.md`](docs/instructions/DESIGN_RULES.md) — UIデザインルール
6. [`docs/instructions/AI_WORKFLOW.md`](docs/instructions/AI_WORKFLOW.md) — 整合性チェックリスト

## 即座に守るべきルール（最重要）

- すべての APIルートに `export const runtime = 'edge'` を付ける
- D1へのアクセスは `getRequestContext().env.DB` 経由のみ
- `any` 型を使わない
- ゼミ種別の色は `lib/types.ts` の `SEMINAR_TYPES` から参照する（ハードコード禁止）
- 作業完了後は `docs/instructions/AI_WORKFLOW.md` のチェックリストを実行する

## プロジェクト概要

Next.js 14 + Cloudflare Pages + D1 で構築された研究室ゼミ予定管理カレンダー。  
ゼミ種別: `rinudoku`（輪読）/ `zentai`（全体）/ `kenkyu`（研究共有）  
担当者ロール: A（発表・進行）/ B（記録）/ C（資料・補佐）
