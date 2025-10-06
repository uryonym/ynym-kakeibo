## データモデル: 家計簿 — トランザクションとカテゴリ

## エンティティ

### Transaction (取引)

- id: UUID (主キー)
- title: string (最大 100 文字)
- category_id: UUID (外部キー → Category.id)
- amount: decimal(10,0) # JPY（小数桁なし）
- type: enum {INCOME, EXPENSE}
- date: date (ISO 8601)
- note: text (任意)
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp (nullable) # ソフトデリート用
- deleted_by: string (任意)

### Category (カテゴリ)

- id: UUID (主キー)
- name: string (最大 50 文字)
- color: string (任意)
- order_index: integer (任意)
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp (nullable)

### MonthSummary (派生)

- month: YYYY-MM
- total_income: decimal(10,0)
- total_expense: decimal(10,0)
- balance: decimal(10,0)

## インデックス

- transactions: date, category_id, deleted_at に対するインデックス
- categories: deleted_at IS NULL の場合の name に対するユニークインデックス

## 制約とバリデーション

- amount >= 0
- title は必須で最大長 100
- category_id は既存のカテゴリを参照すること（未分類を許可する場合は別途定義）

## 備考

- 全ての ID に UUID を用いる
- ソフトデリートは deleted_at で実装する
