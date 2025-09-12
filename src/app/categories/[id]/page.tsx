import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import CategoryEditForm from '@/components/category-edit-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import type { DbCategory } from '@/utils/types'

type CategoryEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function CategoryEditPage({ params }: CategoryEditPageProps) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: categories } = await supabase.from('categories').select('*')
  const cat: DbCategory | undefined = (categories ?? []).find((c: DbCategory) => c.id === id)
  if (!cat) notFound()

  return (
    <div className="bg-slate-50">
      <main className="flex flex-col gap-4 px-4 pt-4">
        <h1 className="mb-4 text-2xl font-bold">カテゴリ編集</h1>
        <Card className="p-4">
          <CategoryEditForm id={id} initialName={cat.name} />
        </Card>
        {/* 画面右下に固定される戻るボタン */}
        <Button asChild variant="ghost" size="sm" className="bg-white/90 shadow-md">
          <Link href="/categories" aria-label="カテゴリ一覧に戻る">
            戻る
          </Link>
        </Button>
      </main>
    </div>
  )
}
