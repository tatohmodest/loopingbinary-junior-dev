// @/utils/supabaseWithRetry.ts
import { supabase } from '@/lib/supabase'

export async function queryWithRetry<T>(
  queryFn: () => any  // Just use 'any' to avoid TypeScript headaches
): Promise<{ data: T | null; error: any }> {
  // Execute the query builder to get a Promise
  let result = await queryFn()
  
  // Check for various auth-related errors
  if (result.error && (
    result.error.message?.includes('JWT') || 
    result.error.message?.includes('expired') ||
    result.error.message?.includes('invalid') ||
    result.error.code === 'PGRST301' ||
    result.error.status === 401
  )) {
    
    console.log('Auth error detected, refreshing session...', result.error.message)
    
    // Refresh the session
    const { error: refreshError } = await supabase.auth.refreshSession()
    
    if (refreshError) {
      console.error('Failed to refresh session:', refreshError)
      return result
    }
    
    // Wait for the new token to propagate
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Retry the query once
    console.log('Retrying query with fresh session...')
    result = await queryFn()
  }
  
  return result
}
