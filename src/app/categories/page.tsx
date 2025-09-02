import { redirect } from 'next/navigation'

import CategoryForm from '@/components/category-form'
import { Card } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import type { DbCategory } from '@/utils/types'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('seq', { ascending: true })

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-xl px-4 pt-4 pb-24">
        <h1 className="mb-4 text-2xl font-bold">カテゴリ</h1>
        <Card className="mb-4 p-4">
          <CategoryForm />
        </Card>

        <div className="space-y-2">
          {(categories ?? []).map((c: DbCategory) => (
            <Card key={c.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>{c.name}</div>
                <div className="flex gap-2">
                  <a className="text-sm text-sky-600" href={`/categories/${c.id}`}>
                    編集
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
