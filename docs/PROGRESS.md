# 進捗管理

最終更新: 2026-06-24

---

## 現在のフェーズ: Phase 1 — 基盤構築

---

## マイルストーン

| フェーズ | 内容 | 期限 | 状態 |
|---------|------|------|------|
| Phase 1 | 基盤構築（環境・DB・基本CRUD） | 2026-07 | 進行中 |
| Phase 2 | UI改善・UX向上 | 未定 | - |
| Phase 3 | 機能拡張（バックログ消化） | 未定 | - |

---

## Phase 1 タスクリスト

### 環境・インフラ
- [x] Next.js + TypeScript + Tailwind CSS セットアップ
- [x] Cloudflare Pages + D1 設定（wrangler.toml）
- [x] D1スキーマ定義（migrations/0001_schema.sql）
- [x] CLAUDE.md・ドキュメント整備
- [ ] Cloudflare Pages デプロイ確認（本番URL取得）
- [ ] GitHub Actions CI設定（任意）

### コア機能
- [x] カレンダーUI（月表示）
- [x] ゼミ種別色分け（輪読/全体/研究共有）
- [x] 担当者A/B/C表示
- [x] ゼミ予定 API（GET/POST/PUT/DELETE）
- [x] メンバー API（GET/POST/PUT/DELETE）
- [x] ゼミ作成・編集モーダル
- [x] メンバー管理モーダル
- [ ] 動作確認（ローカルプレビューでCRUD全操作）
- [ ] 本番デプロイ後の動作確認

### 品質
- [ ] TypeScript型エラーゼロ確認（`npx tsc --noEmit`）
- [ ] ESLintエラーゼロ確認（`npm run lint`）

---

## 既知の課題・TODO

| # | 内容 | 優先度 |
|---|------|--------|
| BUG-01 | `npm run dev` でAPIが動作しない（Edge Runtimeのため、`npm run preview` が必要） | - |
| TODO-01 | 担当者入力時のメンバーサジェスト機能 | 中 |
| TODO-02 | 削除確認ダイアログの改善 | 低 |

---

## 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-06-24 | 初期コミット：基本CRUD・カレンダーUI実装 |
| 2026-06-24 | ドキュメント整備（CLAUDE.md, docs/）|
