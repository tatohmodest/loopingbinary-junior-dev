// src/app/(dashboard)/dashboard/resources/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Search,
  ExternalLink
} from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function ResourcesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [resources, setResources] = useState<any[]>([])
  const [filteredResources, setFilteredResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
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
        
        // Fetch user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          
        setProfile(profileData)
        
        // Fetch resources
        const { data: resourcesData } = await supabase
          .from("resources")
          .select("*")
          .order("created_at", { ascending: false })
          
        setResources(resourcesData || [])
        setFilteredResources(resourcesData || [])
      } catch (error) {
        console.error("Error fetching resources:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [router])
  
  useEffect(() => {
    if (resources.length > 0) {
      const filtered = resources.filter(resource => {
        // Filter by search query
        const matchesQuery = searchQuery === "" || 
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
        
        return matchesQuery
      })
      
      setFilteredResources(filtered)
    }
  }, [searchQuery, resources])
  
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "article":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "link":
        return <LinkIcon className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }
  
  const filterByType = (type: string) => {
    if (type === "all") {
      setFilteredResources(resources)
    } else {
      const filtered = resources.filter(resource => 
        resource.resource_type.toLowerCase() === type.toLowerCase()
      )
      setFilteredResources(filtered)
    }
  }
  
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Learning Resources</h2>
        <p className="text-muted-foreground">
          Access learning materials for your role and track
        </p>
      </div>
      
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => filterByType("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="article" onClick={() => filterByType("article")}>
            Articles
          </TabsTrigger>
          <TabsTrigger value="video" onClick={() => filterByType("video")}>
            Videos
          </TabsTrigger>
          <TabsTrigger value="link" onClick={() => filterByType("link")}>
            Links
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {filteredResources.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-primary/10 p-2">
                        {getResourceIcon(resource.resource_type)}
                      </div>
                      <Badge variant="outline">{resource.resource_type}</Badge>
                    </div>
                    <CardTitle className="mt-4">{resource.title}</CardTitle>
                    <CardDescription>
                      {resource.description?.substring(0, 100)}
                      {resource.description?.length > 100 ? "..." : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {resource.roles?.map((role: string) => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                      {resource.tracks?.map((track: string) => (
                        <Badge key={track} variant="outline" className="text-xs">
                          {track}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {resource.url && (
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          View Resource <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-6">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Resources Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No resources match your search for "${searchQuery}"`
                      : "No resources are available at the moment"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="article" className="space-y-6">
          {/* Content will be filtered by the tab click */}
        </TabsContent>
        
        <TabsContent value="video" className="space-y-6">
          {/* Content will be filtered by the tab click */}
        </TabsContent>
        
        <TabsContent value="link" className="space-y-6">
          {/* Content will be filtered by the tab click */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
