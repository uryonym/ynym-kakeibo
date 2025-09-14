'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import Spinner from './spinner'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'

type CategoryEditFormProps = {
  id: string
  initialName: string
}

type CategoryFormValues = {
  id: string
  name: string
}

export default function CategoryEditForm({ id, initialName }: CategoryEditFormProps) {
  const router = useRouter()

  const form = useForm<CategoryFormValues>({
    defaultValues: { id, name: initialName },
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true)
    console.log(data)
    try {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      router.push('/categories')
    } finally {
      setIsLoading(false)
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
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button
            type="submit"
            variant="default"
            className="flex items-center bg-slate-800 text-white hover:bg-slate-900"
            disabled={isLoading}
          >
            {isLoading ? (
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
    </Form>
  )
}
