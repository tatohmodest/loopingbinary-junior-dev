// src/app/(auth)/signup/page.tsx
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <Button variant="ghost">Back</Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to join the Junior Dev Arena
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
