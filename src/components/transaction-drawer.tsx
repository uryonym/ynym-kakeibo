'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
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
  const form = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      title: '',
      category: '',
      amount: 0,
      note: '',
    },
  })

  function onSubmit(values: FormValues) {
    // UI only: 保存処理はまだ実装しない
    console.log('submit', values)
  }

  return (
    <Drawer direction="bottom">
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
                render={() => (
                  <FormItem>
                    <FormLabel>日付</FormLabel>
                    <FormControl>
                      <Input type="date" {...form.register('date')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
                      <Input placeholder="カテゴリを入力" {...form.register('category')} />
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
                <Button className="flex-1" type="button" onClick={() => form.reset()}>
                  キャンセル
                </Button>
                <Button className="flex-1" type="submit">
                  保存
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
