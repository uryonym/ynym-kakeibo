import { Card } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'

import { logout } from './actions'

export const metadata = {
  title: '設定 - ynym-kakeibo',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // 未ログイン時はログインページへ
    return <div className="flex min-h-screen items-center justify-center">ログインしてください</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-xl px-4 pt-20 pb-8">
        <Card className="p-4">
          <h2 className="text-lg font-semibold">アカウント情報</h2>
          <div className="mt-4 text-sm text-slate-700">
            <p>メール: {user.email}</p>
            <p className="mt-2">ユーザーID: {user.id}</p>
          </div>
          <form action={logout} className="mt-6">
            <button
              type="submit"
              className="rounded bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
            >
              ログアウト
            </button>
          </form>
        </Card>
      </main>
    </div>
  )
}
