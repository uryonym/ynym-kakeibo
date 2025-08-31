import LoginForm from '@/components/login-form'

export const metadata = {
  title: 'ログイン - ynym-kakeibo',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-xl px-4 pt-4 pb-8">
        <LoginForm />
      </main>
    </div>
  )
}
