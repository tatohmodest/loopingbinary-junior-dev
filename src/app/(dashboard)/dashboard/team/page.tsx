"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  UserPlus, 
  Copy, 
  Check, 
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  Loader2,
  Settings,
  AlertCircle,
  MessageSquare,
  Calendar,
  FileText,
  UserCog,
  LogOut,
  Trash2,
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  Star,
  Code,
  Layers,
  X
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TeamPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [team, setTeam] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [teamModules, setTeamModules] = useState<any[]>([])
  const [availableModules, setAvailableModules] = useState<any[]>([])
  const [isLeader, setIsLeader] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [processingAction, setProcessingAction] = useState(false)
  const [activeTab, setActiveTab] = useState("members")
  const [showModuleDialog, setShowModuleDialog] = useState(false)
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [assigningModule, setAssigningModule] = useState(false)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/auth/login")
          return null
        }
        
        return user
      } catch (error) {
        console.error("Error fetching current user:", error)
        router.push("/auth/login")
        return null
      }
    }
    
    const fetchUserTeam = async (userId: string) => {
      try {
        console.log("Fetching team for user:", userId);
        
        // First check if user has created any teams
        const { data: createdTeams, error: createdError } = await supabase
          .from("teams")
          .select("*")
          .eq("created_by", userId);

        console.log('Created teams query result:', { createdTeams, createdError });

        if (createdError) {
          console.error("Error fetching created teams:", createdError);
          throw createdError;
        }

        // If user has created teams, return the first one
        if (createdTeams && createdTeams.length > 0) {
          return {
            team: createdTeams[0],
            isLeader: true
          };
        }

        // If no created teams, check team memberships
        const { data: memberTeams, error: memberError } = await supabase
          .from("team_members")
          .select(`
            id,
            role,
            team_id,
            teams:team_id (*)
          `)
          .eq("user_id", userId);

        console.log('Member teams query result:', { memberTeams, memberError });

        if (memberError) {
          console.error("Error fetching member teams:", memberError);
          throw memberError;
        }

        // No teams found
        if (!memberTeams || memberTeams.length === 0) {
          return null;
        }

        // Find the first valid team membership with team data
        const validMembership = memberTeams.find(mt => mt.teams !== null);
        if (!validMembership) {
          return null;
        }

        return {
          team: validMembership.teams,
          isLeader: validMembership.role === 'admin'
        };
      } catch (error) {
        console.error("Error in fetchUserTeam:", error);
        throw error;
      }
    };

    const fetchTeamModules = async (teamId: string) => {
      try {
        const { data: modules, error } = await supabase
          .from("team_modules")
          .select(`
            *,
            modules (
              id,
              name,
              description,
              difficulty,
              category,
              tech_stack,
              features,
              estimated_duration
            )
          `)
          .eq("team_id", teamId)
          .order("assigned_at", { ascending: false })
        
        if (error) throw error
        return modules || []
      } catch (error) {
        console.error("Error fetching team modules:", error)
        throw error
      }
    }

    const fetchAvailableModules = async () => {
      try {
        const { data: modules, error } = await supabase
          .from("modules")
          .select("*")
          .eq("status", "Available")
          .order("created_at", { ascending: false })
        
        if (error) throw error
        return modules || []
      } catch (error) {
        console.error("Error fetching available modules:", error)
        throw error
      }
    }
    
    const loadTeamData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Step 1: Get current user
        const currentUser = await fetchCurrentUser();
        if (!currentUser) return;
        
        setUser(currentUser);
        console.log("Current user:", currentUser);
        
        // Step 2: Get user's team
        const teamData = await fetchUserTeam(currentUser.id);
        console.log("Team data:", teamData);
        
        if (!teamData) {
          setLoading(false);
          return;
        }
        
        const { team, isLeader: isTeamLeader } = teamData;
        
        // Step 3: Set team data
        setTeam(team);
        setIsLeader(isTeamLeader);
        setIsPrivate(team.is_private);
        
        // Step 4: Get team members
        const { data: members, error: membersError } = await supabase
          .from("team_members")
          .select(`
            id,
            team_id,
            user_id,
            role,
            profiles:user_id (
              id,
              name,
              email,
              role,
              track,
              github_url,
              linkedin_url,
              whatsapp,
              avatar_url
            )
          `)
          .eq("team_id", team.id);
        
        if (membersError) {
          console.error("Error fetching team members:", membersError);
          throw membersError;
        }
        
        console.log("Team members:", members);
        setTeamMembers(members || []);

        // Step 5: Get team modules (only if team is active)
        if (team.active) {
          const modules = await fetchTeamModules(team.id);
          setTeamModules(modules);

          // Step 6: Get available modules for selection
          const available = await fetchAvailableModules();
          setAvailableModules(available);
        }
        
      } catch (error: any) {
        console.error('Error in loadTeamData:', error);
        setError(error.message || "Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    loadTeamData()
  }, [router])
  
  const copyTeamCode = () => {
    if (team?.team_code) {
      navigator.clipboard.writeText(team.team_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    setInviteError(null)
    setInviteSuccess(false)
    
    try {
      if (!inviteEmail || !inviteEmail.includes('@')) {
        throw new Error("Please enter a valid email address")
      }
      
      // Check if the email is already a member
      const emailExists = teamMembers.some(member => 
        member.profiles?.email?.toLowerCase() === inviteEmail.toLowerCase()
      )
      
      if (emailExists) {
        throw new Error("This user is already a member of your team")
      }
      
      // In a real app, this would send an email with the team code
      // For now, we'll just simulate a successful invitation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setInviteSuccess(true)
      setInviteEmail("")
    } catch (error: any) {
      setInviteError(error.message || "Failed to send invitation")
    } finally {
      setInviting(false)
    }
  }

  const handleAssignModule = async () => {
    if (!selectedModule || !team || !isLeader) return
    
    setAssigningModule(true)
    try {
      // Check if team already has 3 modules
      if (teamModules.length >= 1) {
        throw new Error("Your team can only have up to 1 modules at a time")
      }

      // Check if module is already assigned to this team
      const alreadyAssigned = teamModules.some(tm => tm.module_id === selectedModule.id)
      if (alreadyAssigned) {
        throw new Error("This module is already assigned to your team")
      }

      // Assign the module to the team
      const { error } = await supabase
        .from("team_modules")
        .insert([
          {
            team_id: team.id,
            module_id: selectedModule.id,
            status: 'selected'
          }
        ])
        
      if (error) throw error
      
      // Refresh team modules
      const modules = await fetchTeamModules(team.id)
      setTeamModules(modules)
      
      setShowModuleDialog(false)
      setSelectedModule(null)
    } catch (error: any) {
      console.error('Error assigning module:', error)
      setError(error.message || "Failed to assign module")
    } finally {
      setAssigningModule(false)
    }
  }

  const fetchTeamModules = async (teamId: string) => {
    try {
      const { data: modules, error } = await supabase
        .from("team_modules")
        .select(`
          *,
          modules (
            id,
            name,
            description,
            difficulty,
            category,
            tech_stack,
            features,
            estimated_duration
          )
        `)
        .eq("team_id", teamId)
        .order("assigned_at", { ascending: false })
      
      if (error) throw error
      return modules || []
    } catch (error) {
      console.error("Error fetching team modules:", error)
      throw error
    }
  }

  const handleRemoveModule = async (teamModuleId: string) => {
    if (!isLeader) return
    
    try {
      const { error } = await supabase
        .from("team_modules")
        .delete()
        .eq("id", teamModuleId)
        
      if (error) throw error
      
      // Refresh team modules
      const modules = await fetchTeamModules(team.id)
      setTeamModules(modules)
    } catch (error: any) {
      console.error('Error removing module:', error)
      setError(error.message || "Failed to remove module")
    }
  }

  const handleUpdatePrivacy = async (isPrivate: boolean) => {
    if (!team) return
    
    try {
      const { error } = await supabase
        .from("teams")
        .update({ is_private: isPrivate })
        .eq("id", team.id)
        
      if (error) throw error
      
      setIsPrivate(isPrivate)
      setTeam({ ...team, is_private: isPrivate })
    } catch (error: any) {
      console.error('Error updating team privacy:', error)
    }
  }
  
  const handleLeaveTeam = async () => {
    if (!team || !user) return
    
    setProcessingAction(true)
    try {
      // Check if this user is the last admin
      const adminCount = teamMembers.filter(
        member => member.role === 'admin'
      ).length
      
      const isLastAdmin = isLeader && adminCount === 1
      
      if (isLastAdmin) {
        throw new Error("You are the last admin. Please assign another admin before leaving.")
      }
      
      // Remove the current user from the team
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", team.id)
        .eq("user_id", user.id)
        
      if (error) throw error
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error('Error leaving team:', error)
      setError(error.message || "Failed to leave team")
    } finally {
      setProcessingAction(false)
      setConfirmLeaveOpen(false)
    }
  }
  
  const handleDeleteTeam = async () => {
    if (!team || !isLeader) return
    
    setProcessingAction(true)
    try {
      // Delete the team (cascade should handle team members)
      const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", team.id)
        
      if (error) throw error
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error('Error deleting team:', error)
      setError(error.message || "Failed to delete team")
    } finally {
      setProcessingAction(false)
      setConfirmDeleteOpen(false)
    }
  }
  
  const handleRemoveMember = async (memberId: string) => {
    if (!team || !isLeader) return
    
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId)
        
      if (error) throw error
      
      // Update the members list
      setTeamMembers(teamMembers.filter(member => member.id !== memberId))
    } catch (error: any) {
      console.error('Error removing team member:', error)
      setError(error.message || "Failed to remove team member")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "Expert":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "selected":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "in_progress":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return ""
    }
  }
  
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    )
  }
  
  if (!team) {
    return (
      <div className="w-full mx-auto px-4 py-12">
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">No Team Found</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You are not currently a member of any team. Create a new team or join an existing one.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard/team/create">
                <Button className="w-full sm:w-auto">
                  <Users className="mr-2 h-4 w-4" /> Create Team
                </Button>
              </Link>
              <Link href="/dashboard/team/join">
                <Button variant="outline" className="w-full sm:w-auto">
                  <UserPlus className="mr-2 h-4 w-4" /> Join Team
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="w-full mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
            <Badge variant={isPrivate ? "outline" : "secondary"}>
              {isPrivate ? "Private" : "Public"}
            </Badge>
            <Badge variant={team.active ? "default" : "secondary"}>
              {team.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Team Code: <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-sm">{team.team_code}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full" 
                    onClick={copyTeamCode}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? "Copied!" : "Copy team code"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
        
        
        <div className="flex items-center gap-2">
          {isLeader && (
            <Dialog>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your team
                  </DialogDescription>
                </DialogHeader>
                
                {inviteSuccess ? (
                  <div className="py-4">
                    <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                      <AlertDescription className="text-green-600 dark:text-green-400">
                        Invitation sent successfully! The user will receive an email with instructions to join your team.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <form onSubmit={handleInvite} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="inviteEmail">Email Address</Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@example.com"
                        required
                      />
                    </div>
                    
                    {inviteError && (
                      <Alert variant="destructive">
                        <AlertDescription>{inviteError}</AlertDescription>
                      </Alert>
                    )}
                    
                    <DialogFooter>
                      <Button type="submit" disabled={inviting}>
                        {inviting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                          </>
                        ) : (
                          "Send Invitation"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          )}

          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Team settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Team Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {isLeader && (
                <>
                  <DropdownMenuItem onClick={() => handleUpdatePrivacy(!isPrivate)}>
                    {isPrivate ? "Make Team Public" : "Make Team Private"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/team/edit/${team.id}`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Team Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Team
                  </DropdownMenuItem>
                </>
              )}
              
              {!isLeader && (
                <DropdownMenuItem 
                  onClick={() => setConfirmLeaveOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Team
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!team.active && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Team Inactive</AlertTitle>
          <AlertDescription>
            Your team is currently inactive. Module management is only available for active teams.
          </AlertDescription>
        </Alert>
      )}
                <Card>
  <CardHeader>
    <CardTitle>Team Overview</CardTitle>
    <CardDescription>
      Quick access to your team's resources and information
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <Users className="h-5 w-5 text-primary" />
        <div>
          <div className="font-medium">{teamMembers.length} Members</div>
          <div className="text-sm text-muted-foreground">
            Max {team.max_members || 5}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <BookOpen className="h-5 w-5 text-primary" />
        <div>
          <div className="font-medium">{teamModules.length} Modules</div>
          <div className="text-sm text-muted-foreground">
            {teamModules.filter(tm => tm.status === 'completed').length} completed
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <MessageSquare className="h-5 w-5 text-[#5865F2]" />
        <div>
          <div className="font-medium">Discord</div>
          <div className="text-sm text-muted-foreground">
            {team.discord_link ? (
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-[#5865F2]"
                onClick={() => window.open(team.discord_link, '_blank')}
              >
                Join Server
              </Button>
            ) : (
              "Not configured"
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <Code className="h-5 w-5 text-gray-800 dark:text-gray-200" />
        <div>
          <div className="font-medium">Repository</div>
          <div className="text-sm text-muted-foreground">
            {team.github_repo ? (
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-gray-800 dark:text-gray-200"
                onClick={() => window.open(
                  team.github_repo.startsWith('http') 
                    ? team.github_repo 
                    : `https://github.com/${team.github_repo}`, 
                  '_blank'
                )}
              >
                View Code
              </Button>
            ) : (
              "Not configured"
            )}
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Members
          </TabsTrigger>
          {team.active && (
            <TabsTrigger value="modules">
              <BookOpen className="mr-2 h-4 w-4" />
              Modules ({teamModules.length}/1)
            </TabsTrigger>
          )}
          <TabsTrigger value="communication">
            <MessageSquare className="mr-2 h-4 w-4" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="mr-2 h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                {teamMembers.length} {teamMembers.length === 1 ? "member" : "members"} in this team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage 
                          src={member.profiles?.avatar_url || `https://avatar.vercel.sh/${member.profiles?.id}?size=128`} 
                          alt={member.profiles?.name || "Team member"}
                        />
                        <AvatarFallback>
                          {member.profiles?.name?.charAt(0) || member.profiles?.email?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{member.profiles?.name || "Unnamed User"}</h3>
                          {member.role === 'admin' && (
                            <Badge variant="secondary" className="text-xs">
                              Team Lead
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.profiles?.email}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {member.profiles?.role && (
                            <span className="text-xs bg-secondary/50 text-secondary-foreground rounded-full px-2 py-0.5">
                              {member.profiles.role}
                            </span>
                          )}
                          {member.profiles?.track && (
                            <span className="text-xs bg-secondary/50 text-secondary-foreground rounded-full px-2 py-0.5">
                              {member.profiles.track}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:ml-auto">
                      {member.profiles?.whatsapp && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a 
                                href={`https://wa.me/${member.profiles.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full p-2 hover:bg-secondary transition-colors"
                              >
                                <span className="sr-only">WhatsApp</span>
                                <Mail className="h-4 w-4" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>WhatsApp</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {member.profiles?.github_url && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a 
                                href={member.profiles.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full p-2 hover:bg-secondary transition-colors"
                              >
                                <span className="sr-only">GitHub</span>
                                <Github className="h-4 w-4" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>GitHub</p>
                            </TooltipContent>
                          </Tooltip>
                                                </TooltipProvider>
                      )}
                      
                      {member.profiles?.linkedin_url && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a 
                                href={member.profiles.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full p-2 hover:bg-secondary transition-colors"
                              >
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-4 w-4" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>LinkedIn</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {isLeader && member.user_id !== user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <UserCog className="h-4 w-4" />
                              <span className="sr-only">Member actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove from Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            {isLeader && (
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join your team
                      </DialogDescription>
                    </DialogHeader>
                    
                    {inviteSuccess ? (
                      <div className="py-4">
                        <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                          <AlertDescription className="text-green-600 dark:text-green-400">
                            Invitation sent successfully! The user will receive an email with instructions to join your team.
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <form onSubmit={handleInvite} className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="inviteEmail">Email Address</Label>
                          <Input
                            id="inviteEmail"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="colleague@example.com"
                            required
                          />
                        </div>
                        
                        {inviteError && (
                          <Alert variant="destructive">
                            <AlertDescription>{inviteError}</AlertDescription>
                          </Alert>
                        )}
                        
                        <DialogFooter>
                          <Button type="submit" disabled={inviting}>
                            {inviting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                              </>
                            ) : (
                              "Send Invitation"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {team.active && (
          <TabsContent value="modules" className="space-y-6">
            {/* Team Modules */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Modules</CardTitle>
                    <CardDescription>
                      Your team can work on up to 3 modules simultaneously
                    </CardDescription>
                  </div>
                  {isLeader && teamModules.length < 1 && (
                    <Button onClick={() => setShowModuleDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Module
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {teamModules.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {teamModules.map((teamModule) => (
                      <Card key={teamModule.id} className="overflow-hidden">
                        <div className={`h-2 ${getStatusColor(teamModule.status).replace('text-', 'bg-').replace('/10', '')}`}></div>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{teamModule.modules.name}</CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getDifficultyColor(teamModule.modules.difficulty)}>
                                  {teamModule.modules.difficulty}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(teamModule.status)}>
                                  {teamModule.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            {isLeader && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => router.push(`/dashboard/modules/${teamModule.modules.id}`)}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Module
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleRemoveModule(teamModule.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Remove Module
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {teamModule.modules.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{teamModule.modules.estimated_duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{teamModule.modules.category}</span>
                            </div>
                          </div>
                          
                          {teamModule.modules.tech_stack && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {teamModule.modules.tech_stack.slice(0, 3).map((tech: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                                  {tech}
                                </Badge>
                              ))}
                              {teamModule.modules.tech_stack.length > 3 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  +{teamModule.modules.tech_stack.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {/* Progress indicator based on status */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>
                                {teamModule.status === 'selected' && '0%'}
                                {teamModule.status === 'in_progress' && '50%'}
                                {teamModule.status === 'completed' && '100%'}
                              </span>
                            </div>
                            <Progress 
                              value={
                                teamModule.status === 'selected' ? 0 :
                                teamModule.status === 'in_progress' ? 50 :
                                teamModule.status === 'completed' ? 100 : 0
                              } 
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => router.push(`/dashboard/modules/${teamModule.modules.id}`)}
                          >
                            {teamModule.status === 'completed' ? (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                View Completed
                              </>
                            ) : (
                              <>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Continue Working
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Modules</h3>
                    <p className="text-muted-foreground mb-4">
                      Your team hasn't selected any modules yet. Start by adding a module to work on.
                    </p>
                    {isLeader && (
                      <Button onClick={() => setShowModuleDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Module
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
       <TabsContent value="communication" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Team Communication</CardTitle>
      <CardDescription>
        Channels and tools for team collaboration
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Discord Integration */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-5 w-5 text-[#5865F2]" />
            <h3 className="font-medium">Discord Server</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Join your team's Discord server for real-time communication
          </p>
          {team?.discord_link ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(team.discord_link, '_blank')}
              className="border-[#5865F2] text-[#5865F2] hover:bg-[#5865F2] hover:text-white"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Join Discord
            </Button>
          ) : (
            <div className="space-y-2">
              <Button variant="outline" size="sm" disabled>
                No Discord Link Set
              </Button>
              {isLeader && (
                <p className="text-xs text-muted-foreground">
                  Edit team settings to add Discord link
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Team Chat - Coming Soon */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Team Chat</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Built-in messaging system for your team
          </p>
          <Button variant="outline" size="sm" disabled>
            <ExternalLink className="mr-2 h-4 w-4" />
            Coming Soon
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Team Calendar */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Team Calendar</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Schedule meetings and track deadlines
          </p>
          <Button variant="outline" size="sm" disabled>
            <ExternalLink className="mr-2 h-4 w-4" />
            Coming Soon
          </Button>
        </div>
        
        {/* Quick Contact Info */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Quick Contact</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Use the contact links in the Members tab or Discord to reach your teammates directly.
          </p>
          <div className="flex gap-2">
            {team?.discord_link && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(team.discord_link, '_blank')}
                className="text-[#5865F2] border-[#5865F2]"
              >
                Discord
              </Button>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>

     <TabsContent value="resources" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Team Resources</CardTitle>
      <CardDescription>
        Shared documents, links, and project materials
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* GitHub Repository */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="font-medium">GitHub Repository</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Team's shared code repository and project files
          </p>
          {team?.github_repo ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(team.github_repo.startsWith('http') ? team.github_repo : `https://github.com/${team.github_repo}`, '_blank')}
              className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-800"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Repository
            </Button>
          ) : (
            <div className="space-y-2">
              <Button variant="outline" size="sm" disabled>
                No Repository Set
              </Button>
              {isLeader && (
                <p className="text-xs text-muted-foreground">
                  Edit team settings to add GitHub repository
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Project URL */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Project Website</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Live project demo or website
          </p>
          {team?.project_url ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(team.project_url, '_blank')}
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Project
            </Button>
          ) : (
            <div className="space-y-2">
              <Button variant="outline" size="sm" disabled>
                No Project URL Set
              </Button>
              {isLeader && (
                <p className="text-xs text-muted-foreground">
                  Edit team settings to add project URL
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Shared Documents - Coming Soon */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Shared Documents</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Team documentation and project files
          </p>
          <Button variant="outline" size="sm" disabled>
            <ExternalLink className="mr-2 h-4 w-4" />
            Coming Soon
          </Button>
        </div>
        
        {/* Resource Summary */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Available Resources</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Discord Server</span>
              <Badge variant={team?.discord_link ? "default" : "secondary"}>
                {team?.discord_link ? "Active" : "Not Set"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>GitHub Repository</span>
              <Badge variant={team?.github_repo ? "default" : "secondary"}>
                {team?.github_repo ? "Active" : "Not Set"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Project Website</span>
              <Badge variant={team?.project_url ? "default" : "secondary"}>
                {team?.project_url ? "Active" : "Not Set"}
              </Badge>
            </div>
          </div>
          {isLeader && (
            <div className="mt-3 pt-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push(`/dashboard/team/${team.id}/settings`)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Resources
              </Button>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>

      </Tabs>

      {/* Module Selection Dialog */}
      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Module to Team</DialogTitle>
            <DialogDescription>
              Select a module for your team to work on. You can have up to 3 active modules.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 overflow-y-auto">
            {availableModules.length > 0 ? (
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {availableModules
                  .filter(module => !teamModules.some(tm => tm.module_id === module.id))
                  .map((module) => (
                  <Card 
                    key={module.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedModule?.id === module.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedModule(module)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {module.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{module.estimated_duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{module.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{module.tech_stack?.length || 0} technologies</span>
                        </div>
                      </div>
                      
                      {module.tech_stack && (
                        <div className="flex flex-wrap gap-1">
                          {module.tech_stack.slice(0, 5).map((tech: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                              {tech}
                            </Badge>
                          ))}
                          {module.tech_stack.length > 5 && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              +{module.tech_stack.length - 5}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Available Modules</h3>
                <p className="text-muted-foreground">
                  There are currently no modules available for selection.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModuleDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignModule}
              disabled={!selectedModule || assigningModule}
            >
              {assigningModule ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Module
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Team Confirmation Dialog */}
      <Dialog open={confirmLeaveOpen} onOpenChange={setConfirmLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmLeaveOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLeaveTeam}
              disabled={processingAction}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Leaving...
                </>
              ) : (
                "Leave Team"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team? This will remove all members and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTeam}
              disabled={processingAction}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Team"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

