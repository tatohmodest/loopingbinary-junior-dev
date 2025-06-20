// src/app/(auth)/layout.tsx
import { supabase } from "@/lib/supabase"
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: { session } } = await supabase.auth.getSession()

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen grid place-items-center bg-muted">
      {children}
    </div>
  )
}
