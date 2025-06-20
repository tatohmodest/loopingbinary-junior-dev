// src/app/(marketing)/features/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { 
  ArrowRight, 
  Search, 
  Code, 
  Layout, 
  Smartphone, 
  Server, 
  Shield, 
  MessageSquare,
  Bell,
  FileText,
  Settings,
  PanelLeft,
  Palette,
  GitBranch,
  CheckCircle,
  Database,
  Loader2,
  Star,
  Clock,
  Layers,
  AlertCircle
} from "lucide-react"

interface Module {
  id: string
  name: string
  description: string
  difficulty: string
  category: string
  tech_stack: string[]
  estimated_duration: string
  learning_objectives: string[]
  popularity: number
  status: string
  created_at: string
}

export default function FeaturesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [modules, setModules] = useState<Module[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchModules()
  }, [])

  useEffect(() => {
    // Filter modules based on search query
    const filtered = modules.filter(module => 
      searchQuery === "" || 
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (module.tech_stack && module.tech_stack.some(tech => 
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    )
    setFilteredModules(filtered)
  }, [modules, searchQuery])

  const fetchModules = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('status', 'Available')
        .order('created_at', { ascending: false })

      if (error) throw error

      setModules(data || [])
      setFilteredModules(data || [])
    } catch (error: any) {
      console.error('Error fetching modules:', error)
      setError('Failed to load modules. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleModuleSelect = async (moduleId: string) => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login')
        return
      }

      // If authenticated, redirect to dashboard modules page with the specific module
      router.push(`/dashboard/modules/${moduleId}`)
    } catch (error) {
      console.error('Error checking authentication:', error)
      router.push('/login')
    }
  }

  // Helper function to get difficulty badge variant
  const getDifficultyVariant = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner": return "outline"
      case "Intermediate": return "secondary"
      case "Advanced": return "default"
      case "Expert": return "destructive"
      default: return "outline"
    }
  }

  // Helper function to get difficulty color
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

  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    switch(category?.toLowerCase()) {
      case "frontend": return <Layout className="h-5 w-5" />
      case "backend": return <Server className="h-5 w-5" />
      case "mobile": return <Smartphone className="h-5 w-5" />
      case "devops": return <GitBranch className="h-5 w-5" />
      case "security": return <Shield className="h-5 w-5" />
      case "database": return <Database className="h-5 w-5" />
      case "ui/ux": return <Palette className="h-5 w-5" />
      default: return <Code className="h-5 w-5" />
    }
  }

  // Get unique categories from modules
  const getUniqueCategories = () => {
    const categories = modules.map(module => module.category).filter(Boolean)
    return [...new Set(categories)]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
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
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Available Learning Modules</h1>
        <p className="text-muted-foreground">
          Discover hands-on learning modules designed to build real-world skills. Join a team and start your learning journey.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Module Selection Guide */}
      <Card className="mb-8 border border-slate-200">
        <CardHeader>
          <CardTitle>How Learning Modules Work</CardTitle>
          <CardDescription>
            Each module is a comprehensive learning experience designed to teach you practical skills through real projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                What you'll get from each module:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Hands-on project-based learning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Real-world skills and technologies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Team collaboration experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Portfolio-worthy projects</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm text-muted-foreground">Consider when selecting:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Your current skill level</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Technologies you want to learn</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Time commitment available</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Your learning goals</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredModules.length} modules available
        </div>
      </div>
      
      {/* Tabs for filtering by category */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Modules</TabsTrigger>
          {getUniqueCategories().map(category => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {filteredModules.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredModules.map((module) => (
                <Card key={module.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <div className={`h-2 ${getDifficultyColor(module.difficulty).replace('text-', 'bg-').replace('/10', '/50')}`}></div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="rounded-full text-black bg-slate-100 p-2">
                        {getCategoryIcon(module.category)}
                      </div>
                      <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-lg leading-tight">{module.name}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    {/* Duration and Category */}
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

                    {/* Tech Stack */}
                    {module.tech_stack && module.tech_stack.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Technologies</div>
                        <div className="flex flex-wrap gap-1">
                          {module.tech_stack.slice(0, 4).map((tech, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
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

                    {/* Learning Objectives */}
                    {module.learning_objectives && module.learning_objectives.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">You'll Learn</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {module.learning_objectives.slice(0, 2).map((objective, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
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

                    {/* Popularity */}
                    {module.popularity > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="h-3 w-3" />
                        {module.popularity} teams have chosen this module
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleModuleSelect(module.id)}
                    >
                      Select This Module <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-6">
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Modules Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No modules match your search for "${searchQuery}"`
                      : "No modules are currently available"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Category-specific tabs */}
        {getUniqueCategories().map(category => (
          <TabsContent key={category} value={category.toLowerCase()} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredModules
                .filter(module => module.category.toLowerCase() === category.toLowerCase())
                .map((module) => (
                  <Card key={module.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <div className={`h-2 ${getDifficultyColor(module.difficulty).replace('text-', 'bg-').replace('/10', '/50')}`}></div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="rounded-full text-black bg-slate-100 p-2">
                          {getCategoryIcon(module.category)}
                        </div>
                        <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="mt-4 text-lg leading-tight">{module.name}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      {/* Duration and Category */}
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

                      {/* Tech Stack */}
                      {module.tech_stack && module.tech_stack.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Technologies</div>
                          <div className="flex flex-wrap gap-1">
                            {module.tech_stack.slice(0, 4).map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
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

                      {/* Learning Objectives */}
                      {module.learning_objectives && module.learning_objectives.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">You'll Learn</div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {module.learning_objectives.slice(0, 2).map((objective, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
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

                      {/* Popularity */}
                      {module.popularity > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star className="h-3 w-3" />
                          {module.popularity} teams have chosen this module
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleModuleSelect(module.id)}
                      >
                        Select This Module <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* CTA */}
      <Card className="mt-12">
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="mb-6 max-w-2xl mx-auto text-muted-foreground">
              Join our platform, form a team, and start building real-world projects that matter.
            </p>
            <Button onClick={() => router.push('/register')}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
