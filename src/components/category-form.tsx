'use client'

import { useState } from 'react'

import Spinner from './spinner'

export default function CategoryForm() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      // 簡易的にリロードして一覧を反映
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="新しいカテゴリ名"
        className="flex-1 rounded border px-3 py-2"
      />
      <button
        className="flex items-center rounded bg-sky-600 px-3 py-2 text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner size={16} />
            <span>追加中...</span>
          </>
        ) : (
          '追加'
        )}
      </button>
    </form>
  )
}
