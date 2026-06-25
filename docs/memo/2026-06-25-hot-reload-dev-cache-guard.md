# 2026-06-25 hot-reload-dev-cache-guard

## 実施内容

- `npm run dev` の前に `.next` を削除し、Next.jsのホットリロード用キャッシュをクリーンにするようにした。
- dev server起動中に `npm run build` を実行しないよう、`prebuild` ガードを追加した。
- `scripts/clean-next-dev-cache.mjs`、`scripts/assert-dev-server-stopped.mjs`、`scripts/local-dev-guard.mjs` を追加した。
- README、SETUP、GOVERNANCE、AI別入口にdev server起動中のbuild禁止ルールを追記した。
- dev server起動中でも安全に使える `npm run check:dev` と `npm run typecheck` を追加した。

## 原因

dev server起動中に `npm run build` を実行すると、Next.jsが同じ `.next` ディレクトリを本番ビルド用に上書きする。これにより、dev serverが参照しているHMR用のCSS/JS chunkが404になり、ローカルUIがCSS/JSなしで崩れて表示される。

## 再発防止

- ローカル表示確認は `npm run dev` を使う。
- 本番ビルド確認はdev serverを止めてから `npm run build` を実行する。
- dev serverが動いている場合、`npm run build` はエラーで停止する。
- dev server起動中の確認は `npm run check:dev` を使う。
