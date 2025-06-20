// src/app/(marketing)/teams/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search, 
  Users, 
  ExternalLink, 
  Github, 
  MessageSquare,
  ArrowRight,
  Plus,
  Filter,
  Info,
  Loader2,
  Lock
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [teams, setTeams] = useState([])
  const [teamMembers, setTeamMembers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true)
        
        // Fetch only public teams
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('*')
          .eq('is_private', false)
        
        if (teamsError) throw teamsError
        
        // Fetch team members for all teams
        const teamIds = teamsData.map(team => team.id)
        const { data: membersData, error: membersError } = await supabase
          .from('team_members')
          .select('*, user:user_id(*)')
          .in('team_id', teamIds)
        
        if (membersError) throw membersError
        
        // Organize members by team
        const membersByTeam = {}
        membersData.forEach(member => {
          if (!membersByTeam[member.team_id]) {
            membersByTeam[member.team_id] = []
          }
          membersByTeam[member.team_id].push(member)
        })
        
        setTeams(teamsData)
        setTeamMembers(membersByTeam)
      } catch (error) {
        console.error('Error fetching teams:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeams()
  }, [])
  
  // Filter teams based on search query
  const filteredTeams = teams.filter(team => {
    const matchesQuery = searchQuery === "" || 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.description && team.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // We don't have a status field in the data, so we'll use active as a proxy
    // You can adjust this based on your actual data structure
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && team.active) ||
      (statusFilter === "inactive" && !team.active)
    
    return matchesQuery && matchesStatus
  })
  
  // Helper to determine team capacity
  const getTeamCapacity = (teamId) => {
    const members = teamMembers[teamId] || []
    const maxMembers = teams.find(t => t.id === teamId)?.max_members || 5
    return {
      current: members.length,
      max: maxMembers,
      percentage: (members.length / maxMembers) * 100
    }
  }
  
  // Helper to find team leader
  const getTeamLeader = (teamId) => {
    const members = teamMembers[teamId] || []
    return members.find(member => member.is_leader)
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="text-muted-foreground">
          Browse active teams or join an existing team to start collaborating
        </p>
      </div>
      
      {/* Info Card */}
      <Card className="mb-8 border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
              <Info className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Team Collaboration</h2>
              <p className="text-sm text-muted-foreground">
                Each team works on a specific module of the platform. You can join an existing team with open slots or 
                <Link href="/register" className="font-medium ml-1 text-slate-900 hover:underline">
                  register your own team
                </Link>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="active">Active Teams</SelectItem>
              <SelectItem value="inactive">Inactive Teams</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Create Team Button */}
      <div className="mb-8">
        <Link href="/register?create=team">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Create Your Team
          </Button>
        </Link>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading teams...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <Card className="border-red-200 mb-8">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading teams: {error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Teams Grid */}
      {!loading && !error && (
        <>
          {filteredTeams.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredTeams.map((team) => {
                const capacity = getTeamCapacity(team.id)
                const leader = getTeamLeader(team.id)
                const members = teamMembers[team.id] || []
                
                return (
                  <Card key={team.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{team.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {team.active ? 
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Active</Badge> : 
                              <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200">Inactive</Badge>
                            }
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {team.join_code}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-muted-foreground mb-4">{team.description || "No description provided."}</p>
                      
                      {/* Team Leader */}
                      {leader && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Team Leader</h3>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback className="bg-slate-100 text-slate-600">
                                {leader.user?.name?.charAt(0) || leader.role?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{leader.user?.name || leader.role || "Team Leader"}</p>
                              {leader.user?.whatsapp && (
                                <a 
                                  href={`https://wa.me/${leader.user.whatsapp.replace(/\+/g, '')}`} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-slate-600 hover:underline flex items-center"
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Contact on WhatsApp
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Team Capacity */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-sm font-medium">Team Capacity</h3>
                          <span className="text-xs text-muted-foreground">
                            {capacity.current}/{capacity.max} members
                          </span>
                        </div>
                        <Progress value={capacity.percentage} className="h-2" />
                      </div>
                      
                      {/* Team Members */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Team Members</h3>
                        <div className="flex flex-wrap gap-2">
                          {members.map(member => (
                            <Badge key={member.id} variant="outline" className="text-xs">
                              {member.role || "Member"}
                            </Badge>
                          ))}
                          {Array.from({ length: capacity.max - capacity.current }).map((_, index) => (
                            <Badge key={`empty-${index}`} variant="outline" className="text-xs text-black bg-slate-50 border-dashed">
                              Open Position
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Links */}
                      <div className="flex flex-wrap gap-4 text-xs">
                        {team.discord_link && (
                          <a 
                            href={team.discord_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-900 flex items-center"
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            Discord
                          </a>
                        )}
                        {team.github_repo && (
                          <a 
                            href={team.github_repo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-900 flex items-center"
                          >
                            <Github className="h-3.5 w-3.5 mr-1" />
                            Repository
                          </a>
                        )}
                        {team.project_url && (
                          <a 
                            href={team.project_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-900 flex items-center"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Project
                          </a>
                        )}
                      </div>
                      
                      {/* Created At */}
                      <div className="mt-4 text-xs text-muted-foreground">
                        Created: {format(new Date(team.created_at), "MMM d, yyyy")}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      {capacity.current < capacity.max ? (
                        <Link href={`/dashboard/team/join?code=${team.join_code}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            <Users className="mr-2 h-4 w-4" /> Join Team
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Team Full
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Teams Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? `No teams match your search for "${searchQuery}"`
                      : "No public teams are available at the moment"}
                  </p>
                  <Link href="/register?create=team">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create a Team
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
