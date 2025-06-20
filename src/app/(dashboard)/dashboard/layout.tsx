'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Users,
  Layers,
  BookOpen,
  CreditCard,
  User,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Shield, // Add this for admin icon
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useTheme } from 'next-themes'

// Add this helper function
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [userA, setAuthUser] = useState<any>(null) // Initialize as null instead of undefined
  const [loading, setLoading] = useState(true) // Add loading state
  
  // Add these states for the notifications and profile
  const [notifications] = React.useState([])
  const [profile, setProfile] = React.useState<{ name?: string; avatar_url?: string }>({})
  const [user, setUser] = React.useState<{ email?: string }>({})
 const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
 
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true
    }
    return path !== '/dashboard' && pathname.startsWith(path)
  }
  useEffect(() => {
      setMounted(true)
    }, [])

  // Function to get the class name for a nav item based on its active state
  const getNavItemClassName = (path: string) => {
    return `flex items-center py-2 px-3 rounded-md ${
      isActive(path)
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    }`
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError) {
          console.error("Auth error:", authError)
          return
        }

        if (authUser) {
          console.log("Current user:", authUser.id)
          setUser(authUser) // Set the auth user

          // Get user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()

          if (profileError) {
            console.error("Profile error:", profileError)
            return
          }

          if (profileData) {
            setAuthUser(profileData)
            setProfile(profileData)
            console.log("User profile loaded:", profileData)
            console.log("User role:", profileData.role)
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, []) // Remove userA from dependencies to prevent infinite loop

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  
  // Close mobile nav when route changes
  React.useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  // Add loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex min-h-screen">
      {/* Overlay for mobile nav */}
      {isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}
      
      {/* Mobile Side Navigation */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card p-6 border-r transform transition-transform duration-300 ease-in-out lg:hidden",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="mr-6 flex items-center">
            {/* Theme-aware logo - only image */}
            {mounted && (
              <div className="relative h-8 w-auto">
                {theme === "dark" ? (
                  <Image
                    src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-theme.png"
                    alt="LoopingBinary JDP"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                ) : (
                  <Image
                    src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-logo.png"
                    alt="LoopingBinary JDP"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                )}
              </div>
            )}
            {/* Fallback for when not mounted */}
            {!mounted && (
              <div className="h-8 w-[120px] bg-muted rounded animate-pulse" />
            )}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col h-[calc(100%-80px)]">
          <div className="space-y-1">
            <nav className="space-y-1">
              <Link href="/dashboard" className={getNavItemClassName('/dashboard')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/dashboard/team" className={getNavItemClassName('/dashboard/team')}>
                <Users className="mr-2 h-4 w-4" />
                Team
              </Link>
              <Link href="/dashboard/modules" className={getNavItemClassName('/dashboard/modules')}>
                <Layers className="mr-2 h-4 w-4" />
                Modules
              </Link>
              <Link href="/dashboard/resources" className={getNavItemClassName('/dashboard/resources')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Resources
              </Link>
              <Link href="/dashboard/payments" className={getNavItemClassName('/dashboard/payments')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Payments
              </Link>
              <Link href="/dashboard/profile" className={getNavItemClassName('/dashboard/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link href="/dashboard/settings" className={getNavItemClassName('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto pt-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop Side Navigation */}
      <div className="hidden lg:block w-64 border-r bg-card p-6 fixed h-screen">
        <div className="flex flex-col h-full">
          <div className="space-y-1">
           <Link href="/" className="mr-6 flex items-center">
            {/* Theme-aware logo - only image */}
            {mounted && (
              <div className="relative h-8 w-auto">
                {theme === "dark" ? (
                  <Image
                    src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-theme.png"
                    alt="LoopingBinary JDP"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                ) : (
                  <Image
                    src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-logo.png"
                    alt="LoopingBinary JDP"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                )}
              </div>
            )}
            {/* Fallback for when not mounted */}
            {!mounted && (
              <div className="h-8 w-[120px] bg-muted rounded animate-pulse" />
            )}
          </Link>
            <nav className="space-y-1">
              <Link href="/dashboard" className={getNavItemClassName('/dashboard')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/dashboard/team" className={getNavItemClassName('/dashboard/team')}>
                <Users className="mr-2 h-4 w-4" />
                Team
              </Link>
              <Link href="/dashboard/modules" className={getNavItemClassName('/dashboard/modules')}>
                <Layers className="mr-2 h-4 w-4" />
                Modules
              </Link>
              <Link href="/dashboard/resources" className={getNavItemClassName('/dashboard/resources')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Resources
              </Link>
              <Link href="/dashboard/payments" className={getNavItemClassName('/dashboard/payments')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Payments
              </Link>
              <Link href="/dashboard/profile" className={getNavItemClassName('/dashboard/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link href="/dashboard/settings" className={getNavItemClassName('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto pt-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="border-b bg-card sticky top-0 z-30">
          <div className="flex h-16 items-center px-4 sm:px-6">
            <div className="lg:hidden mr-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setIsMobileNavOpen(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
            
           <Link href="/" className="mr-6 flex items-center">
            {/* Theme-aware logo - only image */}
            {mounted && (
              <div className="relative h-8 w-auto">
                {theme === "dark" ? (
                  <Image
                    src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-theme.png"
                    alt="LoopingBinary JDP"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                ) : (
                  <Image
                    src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-logo.png"
                    alt="LoopingBinary JDP"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                    priority
                  />
                )}
              </div>
            )}
            {/* Fallback for when not mounted */}
            {!mounted && (
              <div className="h-8 w-[120px] bg-muted rounded animate-pulse" />
            )}
          </Link>
            
            <div className="ml-auto flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification: any) => (
                      <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="text-center p-4 text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center">
                    <Link href="/dashboard/notifications" className="text-sm text-primary">View all notifications</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                      <AvatarFallback>{profile?.name ? getInitials(profile.name) : "?"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.name && <p className="font-medium">{profile.name}</p>}
                      {user?.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Fixed Admin Panel Logic */}
                  {userA?.role === "Admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  {/* Debug info - remove this in production */}
                  {process.env.NODE_ENV === 'development' && (
                    <>
                      <DropdownMenuItem disabled>
                        <span className="text-xs text-muted-foreground">
                          Role: {userA?.role || 'No role'} | User: {userA ? 'Loaded' : 'Not loaded'}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
