// サーバーコンポーネント向けの Supabase クライアントを生成するユーティリティ
// Cookie ストアを渡してユーザーのセッション情報を扱えるようにする
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { Database } from './database.types'

export async function createClient() {
  const cookieStore = await cookies()

  // Cookie を渡してサーバー側の Supabase クライアントを生成します。
  // これによりセッションを維持した API 呼び出しが可能になります。
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll がサーバーコンポーネントで呼ばれた場合の例外を無視します。
            // ミドルウェアでセッション更新を行っている場合は問題ありません。
          }
        },
      },
    },
  )
}
