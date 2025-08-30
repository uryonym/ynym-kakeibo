import { TransactionDrawer } from '@/components/transaction-drawer'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

// small helper to format currency
const formatYen = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 })

export default async function Home() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select()
  const categoriesCount = categories?.length ?? 0
  // Query transactions for the current month from Supabase
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

        {/* transactions list */}
        <Card className="p-0">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-medium">明細</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>内容</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="w-[120px] text-sm text-slate-600">
                      {t.date.slice(5)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{t.title}</div>
                      <div className="text-xs text-slate-500">{t.category}</div>
                    </TableCell>
                    <TableCell
                      className={`text-right text-sm ${t.type === 'income' ? 'text-green-600' : 'text-rose-600'}`}
                    >
                      {t.type === 'expense' ? '-' : ''}
                      {formatYen(t.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* footer space for mobile */}
        <div className="h-24" />
      </main>
    </div>
  )
}
