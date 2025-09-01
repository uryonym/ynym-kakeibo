// トランザクション（収入/支出）の追加・編集用の Drawer コンポーネント（クライアントサイド）
// 新規作成と編集の両方に対応し、カテゴリは Supabase から取得してプルダウン表示します。
'use client'

import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
// ...既存の他インポートのみ
import type { Category } from '@/utils/types'

type Props = {
  variant: 'income' | 'expense'
  // サーバーから渡されたカテゴリ一覧（必ず渡す）
  categories: Category[]
  // initialValues が与えられた場合は編集用の初期値としてフォームに流し込みます
  initialValues?: Partial<FormValues> & { id?: string }
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}

type FormValues = {
  id?: string
  date: string
  title: string
  category: string
  amount: number
  note?: string
}

export function TransactionDrawer({
  variant,
  initialValues,
  open: openProp,
  onOpenChange,
  hideTrigger,
  categories,
}: Props) {
  const isIncome = variant === 'income'
  const [openState, setOpenState] = useState(false)
  const open = typeof openProp === 'boolean' ? openProp : openState
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v)
    if (typeof openProp !== 'boolean') setOpenState(v)
  }
  const router = useRouter()

  const form = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      title: '',
      category: '',
      amount: 0,
      note: '',
    },
  })

  // 編集モードで Drawer が開いたときに初期値をフォームへセットします
  useEffect(() => {
    if (open && initialValues) {
      form.reset({
        id: initialValues.id,
        date: initialValues.date ?? new Date().toISOString().slice(0, 10),
        title: initialValues.title ?? '',
        category: initialValues.category ?? '',
        amount: initialValues.amount ?? 0,
        note: initialValues.note ?? '',
      })
    }
    // hideTrigger を参照することで未使用警告を回避しています（意図的）
    void hideTrigger
  }, [open, initialValues, form, hideTrigger])

  const [isSaving, setIsSaving] = useState(false)

  // サーバーから渡されるカテゴリを直接使用する（クライアントでの再取得は行わない）
  const categoriesState = categories
  const loadingCategories = false

  async function onSubmit(values: FormValues) {
    setIsSaving(true)
    try {
      const payload = { ...values, type: isIncome ? 'income' : 'expense' }

      let res: Response
      if (values.id) {
        // 既存の取引を更新する場合は PATCH を呼び出す
        res = await fetch('/api/transactions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        // 新規作成の場合は POST を呼び出す
        res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error || '保存に失敗しました')
      }

      // 保存成功時の処理
      form.reset()
      setOpen(false)
      router.refresh()
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : String(err)
      alert(message || '保存中にエラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DrawerTrigger asChild>
          <Button variant={isIncome ? 'default' : 'outline'} className="flex-1">
            {isIncome ? '収入を追加' : '支出を追加'}
          </Button>
        </DrawerTrigger>
      )}

      <DrawerContent className="max-w-xl">
        <DrawerHeader>
          <div className="w-full">
            <DrawerTitle>{isIncome ? '収入を追加' : '支出を追加'}</DrawerTitle>
            <p className="mt-1 text-sm text-slate-500">金額やカテゴリを入力してください</p>
          </div>
        </DrawerHeader>

        <div className="px-4 py-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="date"
                control={form.control}
                render={() => {
                  return (
                    <FormItem>
                      <FormLabel>日付</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {form.getValues('date')}
                              <CalendarIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={new Date(form.getValues('date'))}
                              onSelect={(date) => {
                                if (date) form.setValue('date', date.toISOString().slice(0, 10))
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                name="title"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>タイトル</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={isIncome ? '例: 給料' : '例: 食費'}
                        {...form.register('title')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="category"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>カテゴリ</FormLabel>
                    <FormControl>
                      {loadingCategories ? (
                        <Input disabled placeholder="読み込み中..." />
                      ) : (
                        <select
                          className="w-full rounded-md border bg-transparent px-3 py-1 text-base"
                          {...form.register('category')}
                        >
                          <option value="">未選択</option>
                          {categoriesState.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="amount"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>金額</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...form.register('amount', { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="note"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>メモ</FormLabel>
                    <FormControl>
                      <Input placeholder="任意のメモ" {...form.register('note')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full gap-2">
                <Button
                  className="flex-1"
                  type="button"
                  onClick={() => {
                    form.reset()
                    setOpen(false)
                  }}
                  disabled={isSaving}
                >
                  キャンセル
                </Button>
                <Button className="flex-1" type="submit" disabled={isSaving}>
                  {isSaving ? '保存中...' : '保存'}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  )
}
