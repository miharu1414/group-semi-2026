# Instructions INDEX — AIエージェント共通ガイドマップ

このファイルはすべてのAIエージェントが**最初に読む**エントリポイントです。  
作業内容に応じて、以下の専門ファイルを参照してください。

---

## ドキュメント一覧と責務

| ファイル | 責務 | 読むタイミング |
|---|---|---|
| **このファイル** | 全体マップ・ルーティング | 作業開始時に必ず |
| [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) | 設計思想・Edge制約・アーキテクチャ原則 | 構成変更・API追加時 |
| [CODING_STANDARDS.md](./CODING_STANDARDS.md) | TypeScript規約・命名・Reactパターン | コード変更時 |
| [DESIGN_RULES.md](./DESIGN_RULES.md) | UIデザイン・Tailwind色・アニメーション | UIコンポーネント変更時 |
| [DATA_MODEL.md](./DATA_MODEL.md) | DB・型定義・ゼミ種別定義（SSOT） | DBやEnum変更時 |
| [AI_WORKFLOW.md](./AI_WORKFLOW.md) | AI間整合性・チェックリスト・更新ルール | 作業完了時に必ず |

---

## プロジェクト一行サマリー

**班ゼミカレンダー 2026** — 研究室の輪読ゼミ・全体ゼミ・研究共有会の予定と担当者（A/B/C）を管理するWebアプリ。Next.js 14 + Cloudflare Pages + D1で構成。

---

## AIツール別の読み込みファイル

各AIは自身の専用ファイルを自動で読み込み、そこからこのINDEXへ誘導されます。

| AIツール | 専用ファイル |
|---|---|
| Claude Code | `CLAUDE.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Cursor | `.cursor/rules/main.mdc` |
| Gemini CLI | `GEMINI.md` |

---

## 絶対に守るルール（全AI共通）

1. **DATA_MODEL.mdがSSOT** — ゼミ種別・担当者ロールの定義はここだけで管理する
2. **作業完了時はAI_WORKFLOW.mdのチェックリストを実行する**
3. **矛盾を発見したら同一セッション内で解消する**（後回し禁止）
