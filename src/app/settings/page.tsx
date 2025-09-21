import { Card } from '@/components/ui/card'

import { logout } from './actions'

export const metadata = {
  title: '設定 - ynym-kakeibo',
}

export default async function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-xl px-4 pt-4 pb-8">
        <Card className="p-4">
          <h2 className="text-lg font-semibold">アカウント情報</h2>
          <div className="mt-4 text-sm text-slate-700"></div>
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
