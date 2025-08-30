import { NextResponse } from 'next/server'

import { Tables } from '@/utils/supabase/database.types'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { date, title, category, amount, type } = body

    if (!date || !title || !amount || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // resolve category name -> id, create if not exists
    let categoryId: string | null = null
    if (category) {
      const { data: existing } = await supabase
        .from('categories')
        .select('*')
        .eq('name', category)
        .limit(1)
        .maybeSingle()
      if (existing) {
        const e = existing as Tables<'categories'>
        categoryId = e.id
      } else {
        const newId = crypto.randomUUID()
        // insert with seq 0 by default
        await supabase.from('categories').insert({ id: newId, name: category, seq: 0 })
        categoryId = newId
      }
    }

    const insertObj = {
      date,
      title,
      amount: Number(amount),
      category_id: categoryId,
      type,
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert(insertObj)
      .select()
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
