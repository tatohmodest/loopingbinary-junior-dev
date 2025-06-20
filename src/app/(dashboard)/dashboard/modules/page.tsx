"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  BookOpen,
  Code,
  Users,
  Info,
  Star,
  StarHalf,
  BarChart3,
  CalendarClock,
  Tag,
  Plus,
  AlertCircle
} from "lucide-react"

export default function ModulesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [team, setTeam] = useState<any>(null)
  const [teamModules, setTeamModules] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [filteredModules, setFilteredModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLeader, setIsLeader] = useState(false)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/login")
          return
        }
        
        setUser(user)
        
        // Fetch user's team
        const { data: teamMember } = await supabase
          .from("team_members")
          .select("team_id, role")
          .eq("user_id", user.id)
          .single()
          
        if (teamMember) {
          const { data: teamData } = await supabase
            .from("teams")
            .select("*")
            .eq("id", teamMember.team_id)
            .single()
            
          setTeam(teamData)
          setIsLeader(teamMember.role === 'Team Leader')
          
          // Fetch team's current modules
          const { data: teamModulesData } = await supabase
            .from("team_modules")
            .select(`
              *,
              modules (*)
            `)
            .eq("team_id", teamMember.team_id)
            
          setTeamModules(teamModulesData || [])
        }
        
        // Fetch all modules
        const { data: modulesData, error: modulesError } = await supabase
          .from("modules")
          .select("*")
          .eq("status", "Available")
          .order("created_at", { ascending: false })
          
        if (modulesError) throw modulesError
        
        setModules(modulesData || [])
        setFilteredModules(modulesData || [])
      } catch (error: any) {
        setError(error.message || "Failed to load modules")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [router])
  
  useEffect(() => {
    // Apply filters and sorting
    let result = [...modules]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        module => 
          module.name.toLowerCase().includes(query) || 
          (module.description && module.description.toLowerCase().includes(query))
      )
    }
    
    // Difficulty filter
    if (difficultyFilter !== "all") {
      result = result.filter(module => module.difficulty === difficultyFilter)
    }
    
    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(module => module.category === categoryFilter)
    }
    
    // Sorting
    if (sortBy === "popular") {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === "difficulty-asc") {
      const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3, "Expert": 4 }
      result.sort((a, b) => difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder])
    } else if (sortBy === "difficulty-desc") {
      const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3, "Expert": 4 }
      result.sort((a, b) => difficultyOrder[b.difficulty as keyof typeof difficultyOrder] - difficultyOrder[a.difficulty as keyof typeof difficultyOrder])
    }
    
    setFilteredModules(result)
  }, [modules, searchQuery, difficultyFilter, categoryFilter, sortBy])
  
  const handleModuleAction = async (moduleId: string) => {
    if (!team) {
      router.push("/dashboard/team/create")
      return
    }

    if (!team.active) {
      setError("Your team must be active to work on modules")
      return
    }
    
    // Check if team already has this module
    const hasModule = teamModules.some(tm => tm.module_id === moduleId)
    if (hasModule) {
      router.push(`/dashboard/modules/${moduleId}`)
      return
    }

    // Check if team can add more modules (limit changed to 1)
    if (teamModules.length >= 1) {
      setError("Your team can only work on 1 module at a time")
      return
    }

    if (!isLeader) {
      setError("Only team leaders can assign new modules")
      return
    }
    
    // Assign the module
    try {
      const { error } = await supabase
        .from("team_modules")
        .insert([
          {
            team_id: team.id,
            module_id: moduleId,
            status: 'selected'
          }
        ])
        
      if (error) throw error
      
      router.push(`/dashboard/modules/${moduleId}`)
    } catch (error: any) {
      setError(error.message || "Failed to assign module")
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
  
  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return (
          <div className="flex text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4" />
            <Star className="h-4 w-4" />
            <Star className="h-4 w-4" />
          </div>
        )
      case "Intermediate":
        return (
          <div className="flex text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4" />
            <Star className="h-4 w-4" />
          </div>
        )
      case "Advanced":
        return (
          <div className="flex text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4" />
          </div>
        )
      case "Expert":
        return (
          <div className="flex text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
          </div>
        )
      default:
        return null
    }
  }
  
  const getUniqueCategories = () => {
    const categories = modules.map(module => module.category).filter(Boolean)
    return [...new Set(categories)]
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading modules...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Modules</h1>
          <p className="text-muted-foreground">
            Explore and work on hands-on learning modules with your team
          </p>
        </div>
        
        {!team && (
          <Button onClick={() => router.push("/dashboard/team/create")}>
            <Users className="mr-2 h-4 w-4" />
            Create Team First
          </Button>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Team Status Alert */}
      {team && !team.active && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your team needs to be activated before you can work on modules. Contact your team leader or complete the team setup process.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Modules</TabsTrigger>
          <TabsTrigger value="active" disabled={!team}>
            Active Module {teamModules.length > 0 && `(${teamModules.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-6">
          {/* Current Module Alert */}
          {teamModules.length > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your team is currently working on <strong>{teamModules[0].modules.name}</strong>. 
                Complete this module before selecting a new one.
              </AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search modules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getUniqueCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="difficulty-asc">Difficulty: Easy to Hard</SelectItem>
                      <SelectItem value="difficulty-desc">Difficulty: Hard to Easy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                Showing {filteredModules.length} of {modules.length} modules
              </div>
            </CardContent>
          </Card>
          
          {/* Modules Grid */}
          {filteredModules.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredModules.map((module) => {
                const isAssigned = teamModules.some(tm => tm.module_id === module.id)
                const canAssign = team && team.active && isLeader && teamModules.length < 1 && !isAssigned
                
                return (
                  <Card key={module.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`h-2 ${getDifficultyColor(module.difficulty).replace('text-', 'bg-').replace('/10', '/50')}`}></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg leading-tight">{module.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                              {module.difficulty}
                            </Badge>
                            {isAssigned && (
                              <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getDifficultyStars(module.difficulty)}
                          {module.popularity && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {module.popularity}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {module.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{module.estimated_duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span>{module.category}</span>
                        </div>
                      </div>
                      
                      {module.tech_stack && module.tech_stack.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Code className="h-4 w-4" />
                            Technologies
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {module.tech_stack.slice(0, 4).map((tech: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                                {tech}
                              </Badge>
                            ))}
                            {module.tech_stack.length > 4 && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                +{module.tech_stack.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {module.learning_objectives && module.learning_objectives.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Learning Objectives</div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {module.learning_objectives.slice(0, 2).map((objective: string, i: number) => (
                              <li key={i} className="flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                                {objective}
                              </li>
                            ))}
                            {module.learning_objectives.length > 2 && (
                              <li className="text-muted-foreground/70">
                                +{module.learning_objectives.length - 2} more objectives
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleModuleAction(module.id)}
                        variant={isAssigned ? "outline" : "default"}
                        disabled={!team || (!team.active && !isAssigned)}
                      >
                        {!team ? (
                          <>
                            <Users className="mr-2 h-4 w-4" />
                            Create Team First
                          </>
                        ) : isAssigned ? (
                          <>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Continue Module
                          </>
                        ) : canAssign ? (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Assign to Team
                          </>
                        ) : !team.active ? (
                          "Team Not Active"
                        ) : !isLeader ? (
                          "Leader Only"
                        ) : teamModules.length >= 1 ? (
                          "Complete Current Module First"
                        ) : (
                          <>
                            <BookOpen className="mr-2 h-4 w-4" />
                            View Details
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Modules Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || difficultyFilter !== "all" || categoryFilter !== "all" 
                  ? "Try adjusting your filters to see more modules."
                  : "No modules are currently available."
                }
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-6">
          {team ? (
            teamModules.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Your Team's Current Module</h2>
                    <p className="text-muted-foreground">
                      Currently working on {teamModules[0].modules.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">1/1</div>
                    <div className="text-sm text-muted-foreground">Active Module</div>
                  </div>
                </div>
                
                <Progress value={100} className="h-2" />
                
                <div className="max-w-2xl mx-auto">
                  {teamModules.map((teamModule) => (
                    <Card key={teamModule.id} className="overflow-hidden">
                      <div className={`h-2 ${
                        teamModule.status === 'completed' ? 'bg-green-500' :
                        teamModule.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-gray-300'
                      }`}></div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{teamModule.modules.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className={getDifficultyColor(teamModule.modules.difficulty)}>
                                {teamModule.modules.difficulty}
                              </Badge>
                              <Badge variant="outline" className={
                                teamModule.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                teamModule.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                'bg-gray-500/10 text-gray-600 border-gray-500/20'
                              }>
                                {teamModule.status === 'selected' && 'Not Started'}
                                {teamModule.status === 'in_progress' && 'In Progress'}
                                {teamModule.status === 'completed' && 'Completed'}
                              </Badge>
                            </div>
                          </div>
                          {getDifficultyStars(teamModule.modules.difficulty)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        <p className="text-muted-foreground">
                          {teamModule.modules.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{teamModule.modules.estimated_duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <span>{teamModule.modules.category}</span>
                          </div>
                        </div>
                        
                        {teamModule.modules.tech_stack && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Code className="h-4 w-4" />
                              Technologies
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {teamModule.modules.tech_stack.map((tech: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-sm px-2 py-1">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
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
                        
                        {teamModule.started_at && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarClock className="h-3 w-3" />
                            Started {new Date(teamModule.started_at).toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={() => router.push(`/dashboard/modules/${teamModule.modules.id}`)}
                          variant={teamModule.status === 'completed' ? 'outline' : 'default'}
                        >
                          {teamModule.status === 'completed' ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              View Completed
                            </>
                          ) : (
                            <>
                              <ArrowRight className="mr-2 h-4 w-4" />
                              {teamModule.status === 'selected' ? 'Start Module' : 'Continue'}
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Module</h3>
                <p className="text-muted-foreground mb-4">
                  Your team hasn't started a module yet. Browse available modules to get started.
                </p>
                <Button onClick={() => router.push("/dashboard/modules?tab=browse")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Browse Modules
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Team Found</h3>
              <p className="text-muted-foreground mb-4">
                You need to be part of a team to work on modules.
              </p>
              <Button onClick={() => router.push("/dashboard/team/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Create or Join Team
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
