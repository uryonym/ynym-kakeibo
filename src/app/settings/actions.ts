'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function logout() {
  const supabase = await createClient()

  // サーバー側でセッションを削除
  await supabase.auth.signOut()

  revalidatePath('/')
  // ログアウト後はログインページへ
  redirect('/login')
}
