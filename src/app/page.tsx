// このファイルはアプリのトップページ（サーバーコンポーネント）です。
// サーバー側でカテゴリと当月の取引を取得し、クライアントコンポーネントへ渡します。
import { TransactionDrawer } from '@/components/transaction-drawer'
import TransactionsList from '@/components/transactions-list'
import { Card } from '@/components/ui/card'
import { Tables } from '@/utils/supabase/database.types'
import { createClient } from '@/utils/supabase/server'

type Tx = {
  id: string
  date: string
  title: string
  category: string
  amount: number
  type: 'income' | 'expense'
}

// 通貨表示を日本円表記に整形する小さなヘルパー
const formatYen = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 })

export default async function Home() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select()
  const categoriesCount = categories?.length ?? 0
  // Supabase から当月の取引を取得する（サーバーサイドで実行）
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`
  const nextMonth = new Date(year, month, 1)
  const nextMonthStart = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`

  const { data: transactionsData } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startOfMonth)
    .lt('date', nextMonthStart)
    .order('date', { ascending: true })

  const transactions: Tx[] = (transactionsData ?? []).map((t: Tables<'transactions'>) => ({
    id: t.id,
    date: t.date,
    title: t.title,
    category:
      categories?.find((c: Tables<'categories'>) => c.id === t.category_id)?.name ?? '未分類',
    amount: t.amount,
    type: t.type,
  }))

  const incomeTotal = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const expenseTotal = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const balance = incomeTotal - expenseTotal

  return (
    <div className="min-h-screen bg-slate-50">
      {/* header */}
      <div className="fixed inset-x-0 top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">ynym-kakeibo</h1>
          <div className="text-sm text-slate-600">8月</div>
        </div>
      </div>

      <main className="mx-auto max-w-xl px-4 pt-20 pb-8">
        {/* summary card */}
        <Card className="mb-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">当月の差引</p>
              <p className="mt-1 text-2xl font-bold">{formatYen(balance)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">収入 {formatYen(incomeTotal)}</p>
              <p className="text-sm text-rose-600">支出 {formatYen(expenseTotal)}</p>
              <p className="mt-2 text-xs text-slate-500">カテゴリ数: {categoriesCount}</p>
            </div>
          </div>
        </Card>

        {/* quick actions */}
        <div className="mb-4 flex gap-2">
          <TransactionDrawer variant="income" />
          <TransactionDrawer variant="expense" />
        </div>

        <TransactionsList transactions={transactions} />

        {/* footer space for mobile */}
        <div className="h-24" />
      </main>
    </div>
  )
}
