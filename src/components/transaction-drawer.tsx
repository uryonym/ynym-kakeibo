'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  variant: 'income' | 'expense'
}

export function TransactionDrawer({ variant }: Props) {
  const isIncome = variant === 'income'

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
          <div className="mb-3">
            <Label>日付</Label>
            <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>

          <div className="mb-3">
            <Label>タイトル</Label>
            <Input placeholder={isIncome ? '例: 給料' : '例: 食費'} />
          </div>

          <div className="mb-3">
            <Label>カテゴリ</Label>
            <Input placeholder="カテゴリを入力" />
          </div>

          <div className="mb-3">
            <Label>金額</Label>
            <Input type="number" placeholder="0" />
          </div>

          <div className="mb-3">
            <Label>メモ</Label>
            <Input placeholder="任意のメモ" />
          </div>
        </div>

        <DrawerFooter>
          <div className="flex w-full gap-2">
            <Button className="flex-1">キャンセル</Button>
            <Button className="flex-1">保存</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
