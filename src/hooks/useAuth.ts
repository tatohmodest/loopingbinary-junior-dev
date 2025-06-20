// @/hooks/useAuth.ts (or in your component)
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SessionManager } from '@/lib/session-manager'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Session fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Start session monitoring
    const sessionManager = SessionManager.getInstance()
    sessionManager.startSessionMonitoring()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_OUT') {
          sessionManager.stopSessionMonitoring()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      sessionManager.stopSessionMonitoring()
    }
  }, [])

  return { user, loading }
}
