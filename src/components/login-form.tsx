"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

// ログインフォーム（見た目のみ）
export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Card className="w-full max-w-md p-6">
      {/* フォームタイトル */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold">サインイン</h2>
        <p className="text-sm text-slate-500">メールアドレスとパスワードでログインします</p>
      </div>

      <form
        // 見た目のみのため submit ハンドラはデフォルト動作を prevent する
        onSubmit={(e) => {
          e.preventDefault()
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="email">Eメール</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="mt-2">
          <Button type="submit" className="w-full">
            ログイン
          </Button>
        </div>

        <div className="pt-2 text-center text-sm text-slate-500">
          {/* パスワードを忘れた場合や新規登録リンクは不要とのことなので表示しない */}
          サービスに問題がある場合はサポートにお問い合わせください。
        </div>
      </form>
    </Card>
  )
}
