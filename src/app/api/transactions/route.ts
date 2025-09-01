// 取引の作成・更新用 API エンドポイント
// POST: 新規作成、PATCH: 指定 id の取引を更新
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import type { DbCategory } from '@/utils/types'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { date, title, category, amount, type } = body

    if (!date || !title || !amount || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // カテゴリ名からカテゴリ id を解決。存在しなければ新規作成する
    let categoryId: string | null = null
    if (category) {
      const { data: existing } = await supabase
        .from('categories')
        .select('*')
        .eq('name', category)
        .limit(1)
        .maybeSingle()
      if (existing) {
        const e = existing as DbCategory
        categoryId = e.id
      } else {
        const newId = crypto.randomUUID()
        // デフォルトで seq を 0 にしてカテゴリを作成
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, date, title, category, amount, type } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing id for update' }, { status: 400 })
    }

    const supabase = await createClient()

    // カテゴリ名からカテゴリ id を解決。存在しなければ新規作成する（更新時）
    let categoryId: string | null = null
    if (category) {
      const { data: existing } = await supabase
        .from('categories')
        .select('*')
        .eq('name', category)
        .limit(1)
        .maybeSingle()
      if (existing) {
        const e = existing as DbCategory
        categoryId = e.id
      } else {
        const newId = crypto.randomUUID()
        await supabase.from('categories').insert({ id: newId, name: category, seq: 0 })
        categoryId = newId
      }
    }

    const updateObj: Record<string, unknown> = {}
    if (date !== undefined) updateObj.date = date
    if (title !== undefined) updateObj.title = title
    if (amount !== undefined) updateObj.amount = Number(amount)
    if (category !== undefined) updateObj.category_id = categoryId
    if (type !== undefined) updateObj.type = type

    const { data, error } = await supabase
      .from('transactions')
      .update(updateObj)
      .eq('id', id)
      .select()
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
