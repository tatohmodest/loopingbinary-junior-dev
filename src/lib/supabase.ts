// src/lib/supabase.ts (Enhanced - Drop-in Replacement)
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
    // 🔥 Refresh threshold (refresh 60 seconds before expiry)
    refreshThreshold: 60,
    // 🔥 Storage for better cross-tab sync
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
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
})

// 🔥 Global auth state listener (handles token refresh automatically)
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔄 Auth event:', event)
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('✅ Token refreshed automatically!')
  }
  
  if (event === 'SIGNED_OUT') {
    console.log('👋 User signed out')
    // Optional: redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }
})

// 🔥 Add a simple retry wrapper (optional - for extra safety)
const originalFrom = supabase.from.bind(supabase)

supabase.from = (table: string) => {
  const query = originalFrom(table)
  
  // Wrap the query methods with a simple retry
  const wrapMethod = (method: any) => {
    return async (...args: any[]) => {
      try {
        const result = await method.apply(query, args)
        return result
      } catch (error: any) {
        // If it's an auth error, wait a bit and try once more
        if (error?.message?.includes('JWT') || error?.status === 401) {
          console.log('🔄 Auth error detected, waiting for auto-refresh...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          return await method.apply(query, args)
        }
        throw error
      }
    }
  }
  
  // Return the query with wrapped methods
  return {
    ...query,
    select: (...args: any[]) => {
      const selectQuery = query.select(...args)
      return {
        ...selectQuery,
        // Wrap the execution methods
        single: wrapMethod(selectQuery.single.bind(selectQuery)),
        maybeSingle: wrapMethod(selectQuery.maybeSingle.bind(selectQuery)),
        then: (resolve: any, reject: any) => {
          return wrapMethod(selectQuery.then.bind(selectQuery))(resolve, reject)
        }
      }
    },
    insert: wrapMethod(query.insert.bind(query)),
    update: wrapMethod(query.update.bind(query)),
    delete: wrapMethod(query.delete.bind(query)),
    upsert: wrapMethod(query.upsert.bind(query)),
  }
}
