# UIデザインルール

> 参照元: [INDEX.md](./INDEX.md)  
> 関連: [DATA_MODEL.md](./DATA_MODEL.md)（ゼミ種別の色はSSOT）

---

## デザイン原則

1. **情報密度を最優先する** — カレンダーは限られたスペースに予定と担当者を詰める。余白より密度
2. **モバイルファースト** — iPhone SE（375px）を基準に設計し、デスクトップで広げる
3. **一貫したインタラクション** — hover, focus, active の状態を必ずすべて定義する
4. **日本語フォント最適化** — システムフォント（Hiragino/Meiryo）を使用。Webフォントは導入しない

---

## カラーパレット

### ゼミ種別カラー（DATA_MODEL.md と完全同期すること）

| 種別 | ベース色 | bg | text | border | dot |
|---|---|---|---|---|---|
| 輪読ゼミ（rinudoku） | Indigo | `bg-indigo-100` | `text-indigo-800` | `border-indigo-200` | `bg-indigo-500` |
| 全体ゼミ（zentai） | Violet | `bg-violet-100` | `text-violet-800` | `border-violet-200` | `bg-violet-500` |
| 研究共有（kenkyu） | Teal | `bg-teal-100` | `text-teal-800` | `border-teal-200` | `bg-teal-500` |

> **変更禁止**: 色は `lib/types.ts` の `SEMINAR_TYPES` で一元管理。ここのテーブルを変更したら `SEMINAR_TYPES` も必ず同期すること。

### UIシステムカラー

| 用途 | Tailwindクラス |
|---|---|
| プライマリアクション | `bg-indigo-600` / `hover:bg-indigo-700` |
| プライマリ無効状態 | `bg-indigo-300` |
| 破壊的アクション | `text-red-500` / 確認後 `bg-red-600` |
| ボーダー（標準） | `border-gray-200` |
| 背景（カード） | `bg-gray-50` |
| 背景（ホバー） | `hover:bg-indigo-50/30` |
| 今日の日付 | `bg-indigo-600 text-white`（丸） |

---

## タイポグラフィ

| 役割 | クラス |
|---|---|
| ページタイトル | `text-base font-bold text-gray-900` |
| セクション見出し | `text-lg font-semibold text-gray-900` |
| ラベル（フォーム） | `text-xs font-semibold text-gray-600 uppercase tracking-wide` |
| 本文 | `text-sm text-gray-700` |
| 補助テキスト | `text-xs text-gray-500` |
| プレースホルダー | `placeholder-gray-300` |

---

## スペーシング・レイアウト

### ヘッダー・フッター

```
px-4 sm:px-6 py-3   // ヘッダー水平パディング
px-5 py-4           // モーダル内パディング
```

### カレンダーセル

```
minHeight: 100px    // grid-auto-rows の最小値（gridAutoRows: 'minmax(100px, 1fr)'）
p-1.5 sm:p-2        // セル内パディング
space-y-0.5         // イベントカード間のスペース
```

### モーダル幅

```
w-full sm:w-[420px]   // ゼミ予定モーダル
w-full sm:w-[380px]   // メンバー管理モーダル
```

---

## インタラクション・アニメーション

### フェードインアニメーション

モーダル・パネルに適用:
```css
/* globals.css に定義済み */
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out;
}
```

### ホバー・フォーカス状態

```
transition-colors       // 色変化（hover等）
transition-all          // 複数プロパティ（スケール含む）
duration-150            // 標準速度
active:scale-95         // クリック時の押し込み感
```

### ボタンのフォーカスリング

```
focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
```

---

## レスポンシブ戦略

| ブレークポイント | 幅 | 主な変化 |
|---|---|---|
| デフォルト（モバイル） | 〜639px | ハンバーガーなし、カードは最小表示 |
| `sm:` | 640px〜 | モーダルが右パネルに、legend表示 |
| `md:` | 768px〜 | カレンダーセルが広がる |

### hidden/inline の使い方

```typescript
// ✅ モバイルで省略するUI補助テキスト
<span className="hidden sm:inline">メンバー管理</span>

// ❌ 担当者名を hidden にしてはならない（情報として重要）
// SeminarCardの担当者は常時表示すること
```

---

## アクセシビリティ

- インタラクティブ要素には必ず `aria-label` または `title` を付与
- モーダルには `role="dialog"` と `aria-modal="true"`
- フォームのラベルは `<label>` タグを使う（placeholderのみに頼らない）
- 色だけで意味を伝えない（ゼミ種別は色 + テキストラベルの両方を表示）
