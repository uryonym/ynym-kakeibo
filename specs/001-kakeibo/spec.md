# Feature Specification: 家計簿 — 月次収支記録とカテゴリ管理

**Feature Branch**: `001-kakeibo`
**Created**: 2025-10-05
**Status**: Draft
**Input**: User description: "家計簿アプリを作成したいです。機能としては項目名、カテゴリを選択して収入・支出を入力すると記録されていく。入力した情報は月ごとに表示される。任意の月に切り替えることができる。入力した収支の情報から、それぞれの合計値と差額が表示される。選択するカテゴリをメンテナンスする画面も必要。ログイン機能は不要。"

## Execution Flow (main)

1. Parse user description from Input → Extract scope: monthly transactions, category management, no auth.
2. Extract key concepts: Transaction creation, Month view, Month switching, Totals (income/expense/balance), Category CRUD, Anonymous usage.
3. For each unclear aspect: mark with [NEEDS CLARIFICATION].
4. Fill User Scenarios & Testing section.
5. Generate Functional Requirements (testable).
6. Identify Key Entities.
7. Run Review Checklist and mark unresolved clarifications.

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY.
- ❌ Avoid HOW to implement here (keep tech details minimal; implementation will follow in plan).
- When a detail is omitted by the user, mark with [NEEDS CLARIFICATION].

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

一般利用者は、項目名（例: 給料、食費）とカテゴリを選択し、収入または支出の金額を入力して保存できる。保存された取引は月単位で集約され、合計（収入合計、支出合計）と差額（収入 - 支出）が一覧で確認できる。ユーザーは任意の月に切り替えて過去月や別月のデータを閲覧できる。

### Acceptance Scenarios

1. **Given** 初期画面（当月）が表示されている、 **When** 新しい支出を「食費」カテゴリで 1,200 を入力して保存する、 **Then** 当月の取引リストに新しい項目が表示され、支出合計に 1,200 が加算され、差額が更新される。
2. **Given** ある月（例: 2025-09）が表示されている、 **When** 月切替で 2025-08 を選択する、 **Then** 2025-08 の取引とその合計・差額が表示される。
3. **Given** カテゴリ管理画面、 **When** 新しいカテゴリ「交際費」を追加する、 **Then** トランザクション作成時に「交際費」が選択可能になる。
4. **Given** 既存の取引、 **When** 取引を編集してカテゴリや金額を変更する、 **Then** 変更内容が保存され、該当月の合計/差額が再計算される。
5. **Given** ログイン不要で匿名利用、 **When** ユーザーが別の端末/ブラウザでアクセスする、 **Then** [NEEDS CLARIFICATION: データの同期・永続化方式（サーバ保存 / ローカルのみ / 局所キャッシュ + サーバ同期）を決定する必要がある]

### Edge Cases

- 同一日に複数の同額取引が登録された場合、一覧で区別できる（ID/タイムスタンプを保持）。
- 不正な数値（極端に大きい値、文字列など）は入力バリデーションで弾く。
- 月にデータがない場合、明示的に「データがありません」を表示する。
- カテゴリが削除された場合の過去取引の扱い（再割当／未分類化）は要定義。[NEEDS CLARIFICATION]

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: トランザクション作成
  - システムはトランザクションを作成できる。必須フィールド: title (string)、category_id、amount (decimal)、type (INCOME|EXPENSE)、date (ISO 8601)。任意: note。
- **FR-002**: 月別一覧表示
  - システムは指定した月のトランザクション一覧を返すこと。API/画面は対象月の開始日〜終了日範囲でフィルタする。
- **FR-003**: 月切替と集計表示
  - UI はユーザーが任意の月へ切り替え可能とし、表示は total_income、total_expense、balance を含むこと。
- **FR-004**: カテゴリ管理
  - システムはカテゴリの追加・編集・削除をサポートする。カテゴリは name（必須）を持つ。
- **FR-005**: 認証不要
  - 本機能はログインを要求しない（ANONYMOUS MODE）。ただしデータ永続化/共有方法は別途決定する（FR-006）。
- **FR-006**: データ永続化方式
  - デフォルト想定はサーバサイド永続化（バックエンド DB）。オフライン対応やローカルオンリーの場合は [NEEDS CLARIFICATION]。
- **FR-007**: 通貨と精度
  - 金額は小数点 2 桁で扱う。単一通貨前提か多通貨対応かは [NEEDS CLARIFICATION]。
- **FR-008**: 即時反映
  - すべての作成・編集・削除は一覧表示と集計に直ちに反映される。
- **FR-009**: エラーハンドリング
  - API は整形式のエラーレスポンスを返し、フロントは適切にユーザへ通知する。
- **FR-010**: 入力検証
  - クライアントとサーバ双方で必須フィールド/金額のバリデーションを行う。

### Non-functional Requirements

- 読み取り性能: 月当たり 1,000 件程度の取引を想定しても UI は 200ms 未満で応答すること（詳細は要合意）。[NEEDS CLARIFICATION]
- 可用性: 基本的に単一リージョンの SaaS 想定、バックアップ方針は別途定義。

---

### Key Entities

- **Transaction**

  - id: UUID
  - title: string
  - category_id: UUID
  - amount: decimal(10,2)
  - type: enum {INCOME, EXPENSE}
  - date: date (ISO 8601)
  - note: text (optional)
  - created_at, updated_at

- **Category**

  - id: UUID
  - name: string
  - color: string (optional)
  - order_index: integer (optional)
  - created_at, updated_at

- **MonthSummary** (derived)
  - month: YYYY-MM
  - total_income: decimal
  - total_expense: decimal
  - balance: decimal

---

## Review & Acceptance Checklist

### Content Quality

- [x] ユーザーの要望に基づいた主要機能を網羅している
- [x] 実装の HOW を過度に含めていない（DB 種類等は別途決定）

### Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [x] 要件は測定可能でテスト可能な形で定義されている
- [x] スコープは「月次記録・カテゴリ管理と合計表示」に限定されている

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

# Notes

- 次のステップ: スペックが確定したら `/plan` コマンドでプランを作成し、契約テストと tasks を自動生成します。
- 推奨: データ永続化方針（サーバ保存 or ローカルオンリー）と通貨要件を早めに決定してください。
