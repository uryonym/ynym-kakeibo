## 応答

- チャット、エージェントの回答は常に日本語で行うこと。
- `src/components/ui` 配下のファイルは shadcn/ui によるコンポーネント群のため、編集は避けること（読み取りは可）。
- 新しく UI コンポーネントを作成する場合は `src/components/ui` 配下に作らないこと。
- コード内コメントは日本語で記述すること。

## プロジェクト概要（短め）

- フレームワーク: Next.js 15（App Router）
- 言語: TypeScript
- UI: Tailwind CSS + shadcn/ui
- DB: Supabase（@supabase/supabase-js）
- パッケージマネージャ: npm
- 重要なディレクトリ構成:
  - `src/app` - Next.js の App Router によるルートとサーバーコンポーネント
  - `src/components` - アプリ固有の UI コンポーネント（`ui` サブフォルダは shadcn のコンポーネント）
  - `src/utils` / `src/lib` - Supabase クライアントやユーティリティ
  - `src/app/api` - API ルート（サーバーサイド処理）

## 開発上のルール（必須）

- UI コンポーネントは基本的にクライアントコンポーネントとして `use client` を明示する。サーバーコンポーネントは `src/app` 配下で使用する。
- `src/components/ui` は shadcn のコンポーネント群なので直接編集しない。
- サーバーで取得できるデータ（カテゴリなど）は可能な限りサーバー側で取得し、クライアントではプロップ経由で受け渡すことで重複フェッチを避ける。
- API への副作用（作成/更新/削除）は `src/app/api` のエンドポイントを通す。
- 型チェックは `npx tsc --noEmit`、Lint は `npm run lint` で行うこと。

## 実装ヒント

- 既存の supabase クライアント: `src/utils/supabase/client.ts`（クライアント用）、`src/utils/supabase/server.ts`（サーバー用）を使い分ける。
- 日付や期間計算はサーバーコンポーネント内で行い、クライアントには結果だけ渡すとシンプル。
- 新しい機能を追加する際は、まず小さな型付きユニットテスト（または tsc チェック）を書いてから実装すると型の破壊を防げる。

## レビュー

- すべて日本語でレビューすること。
