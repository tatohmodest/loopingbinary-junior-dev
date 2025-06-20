// src/components/admin/AdminSidebar.tsx
"use client"

import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Home,
  Database
} from "lucide-react"

const adminRoutes = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/admin",
    description: "Dashboard overview"
  },
  {
    label: "Users",
    icon: Users,
    href: "/admin/users",
    description: "Manage users"
  },
  {
    label: "Teams",
    icon: Building2,
    href: "/admin/teams",
    description: "Monitor teams"
  },
  {
    label: "Modules",
    icon: BookOpen,
    href: "/admin/modules",
    description: "Learning modules"
  },
  {
    label: "Payments",
    icon: CreditCard,
    href: "/admin/payments",
    description: "Payment tracking"
  },
  {
    label: "Resources",
    icon: FileText,
    href: "/admin/resources",
    description: "Learning resources"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
    description: "System settings"
  }
]

interface AdminSidebarProps {
  onNavigate?: () => void
}

function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    pendingPayments: 0,
    activeTeams: 0,
    newUsers: 0
  })

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        
        setProfile(profileData)
      }
    }

    const fetchStats = async () => {
      try {
        const [pendingPayments, activeTeams, newUsers] = await Promise.all([
          supabase.from("payments").select("id", { count: 'exact' }).eq("status", "Pending"),
          supabase.from("teams").select("id", { count: 'exact' }).eq("active", true),
          supabase.from("profiles").select("id", { count: 'exact' }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ])

        setStats({
          pendingPayments: pendingPayments.count || 0,
          activeTeams: activeTeams.count || 0,
          newUsers: newUsers.count || 0
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchUserData()
    fetchStats()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    onNavigate?.()
  }

  const getInitials = (name: string | null) => {
    if (!name) return "A"
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const getNotificationCount = (route: any) => {
    switch (route.href) {
      case "/admin/payments":
        return stats.pendingPayments
      case "/admin/teams":
        return stats.activeTeams
      case "/admin/users":
        return stats.newUsers
      default:
        return 0
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-950 border-r border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">LB Admin</h1>
            <p className="text-sm text-gray-400">Management Console</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{stats.activeTeams}</div>
            <div className="text-xs text-gray-400">Teams</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-amber-400">{stats.pendingPayments}</div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-400">{stats.newUsers}</div>
            <div className="text-xs text-gray-400">New</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-3 overflow-y-auto">
        {/* Back to Dashboard */}
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50 mb-4"
          onClick={() => handleNavigation("/dashboard")}
        >
          <Home className="h-4 w-4 mr-3" />
          Back to Dashboard
        </Button>

        {/* Main Navigation */}
        <div className="space-y-1">
          {adminRoutes.map((route) => {
            const isActive = pathname === route.href
            const notificationCount = getNotificationCount(route)
            
            return (
              <button
                key={route.href}
                onClick={() => handleNavigation(route.href)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-green-500/10 text-green-400 border-r-2 border-green-500" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                )}
              >
                <div className="flex items-center">
                  <route.icon className={cn(
                    "h-4 w-4 mr-3",
                    isActive ? "text-green-400" : "text-gray-500"
                  )} />
                  <span>{route.label}</span>
                </div>
                {notificationCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-red-900/50 text-red-300 border-red-800/50"
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/30">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8 border border-gray-700">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-green-600 text-white text-sm">
              {getInitials(profile?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-white truncate">
              {profile?.name || "Admin User"}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {user?.email}
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
            Admin
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  )
}

export default AdminSidebar
