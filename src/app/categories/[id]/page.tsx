import { notFound, redirect } from 'next/navigation'

import CategoryEditForm from '@/components/category-edit-form'
import { Card } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import type { DbCategory } from '@/utils/types'

export default async function CategoryEditPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: categories } = await supabase.from('categories').select('*')
  const cat: DbCategory | undefined = (categories ?? []).find((c: DbCategory) => c.id === params.id)
  if (!cat) notFound()

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-xl px-4 pt-4 pb-24">
        <h1 className="mb-4 text-2xl font-bold">カテゴリ編集</h1>
        <Card className="p-4">
          <CategoryEditForm id={params.id} initialName={cat.name} />
        </Card>
      </main>
    </div>
  )
}
