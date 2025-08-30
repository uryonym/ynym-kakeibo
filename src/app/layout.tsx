import type { Metadata } from 'next'

import BottomTabs from '@/components/bottom-tabs'
import './globals.css'

export const metadata: Metadata = {
  title: 'ynym-kakeibo',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      {/* コンテンツに下部余白をつけ、ボトムタブが被らないようにする */}
      <body>
        <div className="min-h-screen pb-24">{children}</div>
        <BottomTabs />
      </body>
    </html>
  )
}
