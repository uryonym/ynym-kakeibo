# Tasks: 家計簿 — 月次収支記録とカテゴリ管理

# タスク: 家計簿 — 月次収支記録とカテゴリ管理

**入力**: `/specs/001-kakeibo/` の設計資料
**前提**: `plan.md`（必須）、`research.md`、`data-model.md`、`contracts/`、`quickstart.md`

## 実行フロー（概要）

1. `plan.md` を読み、プロジェクト構成（frontend + backend）を確認する
2. `data-model.md` を読み、エンティティ（Transaction, Category, MonthSummary）を抽出する
3. `contracts/` を読み、エンドポイント（/transactions, /categories）を抽出する
4. `quickstart.md` を読み、スモークシナリオを把握する

## 形式: `[ID] [P?] 説明`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- 各タスクには正確なファイルパスを含める

---

## フェーズ 2: セットアップ（必須 — 最初に実行）

- [ ] T001 バックエンド初期化（Python + FastAPI）

  - パス: `/backend/`（存在しない場合は作成）
  - 作業内容:
    1. `pyproject.toml` を作成または更新して FastAPI, SQLAlchemy, alembic, psycopg[binary], pydantic, uvicorn, pytest を追加
    2. `backend/src/` 配下に `models/`, `services/`, `api/`, `tests/` を作成
    3. `backend/.env.example` に `DATABASE_URL` を追加
  - 理由: TDD と実装の準備のため

- [ ] T002 フロントエンド初期化（Next.js + TypeScript）

  - パス: `/frontend/`（存在するか検証）
  - 作業内容:
    1. `package.json` に Next.js, React, TypeScript, ESLint, Prettier を含める
    2. `frontend/tsconfig.json`、ESLint / Prettier 設定を追加
  - 理由: UI 関連タスクの前提

- [ ] T003 CI 設定（GitHub Actions）
  - パス: `/.github/workflows/ci.yml`
  - 作業内容:
    1. push/PR で lint, typecheck, pytest を実行するワークフローを追加
    2. 後段で契約テストを実行するジョブを用意（結果アーティファクトを保存）
  - 理由: 品質ゲートを早期に適用するため

---

## フェーズ 3: テストファースト（契約テスト・統合テスト） — 先に作成して失敗させる

**ルール**: 契約テストは実装より先に作成し、失敗することを前提とする（TDD）

- [ ] T004 [P] 契約テスト: POST /transactions

  - パス: `specs/001-kakeibo/tests/contract/test_transactions_post.py`
  - 検証内容: `contracts/openapi.yaml` の `TransactionCreate` に合致するリクエストで 201 を返すこと
  - テスト手順（LLM 実行可能）:
    1. POST `/transactions` に JSON {"title":"ランチ","category_id":<uuid>,"amount":800,"type":"EXPENSE","date":"2025-10-05","note":""} を送る
    2. ステータス 201 とレスポンスに `id` (UUID) が含まれることを期待する

- [ ] T005 [P] 契約テスト: GET /transactions?month=YYYY-MM

  - パス: `specs/001-kakeibo/tests/contract/test_transactions_get.py`
  - 検証内容: ステータス 200、取引の配列と月次合計（total_income/total_expense/balance）を含むこと
  - テスト手順:
    1. 事前に少なくとも 1 件の取引が存在すること（フィクスチャまたは POST）
    2. GET `/transactions?month=2025-10` を実行し、作成済み取引と合計が正しいことを検証

- [ ] T006 [P] 契約テスト: POST /categories

  - パス: `specs/001-kakeibo/tests/contract/test_categories_post.py`
  - 検証内容: `CategoryCreate` に合致するリクエストで 201 を返すこと

- [ ] T007 [P] 統合テスト: カテゴリ削除ガード
  - パス: `specs/001-kakeibo/tests/integration/test_category_delete_guard.py`
  - 検証内容: 取引が紐づくカテゴリを DELETE したときに 409 が返ること

---

## フェーズ 4: コア実装（テストに合わせて実装）

**注意**: テストが存在し失敗することを確認してから実装を開始する

- [ ] T008 [P] DB モデル: Transaction, Category, MonthSummary

  - パス: `backend/src/models/transaction.py`, `backend/src/models/category.py`, `backend/src/models/month_summary.py`
  - 作業内容:
    1. `data-model.md` に沿った SQLAlchemy モデルを作成（UUID 主キー、amount は decimal(10,0)、ソフトデリート字段）
    2. `date`, `category_id`, `deleted_at` に対するインデックスを追加

- [ ] T009 [P] Alembic マイグレーション作成

  - パス: `backend/alembic/versions/`（新規マイグレーションファイル）
  - 作業内容:
    1. `transactions`, `categories` テーブル作成マイグレーションを作成

- [ ] T010 POST /transactions エンドポイント実装（バックエンド）

  - パス: `backend/src/api/transactions.py`
  - 作業内容:
    1. `TransactionCreate` に対応する Pydantic スキーマで入力検証を行う
    2. レコードを挿入し、作成された UUID を含む 201 を返す
  - 依存: T008, T009

- [ ] T011 GET /transactions エンドポイント実装（月フィルタ + サマリ）

  - パス: `backend/src/api/transactions.py`
  - 作業内容:
    1. `?month=YYYY-MM` クエリを受け取り、（ローカルタイムゾーン基準で）月次合計を計算
    2. 取引一覧と合計（income, expense, balance）を返す
  - 依存: T008, T009

- [ ] T012 POST /categories と PUT /categories 実装

  - パス: `backend/src/api/categories.py`
  - 作業内容:
    1. カテゴリ作成・更新エンドポイントを実装
    2. `deleted_at IS NULL` の条件下で name をユニークにする制約を守る

- [ ] T013 DELETE /categories/{id} のガード実装（取引があれば 409 を返す）
  - パス: `backend/src/api/categories.py`
  - 作業内容:
    1. 削除時に該当カテゴリに紐づく未削除の取引があるか確認し、あれば 409 を返す
  - 依存: T008, T009, T012

---

## フェーズ 5: フロントエンド（UI）

- [ ] T014 [P] カテゴリ管理 UI（一覧・作成・更新）

  - パス: `frontend/src/components/Category/*`, `frontend/src/pages/categories/*`
  - 作業内容:
    1. カテゴリ作成/更新フォームを作る
    2. カテゴリ一覧を表示し、削除時の 409 を適切に処理する
  - 依存: T012, T013（バックエンドのエンドポイント）

- [ ] T015 [P] 取引入力 UI と月切替コンポーネント

  - パス: `frontend/src/components/TransactionForm/*`, `frontend/src/components/MonthSwitcher/*`, `frontend/src/pages/index.tsx`
  - 作業内容:
    1. 取引作成フォームを作る
    2. 月切替で `/transactions?month=YYYY-MM` を叩く
  - 依存: T010, T011

- [ ] T016 [P] 月次合計と残高を表示する UI
  - パス: `frontend/src/components/MonthlySummary/*`
  - 作業内容:
    1. GET /transactions のレスポンスを使って total_income, total_expense, balance を表示
  - 依存: T011

---

## フェーズ 6: 統合・補完・ドキュメント

- [ ] T017 DB 接続とトランザクション管理

  - パス: `backend/src/services/db.py`
  - 作業内容:
    1. `DATABASE_URL` を用いた SQLAlchemy エンジン設定
    2. セッション管理と接続プーリング
  - 依存: T008

- [ ] T018 監査ログとソフトデリートのサポート

  - パス: `backend/src/services/audit.py`（モデルは既に用意）
  - 作業内容:
    1. 作成/更新/削除操作で監査記録を残す
    2. ハードデリートではなく `deleted_at` を設定する
  - 依存: T008

- [ ] T019 [P] 単体テスト（モデル・サービス）

  - パス: `backend/tests/unit/`, `frontend/tests/unit/`
  - 作業内容:
    1. モデルバリデーションやサービスロジックの pytest 単体テストを追加

- [ ] T020 CSV エクスポートエンドポイント

  - パス: `backend/src/api/export.py`
  - 作業内容:
    1. 月次取引を CSV で出力するエンドポイントを実装
  - 依存: T011

- [ ] T021 [P] Quickstart とドキュメント更新

  - パス: `specs/001-kakeibo/quickstart.md`, `docs/` または `README.md`
  - 作業内容:
    1. 実行コマンド例とリクエスト例を含めて quickstart を更新

- [ ] T022 パフォーマンス用スモークテスト
  - パス: `specs/001-kakeibo/tests/perf/`
  - 作業内容:
    1. 月次の典型的な負荷を模した簡易スクリプトを作成し応答時間を計測

---

## 並列実行例

グループ 1（並列可）: T004, T005, T006, T007（契約テストと統合テストの作成）

グループ 2（モデル作成後に並列可）: T008, T009（モデル + マイグレーション）

実行例（LLM が実行できるコマンド）:

- T004 を実行: `python -m pytest specs/001-kakeibo/tests/contract/test_transactions_post.py -q`
- T010 を実行: `uvicorn backend.src.api.transactions:app --reload`

## 依存関係サマリ

- セットアップ（T001-T003）がテスト（T004-T007）より先
- テスト（T004-T007）はコア実装（T008-T013）より先
- モデル（T008）は DB 接続（T017）より先
- エンドポイント（T010-T013）はフロントエンド（T014-T016）より先
- 全ては補完フェーズ（T019-T022）より先

## バリデーションチェックリスト

- [ ] `specs/001-kakeibo/contracts/` の全契約ファイルに対応する契約テストがある
- [ ] `data-model.md` の全エンティティに対するモデルタスクがある
- [ ] 実装より先にテストが作成されている
- [ ] 各タスクに正確なファイルパスが記載されている
