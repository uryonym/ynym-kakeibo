// カテゴリ
export type Category = { id: string; name: string; seq: number }

// トランザクション
export type TransactionType = 'income' | 'expense'
export type Transaction = {
  id: string
  date: string
  title: string
  type: TransactionType
  category_id: string
  amount: number
}
