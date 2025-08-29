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

  // For now, mock transactions for the month. Later wire to DB.
  const transactions: Tx[] = [
    {
      id: '1',
      date: '2025-08-01',
      title: '給料',
      category: '収入',
      amount: 300000,
      type: 'income',
    },
    {
      id: '2',
      date: '2025-08-05',
      title: '家賃',
      category: '住居',
      amount: 80000,
      type: 'expense',
    },
    {
      id: '3',
      date: '2025-08-10',
      title: '食費',
      category: '食費',
      amount: 15000,
      type: 'expense',
    },
    {
      id: '4',
      date: '2025-08-20',
      title: '副業収入',
      category: '収入',
      amount: 20000,
      type: 'income',
    },
    {
      id: '5',
      date: '2025-08-25',
      title: '公共料金',
      category: '光熱費',
      amount: 8000,
      type: 'expense',
    },
  ]

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
