// 共通で利用する型定義をまとめたファイルです。
// データベースの型は自動生成された `database.types.ts` を参照して再利用します。
import type { Tables, Enums } from './supabase/database.types'

// DB の行レコード型
export type DbTransaction = Tables<'transactions'>
export type DbCategory = Tables<'categories'>

// 列挙型（transaction.type の 'income' | 'expense'）
export type TransactionType = Enums<'transaction_type'>

// フロント用途のトランザクション表示用型
export type UiTransaction = {
  id: string
  date: string
  title: string
  category: string
  amount: number
  type: TransactionType
}

// カテゴリの最小表現
export type Category = { id: string; name: string }
