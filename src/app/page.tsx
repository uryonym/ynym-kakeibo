import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select()

  return (
    <div>
      <p>ynym-kakeibo</p>
      <ul>
        {categories &&
          categories.map((category) => (
            <li key={category.id}>
              {category.seq}:{category.name}
            </li>
          ))}
      </ul>
    </div>
  )
}
