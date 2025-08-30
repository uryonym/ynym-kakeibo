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
import { createClient } from '@/utils/supabase/client'

type Props = {
  variant: 'income' | 'expense'
}

type FormValues = {
  date: string
  title: string
  category: string
  amount: number
  note?: string
}

export function TransactionDrawer({ variant }: Props) {
  const isIncome = variant === 'income'
  const [open, setOpen] = useState(false)
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

  const [isSaving, setIsSaving] = useState(false)

  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoadingCategories(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('seq', { ascending: true })

        if (error) {
          console.error('Failed to load categories', error)
          return
        }

        if (mounted && data) {
          setCategories(data as Array<{ id: string; name: string }>)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoadingCategories(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  async function onSubmit(values: FormValues) {
    setIsSaving(true)
    try {
      const payload = { ...values, type: isIncome ? 'income' : 'expense' }
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error || '保存に失敗しました')
      }

      // success
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
      <DrawerTrigger asChild>
        <Button variant={isIncome ? 'default' : 'outline'} className="flex-1">
          {isIncome ? '収入を追加' : '支出を追加'}
        </Button>
      </DrawerTrigger>

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
                          {categories.map((c) => (
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
