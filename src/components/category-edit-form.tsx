'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Spinner from './spinner'
import { Button } from './ui/button'

export default function CategoryEditForm({ id, initialName }: { id: string; initialName: string }) {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function onSave(e?: React.FormEvent) {
    e?.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      })
      router.push('/categories')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!confirm('本当に削除しますか？')) return
    setDeleting(true)
    try {
      await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      router.push('/categories')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={onSave} className="flex flex-col gap-2">
      <input
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded border px-3 py-2"
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          variant="default"
          className="flex items-center bg-slate-800 text-white hover:bg-slate-900"
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner size={16} />
              <span>保存中...</span>
            </>
          ) : (
            '保存'
          )}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="flex items-center"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? (
            <>
              <Spinner size={16} />
              <span>削除中...</span>
            </>
          ) : (
            '削除'
          )}
        </Button>
      </div>
    </form>
  )
}
