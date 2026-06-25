# 開発環境セットアップ

## 前提条件

- Node.js 20以上
- npm 10以上
- Firebaseプロジェクト
- Firestoreデータベース
- Firebase Admin SDKのサービスアカウントJSON

## 1. 依存パッケージをインストール

```bash
npm install
```

## 2. 環境変数を設定

```bash
cp .env.example .env.local
```

`.env.local` に次の値を設定します。

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

`FIREBASE_PRIVATE_KEY` はJSON内の秘密鍵を1行にし、改行を `\n` として保持します。

例:

```env
FIREBASE_PRIVATE_KEY="escaped-private-key-with-newlines"
```

## 3. 開発サーバーを起動

```bash
npm run dev
```

`http://localhost:3000` を開きます。

`npm run dev` は起動前に `.next` を削除し、ホットリロード用の開発キャッシュを作り直します。dev server起動中に `npm run build` を実行すると、同じ `.next` ディレクトリが上書きされ、CSS/JS chunkが404になってUIが崩れることがあります。

Do not run npm run build while the dev server is running.

## 4. 動作確認

dev serverを起動したまま確認する場合:

```bash
npm run check:dev
```

dev serverを停止して本番ビルドまで確認する場合:

```bash
npm run check
```

## 注意

- `.env.local` はコミットしないでください。
- サービスアカウントJSONもリポジトリに置かないでください。
- Firebase Admin SDKはサーバー側APIルートからのみ使います。
- アーキテクチャ、DB、環境変数、セットアップ手順を変える場合は `docs/PROJECT_CONTEXT.json` も更新してください。
