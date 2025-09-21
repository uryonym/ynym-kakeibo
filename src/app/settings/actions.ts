'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function logout() {
  revalidatePath('/')
  // ログアウト後はログインページへ
  redirect('/login')
}
