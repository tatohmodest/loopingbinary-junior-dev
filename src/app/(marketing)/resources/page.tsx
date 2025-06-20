// src/app/(marketing)/resources/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { 
  BookOpen, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Search,
  ExternalLink,
  ArrowRight,
  Info
} from "lucide-react"
import { createClient } from '@supabase/supabase-js'

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Sample resource data
  const resources = [
    {
      id: 1,
      title: "Project Setup Guide",
      description: "Step-by-step guide to setting up your development environment for the community project",
      resource_type: "article",
      roles: ["All Roles"],
      tracks: ["Getting Started"],
      url: "#"
    },
    {
      id: 2,
      title: "Team Formation & Roles",
      description: "How to structure your team and assign roles effectively for maximum productivity",
      resource_type: "article",
      roles: ["Team Lead"],
      tracks: ["Getting Started"],
      url: "#"
    },
    {
      id: 3,
      title: "Introduction to Microservices",
      description: "Learn the basics of microservice architecture for our platform with practical examples",
      resource_type: "video",
      roles: ["All Roles"],
      tracks: ["Getting Started", "Architecture"],
      url: "#"
    },
    {
      id: 4,
      title: "Next.js Crash Course",
      description: "Quick introduction to Next.js for frontend development with practical exercises",
      resource_type: "video",
      roles: ["Frontend Developer"],
      tracks: ["Technical"],
      url: "#"
    },
    {
      id: 5,
      title: "Supabase Authentication Guide",
      description: "Implementing authentication with Supabase for secure user management",
      resource_type: "article",
      roles: ["Backend Developer"],
      tracks: ["Technical"],
      url: "#"
    },
    {
      id: 6,
      title: "React Native Fundamentals",
      description: "Core concepts for mobile development with React Native for cross-platform apps",
      resource_type: "video",
      roles: ["Mobile Developer"],
      tracks: ["Technical"],
      url: "#"
    },
    {
      id: 7,
      title: "API Design Best Practices",
      description: "Guidelines for creating robust and scalable APIs that work well with microservices",
      resource_type: "article",
      roles: ["Backend Developer"],
      tracks: ["Technical"],
      url: "#"
    },
    {
      id: 8,
      title: "Git Workflow for Teams",
      description: "Learn the Git branching strategy for our project with practical examples",
      resource_type: "article",
      roles: ["All Roles"],
      tracks: ["Team Collaboration"],
      url: "#"
    },
    {
      id: 9,
      title: "Code Review Guidelines",
      description: "Best practices for effective code reviews that improve code quality",
      resource_type: "article",
      roles: ["All Roles"],
      tracks: ["Team Collaboration"],
      url: "#"
    },
    {
      id: 10,
      title: "Discord Setup for Dev Teams",
      description: "Organizing your team's Discord for maximum productivity and communication",
      resource_type: "article",
      roles: ["Team Lead"],
      tracks: ["Team Collaboration"],
      url: "#"
    },
    {
      id: 11,
      title: "Module Starter Template",
      description: "Boilerplate code for starting your module development with best practices built-in",
      resource_type: "link",
      roles: ["All Roles"],
      tracks: ["Project Templates"],
      url: "#"
    },
    {
      id: 12,
      title: "Documentation Template",
      description: "Standard format for documenting your module for other teams to understand",
      resource_type: "link",
      roles: ["All Roles"],
      tracks: ["Project Templates"],
      url: "#"
    }
  ];
  
  // Filter resources based on search query
  const filteredResources = resources.filter(resource => {
    // Filter by search query
    const matchesQuery = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesQuery
  });
  
  // Get resource icon based on type
  const getResourceIcon = (type) => {
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
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Learning Resources</h1>
        <p className="text-muted-foreground">
          Access premium courses, guides, and templates to help your team succeed
        </p>
      </div>
      
      {/* Premium Access Note */}
      <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start">
            <div className="mr-4 mt-1 bg-emerald-50 p-2 rounded-full">
              <Info className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Premium Resources</h2>
              <p className="text-sm text-muted-foreground">
                Most resources require team subscription (
                <span className="font-semibold text-[#3ECF8E] bg-emerald-50 px-2 py-0.5 rounded">
                  5,000 XAF/month
                </span>
                ). 
                <Link href="/register" className="font-medium ml-1 text-[#3ECF8E] hover:text-emerald-700 hover:underline">
                  Register your team
                </Link> to unlock full access to all learning materials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search */}
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
      
      {/* Resources Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="link">Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {filteredResources.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-slate-100 p-2">
                        {getResourceIcon(resource.resource_type)}
                      </div>
                      <Badge variant="outline">{resource.resource_type}</Badge>
                    </div>
                    <CardTitle className="mt-4 text-lg">{resource.title}</CardTitle>
                    <CardDescription>
                      {resource.description?.substring(0, 100)}
                      {resource.description?.length > 100 ? "..." : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {resource.roles?.map((role, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                      {resource.tracks?.map((track, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
                  <h3 className="text-xl font-medium mb-2">No Resources Found</h3>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources
              .filter(resource => resource.resource_type.toLowerCase() === "article")
              .map((resource) => (
                <Card key={resource.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-slate-100 p-2">
                        <FileText className="h-5 w-5" />
                      </div>
                      <Badge variant="outline">article</Badge>
                    </div>
                    <CardTitle className="mt-4 text-lg">{resource.title}</CardTitle>
                    <CardDescription>
                      {resource.description?.substring(0, 100)}
                      {resource.description?.length > 100 ? "..." : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {resource.roles?.map((role, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                      {resource.tracks?.map((track, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
        </TabsContent>
        
        <TabsContent value="video" className="space-y-6">
          {/* Content will be filtered by the tab click */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources
              .filter(resource => resource.resource_type.toLowerCase() === "video")
              .map((resource) => (
                <Card key={resource.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-slate-100 p-2">
                        <Video className="h-5 w-5" />
                      </div>
                      <Badge variant="outline">video</Badge>
                    </div>
                    <CardTitle className="mt-4 text-lg">{resource.title}</CardTitle>
                    <CardDescription>
                      {resource.description?.substring(0, 100)}
                      {resource.description?.length > 100 ? "..." : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {resource.roles?.map((role, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                      {resource.tracks?.map((track, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
        </TabsContent>
        
        <TabsContent value="link" className="space-y-6">
          {/* Content will be filtered by the tab click */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources
              .filter(resource => resource.resource_type.toLowerCase() === "link")
              .map((resource) => (
                <Card key={resource.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-slate-100 p-2">
                        <LinkIcon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline">link</Badge>
                    </div>
                    <CardTitle className="mt-4 text-lg">{resource.title}</CardTitle>
                    <CardDescription>
                      {resource.description?.substring(0, 100)}
                      {resource.description?.length > 100 ? "..." : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {resource.roles?.map((role, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                      {resource.tracks?.map((track, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
        </TabsContent>
      </Tabs>
      
      {/* External Resources Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">External Resources</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="mr-3 mt-1 bg-slate-100 p-2 rounded-full">
                  <ExternalLink className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">MDN Web Docs</h3>
                  <p className="text-sm text-muted-foreground mb-4">Comprehensive web development documentation</p>
                  <a 
                    href="https://developer.mozilla.org/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium flex items-center hover:underline"
                  >
                    Visit Resource <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="mr-3 mt-1 bg-slate-100 p-2 rounded-full">
                  <ExternalLink className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">React Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-4">Official React documentation and tutorials</p>
                  <a 
                    href="https://reactjs.org/docs/getting-started.html" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium flex items-center hover:underline"
                  >
                    Visit Resource <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="mr-3 mt-1 bg-slate-100 p-2 rounded-full">
                  <ExternalLink className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Next.js Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-4">Learn about Next.js features and API</p>
                  <a 
                    href="https://nextjs.org/docs" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium flex items-center hover:underline"
                  >
                    Visit Resource <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="mr-3 mt-1 bg-slate-100 p-2 rounded-full">
                  <ExternalLink className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Supabase Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-4">Guides and reference for Supabase</p>
                  <a 
                    href="https://supabase.io/docs" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium flex items-center hover:underline"
                  >
                    Visit Resource <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="mr-3 mt-1 bg-slate-100 p-2 rounded-full">
                  <ExternalLink className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">React Native Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-4">Learn React Native for mobile development</p>
                  <a 
                    href="https://reactnative.dev/docs/getting-started" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium flex items-center hover:underline"
                  >
                    Visit Resource <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Request Resources */}
      <Card className="mt-12 bg-slate-50">
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Additional Resources?</h2>
            <p className="text-sm mb-6 max-w-2xl mx-auto text-muted-foreground">
              If your team needs specific learning materials or templates, let us know and we'll add them.
            </p>
            <Link href="/contact">
              <Button>
                Request Resources <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
