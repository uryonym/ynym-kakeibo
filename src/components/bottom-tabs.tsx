'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

// スマホ下部に固定するタブバーの見た目だけの実装
export default function BottomTabs() {
  const [active, setActive] = useState('home')
  const router = useRouter()

  const tabs = [
    { key: 'home', label: 'ホーム', icon: HomeIcon },
    { key: 'transactions', label: '明細', icon: ListIcon },
    { key: 'categories', label: 'カテゴリ', icon: TagIcon },
    { key: 'settings', label: '設定', icon: GearIcon },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-2">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = active === t.key
          return (
            <button
              key={t.key}
              onClick={() => {
                // ホームはルート（収支一覧）へ遷移
                if (t.key === 'home') {
                  setActive(t.key)
                  router.push('/')
                  return
                }

                // 設定タブが押されたら `/settings` に遷移する
                if (t.key === 'settings') {
                  setActive(t.key)
                  router.push('/settings')
                  return
                }

                // 他タブは状態のみ更新（将来的にルーティング追加可）
                setActive(t.key)
              }}
              className="flex w-full flex-col items-center gap-1 px-2 py-1 text-xs text-slate-600"
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
              <span className={`${isActive ? 'font-medium text-sky-600' : ''}`}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z"
      />
    </svg>
  )
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      />
    </svg>
  )
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.59 13.41L12 21 3.41 12.41A2 2 0 0 1 3.41 8L12  -1 20.59 7.59A2 2 0 0 1 20.59 13.41z"
      />
    </svg>
  )
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4a2 2 0 0 1 0-4h.09c.7 0 1.29-.44 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 0 1 7.59 2.6l.06.06c.5.5 1.26.66 1.92.33.56-.22 1.33-.32 1.82-.33H12a2 2 0 0 1 4 0h.09c.7 0 1.29.44 1.51 1 .22.56.32 1.33.33 1.82.33.66.17 1.42-.33 1.92l-.06.06c-.5.5-.66 1.26-.33 1.82.22.56.32 1.33.33 1.82V12c0 .38.13.74.38 1.03.25.29.59.48.99.47h.01c.4 0 .74-.19.99-.47.25-.29.38-.65.38-1.03V10c0-.38-.13-.74-.38-1.03-.25-.29-.59-.48-.99-.47h-.01c-.4 0-.74.19-.99.47A2.5 2.5 0 0 0 18 10c0 .38.13.74.38 1.03.25.29.59.48.99.47h.01c.4 0 .74-.19.99-.47.25-.29.38-.65.38-1.03V8c0-.38-.13-.74-.38-1.03-.25-.29-.59-.48-.99-.47h-.01c-.4 0-.74.19-.99.47-.25.29-.38.65-.38 1.03V10"
      />
    </svg>
  )
}
