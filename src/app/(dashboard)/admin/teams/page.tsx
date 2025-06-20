// src/app/(dashboard)/dashboard/admin/teams/page.tsx
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Search, 
  ArrowLeft, 
  Users, 
  Eye,
  Calendar,
  Github,
  ExternalLink,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Team {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  team_code: string
  discord_link: string | null
  github_repo: string | null
  project_url: string | null
  is_private: boolean
  active: boolean
  max_members: number
  created_at: string
  created_by: string
  profiles: {
    name: string | null
    avatar_url: string | null
  }
  team_members: Array<{
    user_id: string
    role: string
    is_leader: boolean
    profiles: {
      name: string | null
      avatar_url: string | null
    }
  }>
  team_modules: Array<{
    status: string
    modules: {
      name: string
    }
  }>
}

export default function TeamsManagement() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [teamDetailsOpen, setTeamDetailsOpen] = useState(false)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select(`
          *,
          profiles!teams_created_by_fkey(name, avatar_url),
          team_members(
            user_id,
            role,
            is_leader,
            profiles(name, avatar_url)
          ),
          team_modules(
            status,
            modules(name)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error("Error fetching teams:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.team_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTeamStatus = (team: Team) => {
    if (!team.active) return { label: "Inactive", color: "bg-gray-500" }
    
    const completedModules = team.team_modules?.filter(tm => tm.status === "completed").length || 0
    const totalModules = team.team_modules?.length || 0
    
    if (totalModules === 0) return { label: "No Modules", color: "bg-yellow-500" }
    if (completedModules === totalModules) return { label: "Completed", color: "bg-green-500" }
    if (completedModules > 0) return { label: "In Progress", color: "bg-blue-500" }
    
    return { label: "Not Started", color: "bg-orange-500" }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "T"
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          
        </div>
      </div>
<div>
            <h1 className="text-3xl font-bold">Teams Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage all teams
            </p>
          </div>
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by team name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const status = getTeamStatus(team)
          const memberCount = team.team_members?.length || 0
          const leader = team.team_members?.find(member => member.is_leader)
          
          return (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={team.logo_url || ""} />
                      <AvatarFallback>
                        {getInitials(team.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Code: {team.team_code}
                      </p>
                    </div>
                  </div>
                  <Badge className={status.color}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {team.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{memberCount}/{team.max_members} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(team.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {leader && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={leader.profiles.avatar_url || ""} />
                      <AvatarFallback className="text-xs">
                        {getInitials(leader.profiles.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      Led by {leader.profiles.name || "Unknown"}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {team.github_repo && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(team.github_repo!, '_blank')}
                      >
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                    {team.project_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(team.project_url!, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTeam(team)
                      setTeamDetailsOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTeams.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No teams found</p>
          </CardContent>
        </Card>
      )}

      {/* Team Details Dialog */}
      <Dialog open={teamDetailsOpen} onOpenChange={setTeamDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
            <DialogDescription>
              Detailed information about the team
            </DialogDescription>
          </DialogHeader>
          {selectedTeam && (
            <div className="space-y-6">
              {/* Team Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedTeam.logo_url || ""} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedTeam.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedTeam.name}</h3>
                  <p className="text-muted-foreground">Code: {selectedTeam.team_code}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getTeamStatus(selectedTeam).color}>
                      {getTeamStatus(selectedTeam).label}
                    </Badge>
                    {selectedTeam.is_private && (
                      <Badge variant="outline">Private</Badge>
                    )}
                  </div>
                </div>
              </div>

              {selectedTeam.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTeam.description}
                  </p>
                </div>
              )}

              {/* Team Members */}
              <div>
                <h4 className="font-medium mb-3">
                  Team Members ({selectedTeam.team_members?.length || 0}/{selectedTeam.max_members})
                </h4>
                <div className="space-y-2">
                  {selectedTeam.team_members?.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.profiles.avatar_url || ""} />
                          <AvatarFallback className="text-xs">
                            {getInitials(member.profiles.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.profiles.name || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      {member.is_leader && (
                        <Badge variant="secondary">Leader</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Modules */}
              {selectedTeam.team_modules && selectedTeam.team_modules.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Assigned Modules</h4>
                  <div className="space-y-2">
                    {selectedTeam.team_modules.map((teamModule, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="font-medium">{teamModule.modules.name}</span>
                        <Badge variant={
                          teamModule.status === 'completed' ? 'default' :
                          teamModule.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {teamModule.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex space-x-4">
                {selectedTeam.github_repo && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedTeam.github_repo!, '_blank')}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                )}
                {selectedTeam.project_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedTeam.project_url!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Project
                  </Button>
                )}
                {selectedTeam.discord_link && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedTeam.discord_link!, '_blank')}
                  >
                    Discord
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
