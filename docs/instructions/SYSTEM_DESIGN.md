# システム設計思想・アーキテクチャ原則

> 参照元: [INDEX.md](./INDEX.md)  
> 関連: [DATA_MODEL.md](./DATA_MODEL.md) | [CODING_STANDARDS.md](./CODING_STANDARDS.md)

---

## 設計思想

### 1. シンプルさを最優先する

本アプリは研究室メンバー（〜20人程度）が使う内部ツールです。  
過剰な抽象化・外部ライブラリ・認証機構は**導入しない**。  
「動く・速い・壊れない」を三原則とする。

### 2. インフラはCloudflareに全集約する

- ホスティング: Cloudflare Pages
- DB: Cloudflare D1（SQLite互換）
- Runtime: Edge（V8 Isolate）

Vercel・AWS・Supabase等を**混在させない**。インフラが分散するとデプロイと課金の複雑度が上がる。

### 3. サーバーサイドはAPIルートのみ

クライアントコンポーネントからDBに直接アクセスしない。  
すべてのデータアクセスは `/api/*` を経由する。

---

## Cloudflare Edge Runtime 制約（必ず守ること）

### 必須宣言

すべてのAPIルートファイルの先頭に記述:

```typescript
export const runtime = 'edge';
```

### 使用禁止API

| 禁止 | 理由 | 代替 |
|---|---|---|
| `fs`, `path` | Node.js固有 | 不要（DBはD1） |
| `crypto`（Node版） | Node.js固有 | `crypto.randomUUID()`（Web標準）はOK |
| `Buffer` | Node.js固有 | `Uint8Array` / `TextEncoder` |
| `process.env` 直接参照 | Edge非対応 | `getRequestContext().env` |

### D1アクセスの正しいパターン

```typescript
import { getRequestContext } from '@cloudflare/next-on-pages';
export const runtime = 'edge';

export async function GET() {
  const { env } = getRequestContext() as { env: CloudflareEnv };
  const result = await env.DB.prepare('SELECT * FROM seminars').all();
  return Response.json(result.results);
}
```

---

## アーキテクチャ原則

### レイヤー責務

```
UI Layer        components/         表示・操作のみ。ビジネスロジックを持たない
State Layer     CalendarApp.tsx     状態管理・APIコール・楽観的UI更新
API Layer       app/api/**          バリデーション・DBアクセス・エラーハンドリング
Data Layer      Cloudflare D1       永続化
```

### APIレスポンス規約

- 成功: `Response.json(data)` / 作成は `{ status: 201 }`
- 404: `Response.json({ error: 'Not found' }, { status: 404 })`
- 400: `Response.json({ error: '理由' }, { status: 400 })`
- 削除成功: `new Response(null, { status: 204 })`

### 状態管理方針

- Zustand・Redux等の状態管理ライブラリは**導入しない**
- `useState` + `useCallback` + `useEffect` で完結させる
- 楽観的UI更新: 保存成功後にローカル state を直接更新（再fetchしない）

---

## 将来の拡張に関する方針

以下は**現時点でスコープ外**。要件変更なく実装してはならない:

- 認証・権限管理
- リアルタイム同期（WebSocket等）
- Slack連携・通知
- 繰り返し予定の自動生成
- CSVエクスポート

追加したい場合は `docs/REQUIREMENTS.md` を先に更新し、チームで合意を取ること。
