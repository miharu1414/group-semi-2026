# AI作業ワークフロー・整合性管理

> 参照元: [INDEX.md](./INDEX.md)  
> **このファイルはAIが作業完了時に必ず実行するチェックリストです。**

---

## 作業開始プロトコル

1. `docs/instructions/INDEX.md` を読む（このマップを把握する）
2. 作業内容に対応する専門ファイルを読む
3. 変更対象コードの現状を確認してから手を動かす

---

## 作業完了チェックリスト

### 変更の種類に応じて確認する

#### DBスキーマ変更時

- [ ] `migrations/` に連番ファイル（例: `0002_xxxx.sql`）を作成した
- [ ] `lib/types.ts` のインターフェース・型と整合している
- [ ] `docs/instructions/DATA_MODEL.md` のリファレンスを更新した
- [ ] `docs/ARCHITECTURE.md` のDBスキーマセクションを更新した

#### APIエンドポイント変更時

- [ ] すべてのAPIルートに `export const runtime = 'edge'` がある
- [ ] `lib/api.ts` のクライアント関数と対応している
- [ ] `docs/ARCHITECTURE.md` のAPI一覧テーブルを更新した

#### UIコンポーネント変更時

- [ ] `DESIGN_RULES.md` のルールに従っている
- [ ] ゼミ種別の色は `lib/types.ts` の `SEMINAR_TYPES` から参照している（ハードコード禁止）
- [ ] モバイル（375px）とデスクトップ両方で表示を確認した

#### ゼミ種別・担当者ロール変更時

- [ ] `docs/instructions/DATA_MODEL.md` を先に更新した
- [ ] `lib/types.ts` の `SeminarType` と `SEMINAR_TYPES` を更新した
- [ ] `migrations/` にCHECK制約変更のSQLを追加した
- [ ] `DESIGN_RULES.md` のゼミ種別カラーテーブルを更新した

#### 新しいライブラリ追加時

- [ ] `package.json` の依存関係を確認した
- [ ] `CLAUDE.md` の Tech Stack テーブルを更新した
- [ ] Edge Runtimeで動作するライブラリか確認した

---

## ドキュメント責務マップ（何をどこに書くか）

| 書く内容 | 書く場所 | 書いてはいけない場所 |
|---|---|---|
| ゼミ種別の定義 | `DATA_MODEL.md` | どこか別の場所（SSOTを守る） |
| 担当者A/B/Cの意味 | `DATA_MODEL.md` | どこか別の場所 |
| APIエンドポイント一覧 | `ARCHITECTURE.md` | — |
| DB構造のリファレンス | `DATA_MODEL.md` | — |
| Edge制約の説明 | `SYSTEM_DESIGN.md` | — |
| TypeScriptの書き方 | `CODING_STANDARDS.md` | — |
| Tailwindクラスのルール | `DESIGN_RULES.md` | — |
| 進捗・変更履歴 | `docs/PROGRESS.md` | — |
| 実装コマンド詳細 | `CLAUDE.md` | — |

---

## ドキュメント間の参照ルール

- 同じ情報を2箇所以上に書かない（SSOTの維持）
- 参照が必要な場合は「→ `ファイル名` を参照」と書いてリンクする
- 矛盾を発見したら：SSOTのファイルを正として他を修正する

### SSOTの優先順位

```
DATA_MODEL.md（最上位）
  ↓ 参照される
lib/types.ts / migrations/*.sql
  ↓ 参照される
DESIGN_RULES.md / ARCHITECTURE.md
  ↓ 参照される
CLAUDE.md / GEMINI.md / .cursorrules / copilot-instructions.md
```

---

## AI間の引き継ぎルール

複数のAIが同一プロジェクトを作業する場合:

1. **作業前**: `docs/PROGRESS.md` で直近の変更を確認する
2. **作業中**: 他のAIが触れたファイルを上書きする前に差分を確認する
3. **作業後**: `docs/PROGRESS.md` に変更内容を追記する（日付・変更概要）

---

## よくあるミスと対処法

| ミス | 正しい対処 |
|---|---|
| APIルートに `runtime = 'edge'` を忘れた | 全APIルートファイルを検索して追加 |
| `result.results` でなく `result` をそのまま返した | D1の `.all()` は `{ results: T[] }` を返すことを思い出す |
| 色をハードコードした | `SEMINAR_TYPES[type].bgClass` 等を使う |
| 担当者名を `hidden sm:inline` にした | 担当者は情報として重要なので常時表示（`DESIGN_RULES.md` 参照） |
| SSOTではないファイルを更新した | `DATA_MODEL.md` を先に更新してから伝播させる |
