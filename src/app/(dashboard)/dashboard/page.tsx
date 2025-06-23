// src/app/(dashboard)/dashboard/page.tsx (improved)
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  BookOpen,
  CalendarClock,
  Layers,
  CreditCard,
  Loader2,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronRight,
  BarChart3,
  Code,
  FileText,
  Github,
  PlusCircle,
  Shield,
  ShieldCheck,
  ShieldX
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProgramAlertBanner } from "@/components/alert"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [team, setTeam] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [teamModule, setTeamModule] = useState<any>(null)
  const [module, setModule] = useState<any>(null)
  const [phases, setPhases] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  
  // Define all possible phases in order
  const allPhases = [
    "Team Formation",
    "Module Assigned",
    "Execution Started",
    "First Delivery",
    "Final Merge",
    "Launched"
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get the authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          console.error("Auth error:", authError);
          setError("Authentication error. Please log in again.");
          return;
        }
        
        setUser(authUser);
        console.log("Current user:", authUser.id);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
        
        // 1. Get teams the user created
        const { data: createdTeams, error: createdTeamsError } = await supabase
          .from('teams')
          .select('*')
          .eq('created_by', authUser.id);
        
        console.log("Created teams:", createdTeams, "Error:", createdTeamsError);
        
        // 2. Get teams the user is a member of
        const { data: memberTeams, error: memberTeamsError } = await supabase
          .from('team_members')
          .select(`
            *,
            teams:team_id (*)
          `)
          .eq('user_id', authUser.id);
       
        console.log("Member teams raw:", memberTeams, "Error:", memberTeamsError);
        
        // Extract team objects from member teams response

        // In your modules component (like @/app/modules/page.tsx)

  const testMultiTab = async () => {
    console.log('=== MULTI-TAB TEST ===')
    
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Session exists:', !!session)
    console.log('User ID:', session?.user?.id)
    
    const { data, error } = await supabase
      .from('modules')
      .select('count')
      .limit(1)
    
    console.log('Query result:', { data, error })
    console.log('Tab timestamp:', new Date().toISOString())
  }

 
  


        let teamsFromMemberships = [];
      
        if (memberTeams && memberTeams.length > 0) {
          console.log("First membership record:", memberTeams[0]);
          
          // Set subscription status based on team membership
          const userMembership = memberTeams.find(m => m.user_id === authUser.id);
          
        
          teamsFromMemberships = memberTeams
            .map(membership => membership.teams)
            .filter(team => team !== null);
        }
        console.log("Teams from memberships:", teamsFromMemberships);
        
        // Combine all teams
        const allTeams = [
          ...(createdTeams || []),
          ...teamsFromMemberships
        ];
        
        // Remove duplicates
        const uniqueTeams = allTeams.filter((team, index, self) =>
          index === self.findIndex(t => t.id === team.id)
        );
        
        console.log("All unique teams:", uniqueTeams);
        
        if (uniqueTeams.length > 0) {
          // Set the first team as the current team
          const currentTeam = uniqueTeams[0];
          setTeam(currentTeam);
          setSubscriptionStatus(currentTeam.active)
          console.log("Subscription;", subscriptionStatus)
          
          // Fetch members for this team
          const { data: members, error: membersError } = await supabase
            .from('team_members')
            .select(`
              *,
              profiles:user_id (
                id,
                name,
                email,
                avatar_url
              )
            `)
            .eq('team_id', currentTeam.id);
          
          console.log("Team members:", members, "Error:", membersError);
          
          if (members) {
            setTeamMembers(members);
          } else {
            setTeamMembers([]);
            console.error("Failed to fetch team members:", membersError);
          }

          // Fetch team module if exists
          const { data: teamModuleData, error: teamModuleError } = await supabase
            .from('team_modules')
            .select(`
              *,
              modules:module_id (*)
            `)
            .eq('team_id', currentTeam.id)
            .single();

          if (teamModuleData) {
            setTeamModule(teamModuleData);
            setModule(teamModuleData.modules);
          }
        } else {
          console.log("No teams found for this user");
          setTeam(null);
          setTeamMembers([]);
          setSubscriptionStatus(null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData()
  }, [router])

  useEffect(() => {
    console.log("User:", user);
    console.log("Teams:", team);

    console.log("Team Members:", teamMembers);
    console.log("Subscription Status:", subscriptionStatus);
  }, [user, team, teamMembers, subscriptionStatus]);
  
  const getProgressPercentage = () => {
    if (!phases || phases.length === 0) return 0
    return Math.round((phases.length / allPhases.length) * 100)
  }
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }
  
  const getInitials = (name: string) => {
    if (!name) return "?"
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const getTeamStatusBadge = () => {
    if (subscriptionStatus === null) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-800">
          <ShieldX className="w-3 h-3 mr-1" />
          Unknown
        </Badge>
      )
    }
    
    if (subscriptionStatus) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    }
    
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800">
        <Shield className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    )
  }
   const testMultiTab = async () => {
    console.log('=== MULTI-TAB TEST ===')
    
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Session exists:', !!session)
    console.log('User ID:', session?.user?.id)
    
    const { data, error } = await supabase
      .from('modules')
      .select('count')
      .limit(1)
    
    console.log('Query result:', { data, error })
    console.log('Tab timestamp:', new Date().toISOString())
  }
  if (loading) {
    return (
      <div>
       
  
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
    
      <div className="flex-1">
          
        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
            <ProgramAlertBanner />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {profile?.name || user?.email}
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!team ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Get Started with TeamHub</CardTitle>
                  <CardDescription className="text-center">
                    Join an existing team or create your own to start collaborating
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="mb-6 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="w-full sm:w-auto" 
                    onClick={() => router.push("/dashboard/team/create")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Team
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto" 
                    onClick={() => router.push("/dashboard/team/join")}
                  >
                    Join Existing Team
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Why Create a Team?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-3 rounded-full bg-primary/10 p-2">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Collaborate Effectively</h4>
                      <p className="text-sm text-muted-foreground">Work together with other developers on real projects</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 rounded-full bg-primary/10 p-2">
                      <Code className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Build Real Projects</h4>
                      <p className="text-sm text-muted-foreground">Gain practical experience by building production-ready applications</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 rounded-full bg-primary/10 p-2">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Structured Learning</h4>
                      <p className="text-sm text-muted-foreground">Follow a proven curriculum designed by industry experts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Browse Available Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore our collection of project modules designed to help you build your portfolio and skills.
                  </p>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">E-Commerce Platform</h4>
                        <p className="text-xs text-muted-foreground">Build a full-featured online store</p>
                      </div>
                      <Badge>Popular</Badge>
                    </div>
                    <div className="p-3 border rounded-lg flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Social Network</h4>
                        <p className="text-xs text-muted-foreground">Create a community platform</p>
                      </div>
                      <Badge variant="outline">Intermediate</Badge>
                    </div>
                    <div className="p-3 border rounded-lg flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Project Management Tool</h4>
                        <p className="text-xs text-muted-foreground">Develop a team collaboration app</p>
                      </div>
                      <Badge variant="outline">Advanced</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/modules")}>
                    Browse All Modules
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="module">Current Module</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Team Summary Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Team Summary</CardTitle>
                      {getTeamStatusBadge()}
                    </div>
                    <CardDescription>{team.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Team Code</h3>
                      <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                        <code className="text-sm font-mono">{team.join_code || "No code"}</code>
                        <Button variant="ghost" size="sm" onClick={() => {
                          navigator.clipboard.writeText(team.join_code || "")
                        }}>
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Share this code with others to invite them to your team
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Team Size</h3>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-2xl font-bold">{teamMembers.length}</span>
                        <span className="text-muted-foreground ml-2">members</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {team.max_members ? `Maximum ${team.max_members} members allowed` : "No member limit"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Your Role</h3>
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-sm">
                          {teamMembers.find(m => m.user_id === user?.id)?.is_leader ? "Team Leader" : 
                           teamMembers.find(m => m.user_id === user?.id)?.role || "Member"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {teamMembers.find(m => m.user_id === user?.id)?.is_leader ? 
                          "You can manage team settings and members" : 
                          "You can participate in team projects"}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push("/dashboard/team")}
                    >
                      Manage Team
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Module Progress Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Current Module</CardTitle>
                      {module && (
                        <Badge variant="outline">{teamModule?.status || "Not Started"}</Badge>
                      )}
                    </div>
                    <CardDescription>
                      {module ? module.name : "No module assigned"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {module ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{getProgressPercentage()}%</span>
                          </div>
                          <Progress value={getProgressPercentage()} className="h-2" />
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="border rounded-lg p-3">
                            <div className="text-sm font-medium mb-1">Started</div>
                            <div className="text-xs text-muted-foreground">
                              {teamModule?.started_at ? new Date(teamModule.started_at).toLocaleDateString() : "Not started"}
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <div className="text-sm font-medium mb-1">Deadline</div>
                            <div className="text-xs text-muted-foreground">
                              {teamModule?.deadline ? new Date(teamModule.deadline).toLocaleDateString() : "No deadline"}
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <div className="text-sm font-medium mb-1">Difficulty</div>
                            <div className="text-xs">
                              {module?.difficulty === "Beginner" && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                  Beginner
                                </Badge>
                              )}
                              {module?.difficulty === "Intermediate" && (
                                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                  Intermediate
                                </Badge>
                              )}
                              {module?.difficulty === "Advanced" && (
                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                  Advanced
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Description</h3>
                          <p className="text-sm text-muted-foreground">
                            {module.description?.substring(0, 200)}
                            {module.description?.length > 200 ? "..." : ""}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Module Assigned</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your team hasn't been assigned a module yet. Browse available modules and select one to get started.
                        </p>
                        <Button onClick={() => router.push("/dashboard/modules")}>
                          Browse Modules
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  {module && (
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => router.push(`/dashboard/modules/${module.id}`)}
                      >
                        View Module Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  )}
                </Card>
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col items-center justify-center py-4 gap-2"
                      onClick={() => router.push("/dashboard/resources")}
                    >
                      <BookOpen className="h-6 w-6" />
                      <div className="text-sm">Resources</div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col items-center justify-center py-4 gap-2"
                      onClick={() => router.push("/dashboard/team")}
                    >
                      <Users className="h-6 w-6" />
                      <div className="text-sm">Team</div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col items-center justify-center py-4 gap-2"
                      onClick={() => router.push("/dashboard/modules")}
                    >
                      <Layers className="h-6 w-6" />
                      <div className="text-sm">Modules</div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col items-center justify-center py-4 gap-2"
                      onClick={() => router.push("/dashboard/profile")}
                    >
                      <User className="h-6 w-6" />
                      <div className="text-sm">Profile</div>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                          {team?.name} has {teamMembers.length} members
                        </CardDescription>
                      </div>
                      {getTeamStatusBadge()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={member.profiles?.avatar_url} alt={member.profiles?.name} />
                              <AvatarFallback>{member.profiles?.name ? getInitials(member.profiles.name) : "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.profiles?.name}</div>
                              <div className="text-sm text-muted-foreground">{member.profiles?.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {member.is_leader && (
                              <Badge className="mr-2">Leader</Badge>
                            )}
                            
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push("/dashboard/team")}
                    >
                      Manage Team
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                {teamMembers.find(m => m.user_id === user?.id)?.is_leader && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Team Code</h3>
                        <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                          <code className="text-sm font-mono">{team.join_code || "No code"}</code>
                          <Button variant="ghost" size="sm" onClick={() => {
                            navigator.clipboard.writeText(team.join_code || "")
                          }}>
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">GitHub Repository</h3>
                        {team.github_repo ? (
                          <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                            <div className="flex items-center">
                              <Github className="h-4 w-4 mr-2" />
                              <span className="text-sm">{team.github_repo}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                window.open(`https://github.com/${team.github_repo}`, '_blank')
                              }}
                            >
                              Visit
                            </Button>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No GitHub repository linked
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => router.push("/dashboard/team/settings")}
                      >
                        Team Settings
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="module" className="space-y-6">
                {module ? (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{module.name}</CardTitle>
                          <Badge variant="outline">{teamModule?.status || "Not Started"}</Badge>
                        </div>
                                                <CardDescription>
                          {module.description?.substring(0, 100)}
                          {module.description?.length > 100 ? "..." : ""}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{getProgressPercentage()}%</span>
                          </div>
                          <Progress value={getProgressPercentage()} className="h-2" />
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="border rounded-lg p-3">
                            <div className="text-sm font-medium mb-1">Started</div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm">
                                {teamModule?.started_at ? new Date(teamModule.started_at).toLocaleDateString() : "Not started"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <div className="text-sm font-medium mb-1">Deadline</div>
                            <div className="flex items-center">
                              <CalendarClock className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm">
                                {teamModule?.deadline ? new Date(teamModule.deadline).toLocaleDateString() : "No deadline"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-3">
                            <div className="text-sm font-medium mb-1">Difficulty</div>
                            <div className="text-sm">
                              {module?.difficulty === "Beginner" && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                  Beginner
                                </Badge>
                              )}
                              {module?.difficulty === "Intermediate" && (
                                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                  Intermediate
                                </Badge>
                              )}
                              {module?.difficulty === "Advanced" && (
                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                  Advanced
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium mb-2">Project Phases</h3>
                          <div className="space-y-3">
                            {allPhases.map((phase, index) => {
                              const completed = phases.some(p => p.name === phase)
                              return (
                                <div key={index} className="flex items-center">
                                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                                    completed ? "bg-green-500 text-white" : "border border-muted-foreground/30"
                                  }`}>
                                    {completed && <CheckCircle2 className="h-4 w-4" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className={`text-sm ${completed ? "font-medium" : ""}`}>{phase}</div>
                                    {completed && phases.find(p => p.name === phase)?.completed_at && (
                                      <div className="text-xs text-muted-foreground">
                                        Completed on {new Date(phases.find(p => p.name === phase)?.completed_at).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={() => router.push(`/dashboard/modules/${module.id}`)}
                        >
                          View Module Details
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Resources</CardTitle>
                        <CardDescription>
                          Learning materials and documentation for this module
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {module.resources ? (
                            Array.isArray(module.resources) ? (
                              module.resources.map((resource, index) => (
                                <div key={index} className="flex items-center p-3 border rounded-lg">
                                  <BookOpen className="h-4 w-4 text-muted-foreground mr-3" />
                                  <div className="flex-1">
                                    <div className="font-medium">{resource.title}</div>
                                    <div className="text-sm text-muted-foreground">{resource.description}</div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => {
                                      window.open(resource.url, '_blank')
                                    }}
                                  >
                                    View
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                Resources data format is invalid
                              </div>
                            )
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              No resources available for this module
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => router.push("/dashboard/resources")}
                        >
                          View All Resources
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Module Assigned</CardTitle>
                      <CardDescription>
                        Your team hasn't been assigned a module yet
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-6">
                      <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Start Your Journey</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Browse available modules and select one to get started with your team project.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => router.push("/dashboard/modules")}
                      >
                        Browse Modules
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates and events for your team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {notifications.length > 0 ? (
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex p-3 border rounded-lg">
                            <div className="mr-3 rounded-full bg-primary/10 p-2 h-fit">
                              {notification.type === "phase_completed" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                              {notification.type === "member_joined" && <Users className="h-4 w-4 text-primary" />}
                              {notification.type === "module_assigned" && <Layers className="h-4 w-4 text-primary" />}
                              {!notification.type && <Bell className="h-4 w-4 text-primary" />}
                            </div>
                            <div>
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-sm text-muted-foreground">{notification.message}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                        <p className="text-sm text-muted-foreground">
                          Your team's activity will appear here as you progress through modules.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push("/dashboard/notifications")}
                    >
                      View All Activity
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}

