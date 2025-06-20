// @/lib/session-manager.ts
import { supabase } from './supabase'

export class SessionManager {
  private static instance: SessionManager
  private sessionCheckInterval: NodeJS.Timeout | null = null

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  startSessionMonitoring() {
    // Clear any existing interval
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval)
    }

    // Check session every 30 seconds
    this.sessionCheckInterval = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          console.log('Session expired, redirecting to login')
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Session check failed:', error)
      }
    }, 30000)
  }

  stopSessionMonitoring() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval)
      this.sessionCheckInterval = null
    }
  }
}
