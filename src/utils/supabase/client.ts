// ブラウザ（クライアント）用の Supabase クライアントを作成するユーティリティ
import { createBrowserClient } from '@supabase/ssr'

import { Database } from './database.types'

export function createClient() {
  // ブラウザ向けにプロジェクトの公開キーで Supabase クライアントを生成します
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
