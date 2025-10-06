# Tasks: 家計簿 — 月次収支記録とカテゴリ管理

# タスク: 家計簿 — 月次収支記録とカテゴリ管理

**入力**: `/specs/001-kakeibo/` の設計資料

## フェーズ 2: 初期 TDD セットアップ

- [ ] T001 バックエンドの初期化 (Python, uv)。依存: FastAPI, SQLAlchemy, alembic, pytest をインストールする
- [ ] T002 フロントエンドの初期化 (Next.js, TypeScript)。lint/format 設定を追加する
- [ ] T003 CI の設定: lint、型チェック、テストを実行するワークフローを用意する

## フェーズ 3: テストファースト（契約テスト）

- [ ] T004 [P] 契約テスト: POST /transactions (tests/contract/test_transactions_post.py)
- [ ] T005 [P] 契約テスト: GET /transactions?month=YYYY-MM (tests/contract/test_transactions_get.py)
- [ ] T006 [P] 契約テスト: POST /categories (tests/contract/test_categories_post.py)

## フェーズ 4: コア実装

- [ ] T007 [P] DB モデルを作成: Transaction, Category (`backend/models`)
- [ ] T008 [P] マイグレーション作成（alembic）
- [ ] T009 [P] POST /transactions エンドポイント実装
- [ ] T010 [P] GET /transactions エンドポイント実装（month フィルタ + サマリ）
- [ ] T011 [P] POST /categories, PUT /categories 実装
- [ ] T012 [P] カテゴリ削除ガードを実装（取引が存在する場合は 409 を返す）

## フェーズ 5: フロントエンド

- [ ] T013 [P] カテゴリ管理 UI を作成
- [ ] T014 [P] 取引入力 UI と月切替コンポーネントを作成
- [ ] T015 [P] 月次合計と残高を表示する UI を作成

## フェーズ 6: 補完 & ドキュメント

- [ ] T016 クイックスタートとドキュメントの整備
- [ ] T017 CSV エクスポート用エンドポイントを追加
- [ ] T018 単体テストと統合テストを追加
