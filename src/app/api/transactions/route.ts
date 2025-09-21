// 取引の作成・更新用 API エンドポイント
// POST: 新規作成、PATCH: 指定 id の取引を更新
import { NextResponse } from 'next/server'

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { date, title, category, amount, type } = body
//     // 基本的な入力検証を行う
//     if (!date || typeof date !== 'string' || Number.isNaN(Date.parse(date))) {
//       return NextResponse.json({ error: 'Invalid or missing date' }, { status: 400 })
//     }
//     if (!title || typeof title !== 'string' || title.trim() === '') {
//       return NextResponse.json({ error: 'Invalid or missing title' }, { status: 400 })
//     }
//     // amount は 0 を許容するため、単純な falsy チェックは避ける
//     if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
//       return NextResponse.json({ error: 'Invalid or missing amount' }, { status: 400 })
//     }
//     const numAmount = Number(amount)
//     if (!Number.isFinite(numAmount)) {
//       return NextResponse.json({ error: 'Amount must be a finite number' }, { status: 400 })
//     }
//     // type は許容される値のみを受け入れる
//     if (typeof type !== 'string' || (type !== 'income' && type !== 'expense')) {
//       return NextResponse.json(
//         { error: "Invalid or missing type (allowed: 'income'|'expense')" },
//         { status: 400 },
//       )
//     }

//     const supabase = await createClient()

//     // カテゴリ名からカテゴリ id を解決。存在しなければ新規作成する
//     let categoryId: string | null = null
//     if (category) {
//       const { data: existing } = await supabase
//         .from('categories')
//         .select('*')
//         .eq('name', category)
//         .limit(1)
//         .maybeSingle()
//       if (existing) {
//         const e = existing as DbCategory
//         categoryId = e.id
//       } else {
//         const newId = crypto.randomUUID()
//         // デフォルトで seq を 0 にしてカテゴリを作成
//         await supabase.from('categories').insert({ id: newId, name: category, seq: 0 })
//         categoryId = newId
//       }
//     }

//     const typedType = type as 'income' | 'expense'

//     const insertObj = {
//       date,
//       title,
//       amount: numAmount,
//       category_id: categoryId,
//       type: typedType,
//     }

//     const { data, error } = await supabase
//       .from('transactions')
//       .insert(insertObj)
//       .select()
//       .limit(1)
//       .maybeSingle()

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 })
//     }

//     return NextResponse.json({ data }, { status: 201 })
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : String(err)
//     return NextResponse.json({ error: message }, { status: 500 })
//   }
// }

// export async function PATCH(req: Request) {
//   try {
//     const body = await req.json()
//     const { id, date, title, category, amount, type } = body

//     if (!id) {
//       return NextResponse.json({ error: 'Missing id for update' }, { status: 400 })
//     }

//     const supabase = await createClient()

//     // カテゴリ名からカテゴリ id を解決。存在しなければ新規作成する（更新時）
//     let categoryId: string | null = null
//     if (category) {
//       const { data: existing } = await supabase
//         .from('categories')
//         .select('*')
//         .eq('name', category)
//         .limit(1)
//         .maybeSingle()
//       if (existing) {
//         const e = existing as DbCategory
//         categoryId = e.id
//       } else {
//         const newId = crypto.randomUUID()
//         await supabase.from('categories').insert({ id: newId, name: category, seq: 0 })
//         categoryId = newId
//       }
//     }

//     const updateObj: Record<string, unknown> = {}
//     if (date !== undefined) {
//       if (typeof date !== 'string' || Number.isNaN(Date.parse(date))) {
//         return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
//       }
//       updateObj.date = date
//     }
//     if (title !== undefined) {
//       if (typeof title !== 'string' || title.trim() === '') {
//         return NextResponse.json({ error: 'Invalid title' }, { status: 400 })
//       }
//       updateObj.title = title
//     }
//     if (amount !== undefined) {
//       if (amount === null || Number.isNaN(Number(amount))) {
//         return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
//       }
//       const n = Number(amount)
//       if (!Number.isFinite(n)) {
//         return NextResponse.json({ error: 'Amount must be a finite number' }, { status: 400 })
//       }
//       updateObj.amount = n
//     }
//     if (category !== undefined) updateObj.category_id = categoryId
//     if (type !== undefined) {
//       if (typeof type !== 'string' || (type !== 'income' && type !== 'expense')) {
//         return NextResponse.json(
//           { error: "Invalid type (allowed: 'income'|'expense')" },
//           { status: 400 },
//         )
//       }
//       updateObj.type = type as 'income' | 'expense'
//     }

//     const { data, error } = await supabase
//       .from('transactions')
//       .update(updateObj)
//       .eq('id', id)
//       .select()
//       .limit(1)
//       .maybeSingle()

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 })
//     }

//     return NextResponse.json({ data }, { status: 200 })
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : String(err)
//     return NextResponse.json({ error: message }, { status: 500 })
//   }
// }
