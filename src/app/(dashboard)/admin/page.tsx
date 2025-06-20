
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  UserCog, 
  Building2, 
  BookOpen, 
  CreditCard, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Settings,
  BarChart3,
  FileText,
  Shield
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalTeams: number
  totalModules: number
  totalPayments: number
  activeTeams: number
  completedModules: number
  pendingPayments: number
  recentUsers: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTeams: 0,
    totalModules: 0,
    totalPayments: 0,
    activeTeams: 0,
    completedModules: 0,
    pendingPayments: 0,
    recentUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all stats in parallel
        const [
          usersResult,
          teamsResult,
          modulesResult,
          paymentsResult,
          activeTeamsResult,
          completedModulesResult,
          pendingPaymentsResult,
          recentUsersResult
        ] = await Promise.all([
          supabase.from("profiles").select("id", { count: 'exact' }),
          supabase.from("teams").select("id", { count: 'exact' }),
          supabase.from("modules").select("id", { count: 'exact' }),
          supabase.from("payments").select("id", { count: 'exact' }),
          supabase.from("teams").select("id", { count: 'exact' }).eq("active", true),
          supabase.from("team_modules").select("id", { count: 'exact' }).eq("status", "completed"),
          supabase.from("payments").select("id", { count: 'exact' }).eq("status", "Pending"),
          supabase.from("profiles").select("id", { count: 'exact' }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ])

        setStats({
          totalUsers: usersResult.count || 0,
          totalTeams: teamsResult.count || 0,
          totalModules: modulesResult.count || 0,
          totalPayments: paymentsResult.count || 0,
          activeTeams: activeTeamsResult.count || 0,
          completedModules: completedModulesResult.count || 0,
          pendingPayments: pendingPaymentsResult.count || 0,
          recentUsers: recentUsersResult.count || 0
        })

        // Fetch recent activity
        const { data: recentTeams } = await supabase
          .from("teams")
          .select(`
            id,
            name,
            created_at,
            profiles!teams_created_by_fkey(name)
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        const { data: recentPayments } = await supabase
          .from("payments")
          .select(`
            id,
            amount,
            status,
            created_at,
            teams(name)
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        // Combine and sort recent activity
        const activity = [
          ...(recentTeams?.map(team => ({
            type: 'team_created',
            data: team,
            timestamp: team.created_at
          })) || []),
          ...(recentPayments?.map(payment => ({
            type: 'payment',
            data: payment,
            timestamp: payment.created_at
          })) || [])
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

        setRecentActivity(activity)

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: `+${stats.recentUsers} this week`,
      color: "text-blue-600"
    },
    {
      title: "Active Teams",
      value: stats.activeTeams,
      icon: Building2,
      description: `${stats.totalTeams} total teams`,
      color: "text-green-600"
    },
    {
      title: "Modules",
      value: stats.totalModules,
      icon: BookOpen,
      description: `${stats.completedModules} completed`,
      color: "text-purple-600"
    },
    {
      title: "Payments",
      value: stats.totalPayments,
      icon: CreditCard,
      description: `${stats.pendingPayments} pending`,
      color: "text-orange-600"
    }
  ]

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage user profiles",
      icon: UserCog,
      href: "/admin/users",
      color: "bg-blue-500"
    },
    {
      title: "Manage Teams",
      description: "Oversee team activities",
      icon: Building2,
      href: "/admin/teams",
      color: "bg-green-500"
    },
    {
      title: "Manage Modules",
      description: "Create and edit modules",
      icon: BookOpen,
      href: "/admin/modules",
      color: "bg-purple-500"
    },
    {
      title: "Payment Management",
      description: "Track and manage payments",
      icon: CreditCard,
      href: "/admin/payments",
      color: "bg-orange-500"
    },
    {
      title: "Resources",
      description: "Manage learning resources",
      icon: FileText,
      href: "/admin/resources",
      color: "bg-indigo-500"
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500"
    }
  ]

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your platform from here
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Shield className="h-3 w-3 mr-1" />
            Admin Access
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 justify-start"
                    onClick={() => router.push(action.href)}
                  >
                    <div className={`p-2 rounded-md ${action.color} mr-3`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest platform activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${
                        activity.type === 'team_created' ? 'bg-green-500/10' : 'bg-blue-500/10'
                      }`}>
                        {activity.type === 'team_created' ? (
                          <Building2 className={`h-3 w-3 ${
                            activity.type === 'team_created' ? 'text-green-500' : 'text-blue-500'
                          }`} />
                        ) : (
                          <CreditCard className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          {activity.type === 'team_created' ? (
                            <>
                              Team <span className="font-medium">{activity.data.name}</span> was created
                              {activity.data.profiles?.name && (
                                <> by <span className="font-medium">{activity.data.profiles.name}</span></>
                              )}
                            </>
                          ) : (
                            <>
                              Payment of <span className="font-medium">{activity.data.amount} XAF</span> 
                              {activity.data.teams?.name && (
                                <> for <span className="font-medium">{activity.data.teams.name}</span></>
                              )}
                              <Badge 
                                variant={activity.data.status === 'Completed' ? 'default' : 'secondary'}
                                className="ml-2 text-xs"
                              >
                                {activity.data.status}
                              </Badge>
                            </>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>
            Overview of system status and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-full">
                <Activity className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">API Status</p>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Pending Reviews</p>
                <p className="text-xs text-muted-foreground">{stats.pendingPayments} items need attention</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
