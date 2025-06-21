// src/app/(marketing)/components/site-header.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { LogIn, LogOut, Menu, User, Settings, LayoutDashboard, HelpCircle, Code, BookOpen, Users, ChevronRight, Moon, Sun, Info } from "lucide-react"
import { useTheme } from "next-themes"

export function SiteHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .single()
          
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)

        if (session?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single()
          
          setProfile(profileData)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Function to get mobile menu item class
  const getMobileMenuItemClass = (href: string) => {
    return cn(
      "flex items-center justify-between w-full py-4 text-base font-medium border-b",
      pathname === href ? "text-primary" : "text-foreground"
    )
  }

  // Simple theme toggle for mobile
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 md:px-[60px] px-1 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
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

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/about"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/about" ? "text-foreground" : "text-foreground/60"
              )}
            >
              About
            </Link>
            <Link
              href="/modules"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/modules" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Modules
            </Link>
           
            <Link
              href="/teams"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/teams" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Teams
            </Link>
            <Link
              href="/projects"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/projects" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Projects
            </Link>
            <Link
              href="/resources"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/resources" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Resources
            </Link>
            <Link
              href="/blog"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/blog" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Blog
            </Link>
          </nav>
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center space-x-2">
          {/* Theme toggle for desktop */}
          {mounted && (
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          )}

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild className="hidden md:flex">
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                          <AvatarFallback>
                            {getInitials(user.user_metadata?.full_name || user.email)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.user_metadata?.full_name || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/team">
                          <Users className="mr-2 h-4 w-4" />
                          <span>My Team</span>
                        </Link>
                      </DropdownMenuItem>
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
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/help">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          <span>Help & Support</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/resources">
                          <BookOpen className="mr-2 h-4 w-4" />
                          <span>Resources</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Button variant="ghost" asChild>
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-[350px] p-0">
              <SheetHeader className="p-4 border-b">
                <div className="flex items-center justify-start gap-13">
                  <div className="flex items-center">
                    {mounted && (
                      <div className="relative h-6 w-auto">
                        {theme === "dark" ? (
                          <Image
                            src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-theme.png"
                            alt="LoopingBinary JDP"
                            width={80}
                            height={24}
                            className="h-6 w-auto"
                          />
                        ) : (
                          <Image
                            src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-logo.png"
                            alt="LoopingBinary JDP"
                            width={80}
                            height={24}
                            className="h-6 w-auto"
                          />
                        )}
                      </div>
                    )}
                    {!mounted && (
                      <div className="h-6 w-[80px] bg-muted rounded animate-pulse" />
                    )}
                  </div>
                  {mounted && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleTheme}
                      className="h-9 w-9 hidden md:block"
                    >
                      {theme === "light" ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  )}
                </div>
                 <SheetDescription className="text-left flex justify-between items-center">
                  <span>
                  Junior Developer Program
                  </span>
                   {mounted && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleTheme}
                      className="h-9 w-9"
                    >
                      {theme === "light" ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  )}
                </SheetDescription>
              </SheetHeader>
              <div className="overflow-y-auto">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">NAVIGATION</h3>
                  <div className="space-y-1">
                    <SheetClose asChild>
                      <Link
                        href="/about"
                        className={getMobileMenuItemClass("/about")}
                      >
                        <div className="flex items-center">
                          <Info className="mr-2 h-5 w-5" />
                          <span>About</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/modules"
                        className={getMobileMenuItemClass("/modules")}
                      >
                        <div className="flex items-center">
                          <BookOpen className="mr-2 h-5 w-5" />
                          <span>Modules</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/teams"
                        className={getMobileMenuItemClass("/teams")}
                      >
                        <div className="flex items-center">
                          <Users className="mr-2 h-5 w-5" />
                          <span>Teams</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/projects"
                        className={getMobileMenuItemClass("/projects")}
                      >
                        <div className="flex items-center">
                          <Code className="mr-2 h-5 w-5" />
                          <span>Projects</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/resources"
                        className={getMobileMenuItemClass("/resources")}
                      >
                        <div className="flex items-center">
                          <BookOpen className="mr-2 h-5 w-5" />
                          <span>Resources</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/blog"
                        className={getMobileMenuItemClass("/blog")}
                      >
                        <div className="flex items-center">
                          <BookOpen className="mr-2 h-5 w-5" />
                          <span>Blog</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </Link>
                    </SheetClose>
                  </div>
                </div>
                
                {user && (
                  <div className="px-4 py-2 mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">ACCOUNT</h3>
                    <div className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className={getMobileMenuItemClass("/dashboard")}
                        >
                          <div className="flex items-center">
                            <LayoutDashboard className="mr-2 h-5 w-5" />
                            <span>Dashboard</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/dashboard/team"
                          className={getMobileMenuItemClass("/dashboard/team")}
                        >
                          <div className="flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            <span>My Team</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/dashboard/profile"
                          className={getMobileMenuItemClass("/dashboard/profile")}
                        >
                          <div className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            <span>Profile</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/dashboard/settings"
                          className={getMobileMenuItemClass("/dashboard/settings")}
                        >
                          <div className="flex items-center">
                            <Settings className="mr-2 h-5 w-5" />
                            <span>Settings</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                )}
                
                <div className="p-4 mt-4">
                  {user ? (
                    <SheetClose asChild>
                      <Button
                        variant="destructive"
                        className="w-full" 
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </SheetClose>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      <SheetClose asChild>
                        <Link
                          href="/login"
                          className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-base font-medium text-primary-foreground"
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Log in
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/register"
                          className="flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-3 text-base font-medium"
                        >
                          Sign up
                        </Link>
                      </SheetClose>
                    </div>
                  )}
                </div>
                
                {/* User profile info if logged in */}
                {user && (
                  <div className="p-4 mt-2 border-t">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={profile?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                        <AvatarFallback>
                          {getInitials(user.user_metadata?.full_name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
