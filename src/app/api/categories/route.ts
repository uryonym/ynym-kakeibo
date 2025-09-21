// export async function POST(req: Request) {
//   const body = await req.json()
//   const name = String(body.name ?? '').trim()
//   if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

//   // max seq を取得して末尾に追加
//   const { data: maxRow } = await supabase
//     .from('categories')
//     .select('seq')
//     .order('seq', { ascending: false })
//     .limit(1)
//   const nextSeq = (maxRow?.[0]?.seq ?? 0) + 1

//   const { error } = await supabase.from('categories').insert({ name, seq: nextSeq })
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 })
//   return NextResponse.json({ ok: true })
// }

// export async function PUT(req: Request) {
//   const body = await req.json()
//   const id = String(body.id ?? '')
//   const name = String(body.name ?? '').trim()
//   if (!id || !name) return NextResponse.json({ error: 'id & name required' }, { status: 400 })

//   const { error } = await supabase.from('categories').update({ name }).eq('id', id)
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 })
//   return NextResponse.json({ ok: true })
// }

// export async function DELETE(req: Request) {
//   const body = await req.json()
//   const id = String(body.id ?? '')
//   if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

//   const { error } = await supabase.from('categories').delete().eq('id', id)
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 })
//   return NextResponse.json({ ok: true })
// }
