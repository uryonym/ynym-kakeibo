// このファイルはアプリのトップページ（サーバーコンポーネント）です。
// サーバー側でカテゴリと当月の取引を取得し、クライアントコンポーネントへ渡します。
import { redirect } from 'next/navigation'

import MonthSelector from '@/components/month-selector'
import { TransactionDrawer } from '@/components/transaction-drawer'
import TransactionsList from '@/components/transactions-list'
import { Card } from '@/components/ui/card'
import { formatYMDSlash } from '@/utils/date'
import { formatYen } from '@/utils/format'
import { createClient } from '@/utils/supabase/server'
import type { DbTransaction, UiTransaction } from '@/utils/types'

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()
  // サーバー側で現在のユーザーを取得し、未ログインであればログインフォームを表示する
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // 未ログインなら /login ページへリダイレクト
    redirect('/login')
  }
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('seq', { ascending: true })
  const categoriesCount = categories?.length ?? 0
  // サーバーで取得した categories をそのままクライアントへ渡す
  // Supabase から当月の取引を取得する（サーバーサイドで実行）
  // 表示する年月を searchParams から取得。形式は YYYY-MM
  // Next のランタイム要件により searchParams は await してから使用する
  const sp = (await Promise.resolve(searchParams)) as Record<string, string | string[] | undefined>
  const ymParam = Array.isArray(sp?.ym) ? sp.ym[0] : sp?.ym
  const now = new Date()
  const defaultYear = now.getFullYear()
  const defaultMonth = now.getMonth() + 1
  let year = defaultYear
  let month = defaultMonth

  if (ymParam && typeof ymParam === 'string') {
    const [yStr, mStr] = ymParam.split('-')
    const y = Number(yStr)
    const m = Number(mStr)
    if (!Number.isNaN(y) && !Number.isNaN(m) && m >= 1 && m <= 12) {
      year = y
      month = m
    }
  }

  // 給与日が毎月25日のため、選択した年月 (year-month) の当月は
  // start = (year, month-1, 25) のように前月25日から当月24日までの期間とする
  // 例: 2025-09 を選択 -> 2025-08-25 から 2025-09-24 を表示
  const startDate = new Date(year, month - 2, 25) // month-2 は前月（0-indexed）
  const endDate = new Date(year, month - 1, 24)
  const startOfPeriod = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`
  const endOfPeriodNext = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1)
  const endOfPeriodExclusive = `${endOfPeriodNext.getFullYear()}-${String(endOfPeriodNext.getMonth() + 1).padStart(2, '0')}-${String(endOfPeriodNext.getDate()).padStart(2, '0')}`

  const { data: transactionsData } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startOfPeriod)
    .lt('date', endOfPeriodExclusive)
    .order('date', { ascending: true })

  const transactions: UiTransaction[] = (transactionsData ?? []).map((t: DbTransaction) => ({
    id: t.id,
    date: t.date,
    title: t.title,
    category: categories?.find((c) => c.id === t.category_id)?.name ?? '未分類',
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

  const formattedStart = formatYMDSlash(startDate)
  const formattedEnd = formatYMDSlash(endDate)

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-xl px-4 pt-4 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <MonthSelector year={year} month={month} />
          <div className="text-sm text-slate-500">
            {formattedStart} 〜 {formattedEnd}
          </div>
        </div>
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
          <TransactionDrawer variant="income" categories={categories ?? []} />
          <TransactionDrawer variant="expense" categories={categories ?? []} />
        </div>

        <TransactionsList transactions={transactions} categories={categories ?? []} />

        {/* footer space for mobile */}
        <div className="h-24" />
      </main>
    </div>
  )
}
