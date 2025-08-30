'use client'

import { useState } from 'react'

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

type Tx = {
  id: string
  date: string
  title: string
  category: string
  amount: number
  type: 'income' | 'expense'
}

const formatYen = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 })

export function TransactionsList({ transactions }: { transactions: Tx[] }) {
  const [editing, setEditing] = useState<Tx | null>(null)

  return (
    <>
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
                <TableRow key={t.id} className="cursor-pointer" onClick={() => setEditing(t)}>
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

      {editing && (
        <TransactionDrawer
          variant={editing.type}
          initialValues={{
            id: editing.id,
            date: editing.date,
            title: editing.title,
            category: editing.category,
            amount: editing.amount,
          }}
          open
          onOpenChange={(v) => {
            if (!v) setEditing(null)
          }}
          hideTrigger
        />
      )}
    </>
  )
}

export default TransactionsList
