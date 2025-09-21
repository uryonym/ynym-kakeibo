import axios from 'axios'

import CategoryForm from '@/components/category-form'
import { Card } from '@/components/ui/card'
import type { Category } from '@/utils/types'

// サーバーコンポーネントで外部 API からカテゴリ一覧を取得して表示する
export default async function CategoriesPage() {
  // axios で外部 API を呼び出す
  let categories: Category[] = []
  try {
    const res = await axios.get<Category[]>('https://api-kakeibo.uryonym.com/categories', {
      // サーバーサイドからの呼び出しなのでタイムアウトやヘッダ設定があればここで追加
      timeout: 5000,
    })
    categories = res.data ?? []
  } catch (err) {
    // エラー時は空配列にフォールバック（表示側で何も表示されない）
    // 実運用ではログ送信やユーザー向けのエラーメッセージ表示を追加する
    console.error('Failed to fetch categories', err)
    categories = []
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-xl px-4 pt-4 pb-24">
        <h1 className="mb-4 text-2xl font-bold">カテゴリ</h1>
        <Card className="mb-4 p-4">
          <CategoryForm />
        </Card>

        <div className="space-y-2">
          {categories.map((c: Category) => (
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
