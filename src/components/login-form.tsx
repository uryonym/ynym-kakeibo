'use client'

import { useState } from 'react'

import * as actions from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

// ログインフォーム（サーバーアクションに接続）
export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // サーバーアクションはフォーム submit として動くが、fetch 中にローカルで loading を制御するため
  // onSubmit ハンドラで loading をセットしてからフォームを送信する
  const onSubmit: React.FormEventHandler<HTMLFormElement> = () => {
    setLoading(true)
    // フォームは通常通り送信される（action に指定された server action が呼ばれる）
    // サブミット後にページ遷移が発生すると、このコンポーネントのアンマウントにより loading はリセットされる
  }

  return (
    <Card className="w-full max-w-md p-6">
      {/* フォームタイトル */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold">サインイン</h2>
        <p className="text-sm text-slate-500">メールアドレスとパスワードでログインします</p>
      </div>

      <form action={actions.login} className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="email">Eメール</Label>
          <Input
            id="email"
            name="email"
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
            name="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="mt-2">
          <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
            {loading ? (
              // ログイン処理中は共通スピナーと文言を表示
              <>
                <Spinner className="text-white" size={16} />
                ログイン中…
              </>
            ) : (
              'ログイン'
            )}
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
