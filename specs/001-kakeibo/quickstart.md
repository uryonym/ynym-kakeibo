## Quickstart — 家計簿（スモークテスト）

このドキュメントは、家計簿機能がエンドツーエンドで動作することを素早く確認するための最小限の手順（スモークテスト）を示します。

### 前提条件

- PostgreSQL が稼働し、テスト用データベースが準備されていること
- バックエンド用の環境変数（例: DATABASE_URL）が設定されていること
- マイグレーションが適用できる状態であること

### 手順

1. マイグレーションを実行してスキーマを適用する（`transactions`, `categories` テーブルが作成される）
2. バックエンドを起動する（FastAPI + Uvicorn）
3. フロントエンドを起動する（Next.js, `frontend/`）
4. ブラウザか REST クライアントで以下を実行して挙動を確認する:
   - POST /categories でカテゴリを作成（例: { "name": "食費" }）
   - POST /transactions で取引を作成（例: { "title": "ランチ", "amount": 1200, "type": "EXPENSE", "date": "2025-10-05", "category_id": <id> }）
   - GET /transactions?month=YYYY-MM で当該月の取引一覧と合計が正しく返ることを確認する
5. 該当カテゴリを削除しようとした場合、該当カテゴリに紐づく取引が存在する場合は 409 Conflict が返ることを確認する

### スモークアサーション

- POST /categories は 201 を返す
- POST /transactions は 201 を返し、レスポンスに作成された取引の id を含む
- GET /transactions?month=YYYY-MM は作成した取引を含むリストを返す
- DELETE /categories/:id は該当カテゴリに取引がある場合 409 を返す

### 備考

- 月境界の計算はユーザーのローカルタイムゾーンを用いる（仕様で合意済み）
