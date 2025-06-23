// src/app/(marketing)/page.tsx
'use client'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  CheckCircle2,
  Code,
  Users,
  Layers,
  Github,
  BookOpen,
  Globe,
  Zap,
  Star,
  BarChart3,
  Award,
  ChevronRight,
  Terminal,
  PanelRight,
  Monitor,
  Laptop
} from "lucide-react"
import { SiteHeader } from "./header"
import { useEffect, useState } from "react"
import AnimatedGridBackground from "@/components/animation/Animation"
import { SiteFooter } from "@/components/footer/footer"
import { ProgramAlertCard } from "@/components/alert"

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([])
  
  useEffect(() => {
    const newParticles = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-[#00bf63]/20 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s'
          }}
        />
      ))}
    </div>
  )
}

// Animated code block component
const AnimatedCodeBlock = () => {
  const [currentLine, setCurrentLine] = useState(0)
  const codeLines = [
    "const team = new Looping Binary Junior Dev()",
    "team.addDeveloper('frontend')",
    "team.addDeveloper('backend')", 
    "team.startProject('ecommerce')",
    "// Building amazing things...",
    "team.deploy() // 🚀 Success!"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % codeLines.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    
    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-hidden">
      <div className="flex items-center mb-3">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-[#00bf63] rounded-full animate-pulse"></div>
        </div>
        <div className="ml-4 text-gray-400 text-xs">Looping Binary Junior Dev-project.js</div>
      </div>
      <div className="space-y-2">
        {codeLines.map((line, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ${
              index <= currentLine 
                ? 'opacity-100 text-green-400' 
                : 'opacity-30 text-gray-500'
            }`}
          >
            <span className="text-gray-600 mr-2">{(index + 1).toString().padStart(2, '0')}</span>
            {line}
            {index === currentLine && (
              <span className="inline-block w-2 h-4 bg-[#00bf63] ml-1 animate-pulse"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Animated stats component
const AnimatedStats = () => {
  const [counts, setCounts] = useState({ projects: 0, developers: 0 })
  
  useEffect(() => {
    const targets = { projects: 20, developers: 100 }
    const duration = 2000
    const steps = 60
    const increment = {
      projects: targets.projects / steps,
      developers: targets.developers / steps,
   
    }
    
    let step = 0
    const timer = setInterval(() => {
      step++
    setCounts({
      projects: Math.min(Math.floor(increment.projects * step), targets.projects),
      developers: Math.min(Math.floor(increment.developers * step), targets.developers),
   
    })
      
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-3 gap-8 text-center">
      <div className="space-y-2">
        <div className="text-3xl font-bold text-[#00bf63] animate-pulse">
          {counts.projects}+
        </div>
        <div className="text-sm text-muted-foreground">Active Projects</div>
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-[#00bf63] animate-pulse">
          {counts.developers.toLocaleString()}+
        </div>
        <div className="text-sm text-muted-foreground">Developers</div>
      </div>
      {/* <div className="space-y-2">
        <div className="text-3xl font-bold text-[#00bf63] animate-pulse">
          {counts.companies}+
        </div>
        <div className="text-sm text-muted-foreground">Hiring Partners</div>
      </div> */}
    </div>
  )
}

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
   <div>
    <ProgramAlertCard />
    <SiteHeader />
    
    <div className="flex flex-col relative">
      <AnimatedGridBackground />
      {/* Animated background gradient */}
    
      
      {/* Hero Section */}
      <section className="relative w-full px-2 md:px-[20px] py-12 md:py-[48px] bg-gradient-to-b from-background to-background/80 overflow-hidden">
        <FloatingParticles />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,191,99,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,191,99,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }} />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
            <div className="flex flex-col justify-center space-y-4 animate-fade-in-up">
              <div className="space-y-2">
                <Badge variant="outline" className="border-[#00bf63]/30 bg-[#00bf63]/10 text-[#00bf63] animate-pulse">
                  🚀 Launch Your Dev Career
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground via-[#00bf63] to-foreground bg-clip-text text-transparent animate-gradient">
                  Build Real Projects in Collaborative Teams
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl animate-fade-in-up animation-delay-300">
                  Join Looping Binary Junior Dev to work on production-grade projects, collaborate with other developers, and build a portfolio that employers actually want to see.
                </p>
              </div>
              
              <div className="flex flex-col gap-2 min-[400px]:flex-row animate-fade-in-up animation-delay-500">
                <Button size="lg" asChild className="bg-[#00bf63] hover:bg-[#00bf63]/90 text-white shadow-lg shadow-[#00bf63]/25 hover:shadow-[#00bf63]/40 transition-all duration-300 hover:scale-101">
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-[#00bf63]/20 hover:border-[#00bf63]/40 hover:bg-[#00bf63]/5 transition-all duration-300">
                  <Link href="/modules">
                    Browse Projects
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm animate-fade-in-up animation-delay-700">
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-[#00bf63] animate-pulse" />
                  <span>Real-world experience</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-[#00bf63] animate-pulse animation-delay-200" />
                  <span>Professional mentorship</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4 text-[#00bf63] animate-pulse animation-delay-400" />
                  <span>Portfolio-ready projects</span>
                </div>
              </div>
              
              {/* Animated stats */}
              <div className="pt-8 animate-fade-in-up animation-delay-1000">
                <AnimatedStats />
              </div>
            </div>
            
            <div className="relative flex items-center justify-center animate-fade-in-left">
              <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-lg border bg-background shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-101">
                <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-background/20 z-10"></div>
                
                {/* Animated browser chrome */}
                <div className="absolute top-6 left-6 right-6 h-7 rounded-full bg-muted flex items-center px-3 z-20">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse animation-delay-200"></div>
                    <div className="h-2 w-2 rounded-full bg-[#00bf63] animate-pulse animation-delay-400"></div>
                  </div>
                  <div className="ml-4 flex-1 text-xs font-medium text-center text-muted-foreground">
                    Looping Binary Junior Dev-ecommerce-project
                  </div>
                </div>
                
                {/* Main content area with animated code */}
                <div className="absolute top-16 left-6 right-6 bottom-6 rounded-lg border bg-card shadow-sm overflow-hidden z-20 flex">
                  <div className="w-64 border-r bg-muted/50 p-4 hidden md:block">
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 rounded-full bg-muted-foreground/20 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded-full bg-muted-foreground/20 animate-pulse animation-delay-100"></div>
                        <div className="h-3 w-full rounded-full bg-muted-foreground/20 animate-pulse animation-delay-200"></div>
                        <div className="h-3 w-2/3 rounded-full bg-muted-foreground/20 animate-pulse animation-delay-300"></div>
                      </div>
                      <div className="h-4 w-3/4 rounded-full bg-muted-foreground/20 animate-pulse animation-delay-400"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded-full bg-muted-foreground/20 animate-pulse animation-delay-500"></div>
                        <div className="h-3 w-full rounded-full bg-muted-foreground/20 animate-pulse animation-delay-600"></div>
                        <div className="h-3 w-3/4 rounded-full bg-muted-foreground/20 animate-pulse animation-delay-700"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-hidden">
                    <AnimatedCodeBlock />
                  </div>
                </div>
                
                {/* Animated glow effects */}
                <div className="absolute top-[70%] -right-12 w-64 h-64 bg-[#00bf63]/20 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-[40%] -left-12 w-72 h-72 bg-[#00bf63]/15 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with enhanced animations */}
      <section className="w-full py-12 md:py-24 bg-muted/50 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #00bf63 2px, transparent 2px)`,
            backgroundSize: '100px 100px',
            animation: 'float 15s ease-in-out infinite'
          }} />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up">
            <div className="space-y-2">
              <Badge variant="outline" className="border-[#00bf63]/30 bg-[#00bf63]/10 text-[#00bf63] animate-bounce">
                ✨ Platform Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-[#00bf63] bg-clip-text text-transparent">
                Everything You Need to Succeed
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Looping Binary Junior Dev provides all the tools and resources you need to build professional projects and advance your career.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Users, title: "Collaborative Teams", desc: "Work together with other developers in structured teams with clear roles and responsibilities.", link: "/features/teams" },
              { icon: Layers, title: "Real-World Projects", desc: "Build production-grade applications that solve actual problems and showcase your skills.", link: "/features/projects" },
              { icon: BookOpen, title: "Guided Learning", desc: "Follow structured modules with clear objectives, resources, and milestones to guide your progress.", link: "/features/learning" },
              { icon: Github, title: "GitHub Integration", desc: "Connect your projects to GitHub repositories for version control, code reviews, and collaboration.", link: "/features/github" },
              { icon: BarChart3, title: "Progress Tracking", desc: "Monitor your development with detailed progress tracking, milestones, and achievement badges.", link: "/features/progress" },
              { icon: Award, title: "Certification", desc: "Earn certificates upon project completion to showcase your achievements to potential employers.", link: "/features/certification" }
            ].map((feature, index) => (
              <Card key={index} className="bg-card border-border/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-101 hover:border-[#00bf63]/20 group animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6 space-y-4">
                  <div className="rounded-full w-12 h-12 bg-[#00bf63]/10 flex items-center justify-center group-hover:bg-[#00bf63]/20 transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-[#00bf63] group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-[#00bf63] transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.desc}
                  </p>
                  <div className="pt-2">
                    <Link href={feature.link} className="inline-flex items-center text-[#00bf63] hover:underline group-hover:animate-pulse">
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Project Showcase Section */}
      <section className="w-full py-12 md:py-24 relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up">
            <div className="space-y-2">
              <Badge variant="outline" className="border-[#00bf63]/30 bg-[#00bf63]/10 text-[#00bf63] animate-pulse">
                🎯 Project Showcase
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground via-[#00bf63] to-foreground bg-clip-text text-transparent animate-gradient">
                Build Projects That Matter
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Explore our diverse range of project modules designed to help you build a professional portfolio.
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="web" className="mt-12 w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8 bg-muted/50 backdrop-blur">
              <TabsTrigger value="web" className="data-[state=active]:bg-[#00bf63]/10 data-[state=active]:text-[#00bf63] transition-all duration-300">Web Apps</TabsTrigger>
              <TabsTrigger value="mobile" className="data-[state=active]:bg-[#00bf63]/10 data-[state=active]:text-[#00bf63] transition-all duration-300">Mobile Apps</TabsTrigger>
              <TabsTrigger value="backend" className="data-[state=active]:bg-[#00bf63]/10 data-[state=active]:text-[#00bf63] transition-all duration-300">Backend Systems</TabsTrigger>
            </TabsList>
            
            {/* Web Apps Tab */}
            <TabsContent value="web" className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-101 hover:border-[#00bf63]/30">
                  <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <Monitor className="h-12 w-12 text-muted-foreground/50 group-hover:text-[#00bf63]/70 transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00bf63]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2 bg-[#00bf63]/10 text-[#00bf63] border-[#00bf63]/20">Intermediate</Badge>
                    <h3 className="text-xl font-bold group-hover:text-[#00bf63] transition-colors duration-300">E-Commerce Platform</h3>
                    <p className="text-muted-foreground mt-2">
                      Build a full-featured online store with product listings, shopping cart, and payment processing.
                    </p>
                    <div className="flex items-center mt-4 space-x-4">
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">React</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Node.js</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">MongoDB</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="relative group overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-101 hover:border-[#00bf63]/30">
                  <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <Monitor className="h-12 w-12 text-muted-foreground/50 group-hover:text-[#00bf63]/70 transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00bf63]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2 bg-[#00bf63]/10 text-[#00bf63] border-[#00bf63]/20">Advanced</Badge>
                    <h3 className="text-xl font-bold group-hover:text-[#00bf63] transition-colors duration-300">Social Media Dashboard</h3>
                    <p className="text-muted-foreground mt-2">
                      Create a real-time social media management platform with analytics and scheduling features.
                    </p>
                    <div className="flex items-center mt-4 space-x-4">
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Next.js</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">GraphQL</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">PostgreSQL</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <Button asChild className="bg-[#00bf63] hover:bg-[#00bf63]/90 text-white shadow-lg shadow-[#00bf63]/25 hover:shadow-[#00bf63]/40 transition-all duration-300 hover:scale-101">
                  <Link href="/modules">
                    View All Web Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            
            {/* Similar structure for mobile and backend tabs... */}
            <TabsContent value="mobile" className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-101 hover:border-[#00bf63]/30">
                  <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <Laptop className="h-12 w-12 text-muted-foreground/50 group-hover:text-[#00bf63]/70 transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00bf63]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2 bg-[#00bf63]/10 text-[#00bf63] border-[#00bf63]/20">Intermediate</Badge>
                    <h3 className="text-xl font-bold group-hover:text-[#00bf63] transition-colors duration-300">Fitness Tracker App</h3>
                    <p className="text-muted-foreground mt-2">
                      Develop a cross-platform mobile app for tracking workouts, nutrition, and health metrics.
                    </p>
                    <div className="flex items-center mt-4 space-x-4">
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">React Native</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Firebase</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Redux</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="relative group overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-101 hover:border-[#00bf63]/30">
                  <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <Laptop className="h-12 w-12 text-muted-foreground/50 group-hover:text-[#00bf63]/70 transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00bf63]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2 bg-[#00bf63]/10 text-[#00bf63] border-[#00bf63]/20">Advanced</Badge>
                    <h3 className="text-xl font-bold group-hover:text-[#00bf63] transition-colors duration-300">Travel Companion</h3>
                    <p className="text-muted-foreground mt-2">
                      Build a travel app with itinerary planning, location-based recommendations, and offline maps.
                    </p>
                    <div className="flex items-center mt-4 space-x-4">
                                          <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Flutter</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Google Maps API</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">SQLite</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <Button asChild className="bg-[#00bf63] hover:bg-[#00bf63]/90 text-white shadow-lg shadow-[#00bf63]/25 hover:shadow-[#00bf63]/40 transition-all duration-300 hover:scale-101">
                  <Link href="/modules">
                    View All Mobile Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="backend" className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-101 hover:border-[#00bf63]/30">
                  <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <Terminal className="h-12 w-12 text-muted-foreground/50 group-hover:text-[#00bf63]/70 transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00bf63]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2 bg-[#00bf63]/10 text-[#00bf63] border-[#00bf63]/20">Intermediate</Badge>
                    <h3 className="text-xl font-bold group-hover:text-[#00bf63] transition-colors duration-300">API Gateway Service</h3>
                    <p className="text-muted-foreground mt-2">
                      Create a scalable API gateway with authentication, rate limiting, and service discovery.
                    </p>
                    <div className="flex items-center mt-4 space-x-4">
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Node.js</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Express</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Redis</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="relative group overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-101 hover:border-[#00bf63]/30">
                  <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <Terminal className="h-12 w-12 text-muted-foreground/50 group-hover:text-[#00bf63]/70 transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00bf63]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2 bg-[#00bf63]/10 text-[#00bf63] border-[#00bf63]/20">Advanced</Badge>
                    <h3 className="text-xl font-bold group-hover:text-[#00bf63] transition-colors duration-300">Microservices Architecture</h3>
                    <p className="text-muted-foreground mt-2">
                      Build a complete microservices ecosystem with service communication, monitoring, and deployment.
                    </p>
                    <div className="flex items-center mt-4 space-x-4">
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Go</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Docker</Badge>
                      <Badge variant="outline" className="group-hover:border-[#00bf63]/30 transition-colors duration-300">Kubernetes</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <Button asChild className="bg-[#00bf63] hover:bg-[#00bf63]/90 text-white shadow-lg shadow-[#00bf63]/25 hover:shadow-[#00bf63]/40 transition-all duration-300 hover:scale-101">
                  <Link href="/modules">
                    View All Backend Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-[#00bf63] rounded-full animate-bounce animation-delay-0"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-[#00bf63] rounded-full animate-bounce animation-delay-1000"></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 bg-[#00bf63] rounded-full animate-bounce animation-delay-2000"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up">
            <div className="space-y-2">
              <Badge variant="outline" className="border-[#00bf63]/30 bg-[#00bf63]/10 text-[#00bf63] animate-pulse">
                🌟 Success Stories
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-[#00bf63] bg-clip-text text-transparent">
                What Our Members Say
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Hear from developers who have transformed their careers through Looping Binary Junior Dev projects.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
           { name: "Daniel Chiemerie", role: "Full Stack Web Developer", initials: "DC", quote: "Using LoopingBinary as a full stack web developer has helped me increase efficiency in productivity based on how we collaborate with team makes it really an amazing experience and I will love for everyone interested in tech to join." },

{ name: "Mossy Mossy Isaker Narcisse", role: "Full Stack Developer", initials: "MMIN", quote: "Mon désir de performer en développement d'applications a été rendu possible par Looping Binary, aussi grâce à ces cours en développement et assistance par des experts, je peux désormais m'affirmer en tant que développeur." },

{ name: "Kouakep Ngamini Dominique Daquin", role: "Full Stack Developer", initials: "KD", quote: "Grâce à Looping Binary j'ai pu développer mes compétences en cloud computing, ce qui m'a permis de mettre un boost à ma carrière." }
].map((testimonial, index) => (
              <Card key={index} className="bg-card border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-101 hover:border-[#00bf63]/20 group animate-fade-in-up" style={{animationDelay: `${index * 200}ms`}}>
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="mr-4">
                      <div className="rounded-full w-12 h-12 bg-[#00bf63]/10 flex items-center justify-center group-hover:bg-[#00bf63]/20 transition-all duration-300 group-hover:scale-110">
                        <span className="text-lg font-bold text-[#00bf63]">{testimonial.initials}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold group-hover:text-[#00bf63] transition-colors duration-300">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current animate-pulse" style={{animationDelay: `${i * 100}ms`}} />
                      ))}
                    </div>
                    <p className="italic group-hover:text-foreground transition-colors duration-300">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="w-full py-12 md:py-24 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00bf63]/5 via-transparent to-[#00bf63]/5 animate-pulse"></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground via-[#00bf63] to-foreground bg-clip-text text-transparent animate-gradient">
                Ready to Build Your Future?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Join Looping Binary Junior Dev today and start building projects that will set you apart from other candidates.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2 animate-fade-in-up animation-delay-300">
              <div className="grid grid-cols-2 gap-4">
                <Button size="lg" asChild className="w-full bg-[#00bf63] hover:bg-[#00bf63]/90 text-white shadow-lg shadow-[#00bf63]/25 hover:shadow-[#00bf63]/40 transition-all duration-300 hover:scale-101">
                  <Link href="/register">
                    Sign Up Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full border-[#00bf63]/20 hover:border-[#00bf63]/40 hover:bg-[#00bf63]/5 transition-all duration-300 hover:scale-101">
                  <Link href="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground animate-pulse">
                No credit card required for free tier. Upgrade anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50 relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up">
            <div className="space-y-2">
              <Badge variant="outline" className="border-[#00bf63]/30 bg-[#00bf63]/10 text-[#00bf63] animate-bounce">
                🚀 Getting Started
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-[#00bf63] bg-clip-text text-transparent">
                How Looping Binary Junior Dev Works
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Our simple process helps you go from beginner to job-ready developer.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            {[
              { icon: Users, step: 1, title: "Create or Join a Team", desc: "Form your own team or join an existing one with developers who share your interests." },
              { icon: Layers, step: 2, title: "Select a Project Module", desc: "Choose from our library of project modules based on your team's skill level and interests." },
              { icon: Code, step: 3, title: "Build Together", desc: "Collaborate on code, follow structured phases, and get guidance when you need it." },
              { icon: Globe, step: 4, title: "Launch & Showcase", desc: "Deploy your project, get certified, and add it to your professional portfolio." }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4 group animate-fade-in-up" style={{animationDelay: `${index * 200}ms`}}>
                <div className="relative">
                  <div className="rounded-full w-16 h-16 bg-[#00bf63]/10 flex items-center justify-center group-hover:bg-[#00bf63]/20 transition-all duration-500 group-hover:scale-110">
                    <step.icon className="h-8 w-8 text-[#00bf63] group-hover:animate-pulse" />
                  </div>
                  <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-[#00bf63] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold group-hover:text-[#00bf63] transition-colors duration-300">{step.title}</h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12 animate-fade-in-up animation-delay-1000">
            <Button size="lg" asChild className="bg-[#00bf63] hover:bg-[#00bf63]/90 text-white shadow-lg shadow-[#00bf63]/25 hover:shadow-[#00bf63]/40 transition-all duration-300 hover:scale-101">
              <Link href="/getting-started">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Technologies Section */}
      <section className="w-full py-12 md:py-24 relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up">
            <div className="space-y-2">
              <Badge variant="outline" className="border-[#00bf63]/30 bg-[#00bf63]/10 text-[#00bf63] animate-pulse">
                💻 Tech Stack
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground via-[#00bf63] to-foreground bg-clip-text text-transparent animate-gradient">
                Modern Technologies
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Build with the latest technologies that employers are looking for.
              </p>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              "React", "Vue.js", "Angular", "Node.js", "Python", "Go",
              "TypeScript", "Docker", "AWS", "MongoDB", "PostgreSQL", "GraphQL"
            ].map((tech, index) => (
              <div key={index} className="flex flex-col items-center justify-center space-y-2 group animate-fade-in-up hover:scale-110 transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                <div className="rounded-full w-16 h-16 bg-muted flex items-center justify-center group-hover:bg-[#00bf63]/10 transition-all duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 group-hover:text-[#00bf63] transition-colors duration-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm font-medium group-hover:text-[#00bf63] transition-colors duration-300">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up">
            <div className="space-y-2">
              <Badge variant="outline" className="border-[#00bf63]/30 bg-[#00bf63]/10 text-[#00bf63] animate-bounce">
                ❓ FAQ
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-[#00bf63] bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                Find answers to common questions about Looping Binary Junior Dev.
              </p>
            </div>
          </div>
          
          <div className="mx-auto max-w-3xl mt-12 space-y-4">
            {[
              { q: "Do I need to be an experienced developer to join?", a: "Not at all! Looping Binary Junior Dev offers projects for all skill levels, from beginner to advanced. You can choose projects that match your current abilities and grow from there." },
              { q: "How are teams formed?", a: "You can either create your own team and invite others to join, or you can join an existing team that's looking for members. Teams typically consist of 3-5 developers with complementary skills." },
              { q: "How long does a typical project take?", a: "Project timelines vary based on complexity and your team's availability. Most projects are designed to be completed in 4-8 weeks with part-time commitment. You can work at your own pace." },
              { q: "Is Looping Binary Junior Dev free to use?", a: "Looping Binary Junior Dev offers a free tier that gives you access to basic features and projects. Premium tiers provide additional benefits like advanced projects, mentorship, and certification." },
              { q: "Can I list Looping Binary Junior Dev projects on my resume?", a: "Absolutely! Looping Binary Junior Dev projects are designed to be portfolio-worthy. You'll have a deployed application, GitHub repository, and documentation that you can showcase to potential employers." }
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-101 hover:border-[#00bf63]/20 group animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#00bf63] transition-colors duration-300">{faq.q}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-12 animate-fade-in-up animation-delay-500">
            <Button variant="outline" asChild className="border-[#00bf63]/20 hover:border-[#00bf63]/40 hover:bg-[#00bf63]/5 transition-all duration-300 hover:scale-101">
              <Link href="/faq">
                View All FAQs
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final Enhanced CTA */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-[#00bf63]/5 via-background to-[#00bf63]/5 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#00bf63]/10 rounded-full animate-pulse animation-delay-0"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#00bf63]/10 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#00bf63]/5 rounded-full animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground via-[#00bf63] to-foreground bg-clip-text text-transparent animate-gradient">
                Start Building Your Future Today
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Join thousands of developers who are advancing their careers through collaborative projects on Looping Binary Junior Dev.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild className="bg-[#00bf63] hover:bg-[#00bf63]/90 text-white shadow-lg shadow-[#00bf63]/25 hover:shadow-[#00bf63]/40 transition-all duration-300 hover:scale-101">
                  <Link href="/register">
                    Sign Up Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-[#00bf63]/20 hover:border-[#00bf63]/40 hover:bg-[#00bf63]/5 transition-all duration-300 hover:scale-101">
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end animate-fade-in-left">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -right-4 h-64 w-64 bg-[#00bf63]/10 rounded-full blur-3xl opacity-70 animate-pulse"></div>
                <Card className="border-border/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-101 hover:border-[#00bf63]/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { icon: Zap, title: "Get Started in Minutes", desc: "Quick and easy onboarding process" },
                        { icon: Users, title: "Join a Supportive Community", desc: "Connect with like-minded developers" },
                        { icon: Code, title: "Build Real Projects", desc: "Create portfolio-worthy applications" },
                        { icon: Globe, title: "Launch Your Career", desc: "Stand out to potential employers" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 group animate-fade-in-up" style={{animationDelay: `${index * 200}ms`}}>
                          <div className="rounded-full w-12 h-12 bg-[#00bf63]/10 flex items-center justify-center group-hover:bg-[#00bf63]/20 transition-all duration-300 group-hover:scale-110">
                            <item.icon className="h-6 w-6 text-[#00bf63] group-hover:animate-pulse" />
                          </div>
                          <div>
                            <h3 className="font-bold group-hover:text-[#00bf63] transition-colors duration-300">{item.title}</h3>
                            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    {/* Add the CSS animations */}
    <style jsx global>{`
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fade-in-left {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      @keyframes grid-move {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out forwards;
      }
      
      .animate-fade-in-left {
        animation: fade-in-left 0.8s ease-out forwards;
      }
      
      .animate-fade-in {
        animation: fade-in 0.6s ease-out forwards;
      }
      
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradient 3s ease infinite;
      }
      
      .animation-delay-100 { animation-delay: 100ms; }
      .animation-delay-200 { animation-delay: 200ms; }
      .animation-delay-300 { animation-delay: 300ms; }
      .animation-delay-400 { animation-delay: 400ms; }
      .animation-delay-500 { animation-delay: 500ms; }
      .animation-delay-600 { animation-delay: 600ms; }
            .animation-delay-700 { animation-delay: 700ms; }
      .animation-delay-1000 { animation-delay: 1000ms; }
      .animation-delay-2000 { animation-delay: 2000ms; }
      
      /* Hover effects for cards */
      .group:hover .group-hover\\:animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      /* Custom scrollbar for better UX */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 191, 99, 0.3);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 191, 99, 0.5);
      }
      
      /* Smooth scroll behavior */
      html {
        scroll-behavior: smooth;
      }
      
      /* Enhanced button hover effects */
      .btn-glow:hover {
        box-shadow: 0 0 20px rgba(0, 191, 99, 0.4);
      }
      
      /* Particle animation */
      @keyframes particle-float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0.1;
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
          opacity: 0.3;
        }
      }
      
      /* Code typing animation */
      @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
      }
      
      @keyframes blink-caret {
        from, to { border-color: transparent; }
        50% { border-color: #00bf63; }
      }
      
      /* Magnetic hover effect for buttons */
      .magnetic-hover {
        transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .magnetic-hover:hover {
        transform: translateY(-2px);
      }
      
      /* Glowing border animation */
      @keyframes glow-border {
        0%, 100% {
          box-shadow: 0 0 5px rgba(0, 191, 99, 0.2);
        }
        50% {
          box-shadow: 0 0 20px rgba(0, 191, 99, 0.4);
        }
      }
      
      .glow-border {
        animation: glow-border 2s ease-in-out infinite;
      }
      
      /* Stagger animation for grid items */
      .stagger-animation > *:nth-child(1) { animation-delay: 0ms; }
      .stagger-animation > *:nth-child(2) { animation-delay: 100ms; }
      .stagger-animation > *:nth-child(3) { animation-delay: 200ms; }
      .stagger-animation > *:nth-child(4) { animation-delay: 300ms; }
      .stagger-animation > *:nth-child(5) { animation-delay: 400ms; }
      .stagger-animation > *:nth-child(6) { animation-delay: 500ms; }
      
      /* Parallax scroll effect */
      .parallax {
        transform: translateZ(0);
        transition: transform 0.1s ease-out;
      }
      
      /* Enhanced focus states for accessibility */
      .focus\\:ring-green:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 191, 99, 0.3);
      }
      
      /* Loading shimmer effect */
      @keyframes shimmer {
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: calc(200px + 100%) 0;
        }
      }
      
      .shimmer {
        background: linear-gradient(90deg, transparent, rgba(0, 191, 99, 0.1), transparent);
        background-size: 200px 100%;
        animation: shimmer 2s infinite;
      }
      
      /* Morphing background */
      @keyframes morph {
        0%, 100% {
          border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%;
        }
        34% {
          border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%;
        }
        67% {
          border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%;
        }
      }
      
      .morph {
        animation: morph 8s ease-in-out infinite;
      }
      
      /* Text reveal animation */
      @keyframes text-reveal {
        0% {
          clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
        }
        100% {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      }
      
      .text-reveal {
        animation: text-reveal 1s ease-out forwards;
      }
      
      /* Floating elements */
      .floating {
        animation: float 6s ease-in-out infinite;
      }
      
      .floating:nth-child(odd) {
        animation-delay: -3s;
      }
      
      /* Interactive hover states */
      .interactive-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .interactive-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 25px 50px -12px rgba(0, 191, 99, 0.25);
      }
      
      /* Gradient text animation */
      .gradient-text {
        background: linear-gradient(45deg, #00bf63, #00ff80, #00bf63);
        background-size: 200% 200%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradient 3s ease infinite;
      }
      
      /* Pulse ring animation */
      @keyframes pulse-ring {
        0% {
          transform: scale(0.33);
        }
        40%, 50% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: scale(1.2);
        }
      }
      
      .pulse-ring {
        animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
      }
      
      /* Typewriter effect */
      .typewriter {
        overflow: hidden;
        border-right: 0.15em solid #00bf63;
        white-space: nowrap;
        margin: 0 auto;
        letter-spacing: 0.15em;
        animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
      }
      
      /* Smooth reveal on scroll */
      .reveal-on-scroll {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease-out;
      }
      
      .reveal-on-scroll.revealed {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Enhanced button animations */
      .btn-enhanced {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .btn-enhanced::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }
      
      .btn-enhanced:hover::before {
        left: 100%;
      }
      
      /* Loading dots animation */
      @keyframes loading-dots {
        0%, 20% {
          color: rgba(0, 191, 99, 0.4);
          text-shadow: 0.25em 0 0 rgba(0, 191, 99, 0.4),
                       0.5em 0 0 rgba(0, 191, 99, 0.4);
        }
        40% {
          color: #00bf63;
          text-shadow: 0.25em 0 0 rgba(0, 191, 99, 0.4),
                       0.5em 0 0 rgba(0, 191, 99, 0.4);
        }
        60% {
          text-shadow: 0.25em 0 0 #00bf63,
                       0.5em 0 0 rgba(0, 191, 99, 0.4);
        }
        80%, 100% {
          text-shadow: 0.25em 0 0 #00bf63,
                       0.5em 0 0 #00bf63;
        }
      }
      
      .loading-dots::after {
        content: '...';
        animation: loading-dots 1.5s infinite;
      }
      
      /* Responsive animations */
      @media (max-width: 768px) {
        .animate-fade-in-up,
        .animate-fade-in-left,
        .animate-fade-in {
          animation-duration: 0.4s;
        }
        
        .interactive-card:hover {
          transform: translateY(-4px) scale(1.01);
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .text-muted-foreground {
          color: inherit;
        }
        
        .bg-\\[\\#00bf63\\]\\/10 {
          background-color: rgba(0, 191, 99, 0.3);
        }
      }

      /* Grid Drift Animation */
      @keyframes grid-drift {
        0% { transform: translate(0, 0); }
        25% { transform: translate(-30px, -30px); }
        50% { transform: translate(30px, -60px); }
        75% { transform: translate(-60px, 30px); }
        100% { transform: translate(0, 0); }
      }
      
      /* Dots Pulse Animation */
      @keyframes dots-pulse {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
      }
      
      /* Glow Pulse Animation */
      @keyframes glow-pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.2); }
      }
      
      /* Floating Animations for Different Shapes */
      @keyframes float-0 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      @keyframes float-1 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(-180deg); }
      }
      
      @keyframes float-2 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-25px) rotate(90deg); }
      }
      
      /* Scanning Lines */
      @keyframes scan-vertical {
        0% { top: -2px; }
        100% { top: 100%; }
      }
      
      @keyframes scan-horizontal {
        0% { left: -2px; }
        100% { left: 100%; }
      }
      
      /* Particle Drift Patterns */
      @keyframes particle-drift-0 {
        0% { transform: translate(0, 0) scale(1); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translate(100px, -100px) scale(0); opacity: 0; }
      }
      
      @keyframes particle-drift-1 {
        0% { transform: translate(0, 0) scale(1); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translate(-100px, 100px) scale(0); opacity: 0; }
      }
      
      @keyframes particle-drift-2 {
        0% { transform: translate(0, 0) scale(1); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translate(150px, 50px) scale(0); opacity: 0; }
      }
      
      @keyframes particle-drift-3 {
        0% { transform: translate(0, 0) scale(1); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translate(-50px, -150px) scale(0); opacity: 0; }
      }
      
      /* Energy Wave Animation */
      @keyframes energy-wave {
        0% { 
          transform: scale(0); 
          opacity: 1; 
        }
        50% { 
          opacity: 0.5; 
        }
        100% { 
          transform: scale(4); 
          opacity: 0; 
        }
      }
      
      /* Enhanced Neon Glow Effect */
      @keyframes neon-glow {
        0%, 100% {
          text-shadow: 
            0 0 5px rgba(0, 191, 99, 0.5),
            0 0 10px rgba(0, 191, 99, 0.5),
            0 0 15px rgba(0, 191, 99, 0.5);
        }
        50% {
          text-shadow: 
            0 0 10px rgba(0, 191, 99, 0.8),
            0 0 20px rgba(0, 191, 99, 0.8),
            0 0 30px rgba(0, 191, 99, 0.8);
        }
      }
      
      /* Circuit Board Animation */
      @keyframes circuit-flow {
        0% { stroke-dashoffset: 100; }
        100% { stroke-dashoffset: 0; }
      }
      
      /* Holographic Effect */
      @keyframes holographic {
        0%, 100% { 
          background-position: 0% 50%; 
          filter: hue-rotate(0deg);
        }
        50% { 
          background-position: 100% 50%; 
          filter: hue-rotate(90deg);
        }
      }
      
      /* Matrix Rain Effect */
      @keyframes matrix-rain {
        0% { transform: translateY(-100vh); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      
      /* Cyber Grid Pulse */
      @keyframes cyber-pulse {
        0%, 100% { 
          box-shadow: 
            0 0 5px rgba(0, 191, 99, 0.3),
            inset 0 0 5px rgba(0, 191, 99, 0.1);
        }
        50% { 
          box-shadow: 
            0 0 20px rgba(0, 191, 99, 0.6),
            inset 0 0 10px rgba(0, 191, 99, 0.3);
        }
      }
      
      /* Data Stream Animation */
      @keyframes data-stream {
        0% { 
          transform: translateX(-100%); 
          opacity: 0; 
        }
        50% { 
          opacity: 1; 
        }
        100% { 
          transform: translateX(100%); 
          opacity: 0; 
        }
      }
      
      /* Responsive Optimizations */
      @media (max-width: 768px) {
        .animate-grid-drift {
          animation-duration: 30s;
        }
        
        .particle-system {
          display: none; /* Reduce particles on mobile */
        }
      }
      
      /* Performance Optimizations */
      .gpu-accelerated {
        transform: translateZ(0);
        will-change: transform, opacity;
      }
      
      /* Accessibility - Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .animated-grid-background * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
        }
      }
      
      /* High contrast mode adjustments */
      @media (prefers-contrast: high) {
        .animated-grid-background {
          opacity: 0.8;
        }
        
        .grid-line {
          stroke: rgba(0, 191, 99, 0.8);
        }
      }
    `}</style>

    <SiteFooter />
    </div>
  )
}


