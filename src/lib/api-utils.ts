// @/lib/api-utils.ts
import { supabase } from './supabase'

export async function fetchWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 3,
  delay = 1000
): Promise<{ data: T | null; error: any }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await queryFn()
      
      if (result.error) {
        console.error(`Attempt ${attempt} failed:`, result.error)
        
        if (attempt === maxRetries) {
          return result
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
        continue
      }
      
      return result
    } catch (error) {
      console.error(`Attempt ${attempt} threw error:`, error)
      
      if (attempt === maxRetries) {
        return { data: null, error }
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  return { data: null, error: new Error('Max retries exceeded') }
}
