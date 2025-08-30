import LoginForm from '@/components/login-form'

export const metadata = {
  title: 'ログイン - ynym-kakeibo',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <LoginForm />
    </div>
  )
}
