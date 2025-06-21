// src/lib/supabase.ts (Enhanced Configuration)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 🔥 Enable automatic token refresh
    autoRefreshToken: true,
    // 🔥 Persist session across tabs/windows
    persistSession: true,
    // 🔥 Detect session in other tabs
    detectSessionInUrl: true,
    // 🔥 Storage key for session
    storageKey: 'supabase-auth-token',
    // 🔥 Custom storage (optional - for better cross-tab sync)
    storage: {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key)
        }
        return null
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value)
        }
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key)
        }
      },
    },
  },
  // 🔥 Global configuration
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
  // 🔥 Realtime configuration
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// 🔥 Listen for auth state changes globally
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔄 Auth state changed:', event, session?.user?.id)
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('✅ Token refreshed successfully')
  }
  
  if (event === 'SIGNED_OUT') {
    console.log('👋 User signed out')
  }
})
