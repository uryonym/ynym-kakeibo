import type { Metadata } from 'next'

import BottomTabs from '@/components/bottom-tabs'
import './globals.css'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'ynym-kakeibo',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="ja">
      {/* コンテンツに下部余白をつけ、ボトムタブが被らないようにする */}
      <body>
        {/* ヘッダー（全ページ共通） */}
        <div className="fixed inset-x-0 top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
          {/* 固定高さにしてレイアウトの余白量を一定にする */}
          <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
            <h1 className="text-lg font-semibold">ynym-kakeibo</h1>
            {/* ヘッダー右側の月表示は layout 側では表示しない（ページごとに必要なら各ページで表示する） */}
          </div>
        </div>

        {/* コンテンツに下部余白をつけ、ボトムタブが被らないようにする。ヘッダー分の余白も確保 */}
        <div className="min-h-screen pt-14 pb-24">{children}</div>
        {user ? <BottomTabs /> : null}
      </body>
    </html>
  )
}
