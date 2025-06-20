// src/app/(marketing)/blog/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Calendar, 
  Clock, 
  ArrowRight, 
  Search,
  BookOpen,
  Rocket,
  Globe,
  Users,
  Code
} from "lucide-react"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  // Featured blog post by the founder
  const featuredPost = {
    id: 1,
    title: "How the LoopingBinary Junior Dev Program Is Changing the Game for Aspiring Developers in Africa",
    excerpt: "By Tatoh Modest Wilton, Founder & CEO of LoopingBinary. The dream behind it all and why LB JDP matters for Africa's tech future.",
    date: "June 20, 2025",
    readTime: "8 min read",
    image: "/images/blog/featured-post.jpg",
    slug: "changing-the-game-for-aspiring-developers-africa",
    category: "Founder's Vision",
    author: {
      name: "Tatoh Modest Wilton",
      title: "Founder & CEO",
      avatar: "/images/team/tatoh-avatar.jpg"
    },
    content: `
🚀 The Dream Behind It All
When we launched LoopingBinary, we had one mission: to build digital products that empower people — not just users, but also the creators behind the screen.

Out of that vision, the LoopingBinary Junior Dev Program (LB JDP) was born — a platform for young, aspiring developers across Africa who have the potential, but often lack the structure, mentorship, or community to truly thrive.

In Africa, raw tech talent is everywhere. But opportunity? That's a different story. LB JDP is here to change that narrative.

💡 Why the Junior Dev Program Matters
Most learning platforms teach you how to code. But here's the brutal truth — knowing how to code is not enough.

You need:
• Real-world experience
• Collaborative team projects
• A portfolio that speaks louder than your résumé
• A mentor to call you out when you're slacking
• A community that challenges and inspires you

LB JDP was created to deliver exactly that.

🧠 What You'll Actually Do Inside the Program
This isn't a course. It's a development battlefield. You'll build real applications, push production code, handle deadlines, and sometimes even break things — like real devs do.

Here's a taste of what's in store:
• Frontend & backend development (React, Next.js, Node.js, NestJS)
• Version control and Git collaboration
• API design, DB management (MongoDB, PostgreSQL, Supabase)
• Working in agile teams, code reviews, CI/CD pipelines
• Design thinking and basic UI/UX
• BONUS TRACKS: Cybersecurity, mobile dev, AI & data science

All while being mentored, challenged, and inspired.

🌍 Built for Africa, Ready for the World
We're proud to be African-born and African-built. But we're not stopping there.

LB JDP is training devs to compete globally, create locally, and build products that solve real problems. It's about time Africa stopped being just a tech market and became a tech source.

🧑🏽‍💻 Who Can Join?
You don't need a fancy laptop, a degree, or even a lot of experience. If you:
• Have the hunger to learn
• Can show up consistently
• Want to turn your passion into purpose

...then you're welcome here.

🫂 Real Projects. Real Mentorship. Real Brotherhood.
We're not just building devs. We're building a movement. One that values excellence, teamwork, accountability, and vision. LB JDP isn't just a program — it's a brotherhood of future CTOs, product builders, and founders.

✨ The Vision Ahead
This is only the beginning. We're expanding rapidly:
• 100+ junior devs and counting
• Mentors joining from top companies
• Plans to monetize team projects
• Collaborations with schools and startups
• AI integration & LMS platform on the roadmap

📝 Final Words from the Founder
"LoopingBinary was never just about code. It's about giving people the tools to build legacies. LB JDP is how we train the future leaders of Africa's digital economy — one line of code at a time."

– Tatoh Modest Wilton, Founder of LoopingBinary
    `
  };

  // Coming soon blog posts
  const comingSoonPosts = [
    {
      id: 2,
      title: "How to Build Your First Project as a Junior Dev (and Get Noticed)",
      excerpt: "A comprehensive guide to creating projects that showcase your skills and attract potential employers.",
      date: "Coming Soon",
      readTime: "6 min read",
      image: "/images/blog/first-project.jpg",
      slug: "build-first-project-junior-dev",
      category: "Guides",
      status: "coming-soon"
    },
    {
      id: 3,
      title: "Why African Startups Need to Train, Not Just Hire",
      excerpt: "Exploring the talent development crisis and how investing in junior developers benefits the entire ecosystem.",
      date: "Coming Soon",
      readTime: "5 min read",
      image: "/images/blog/african-startups.jpg",
      slug: "african-startups-train-not-hire",
      category: "Industry Insights",
      status: "coming-soon"
    },
    {
      id: 4,
      title: "Inside LB JDP: Student Success Stories You Should Know About",
      excerpt: "Real stories from program participants who transformed their careers through the LoopingBinary Junior Dev Program.",
      date: "Coming Soon",
      readTime: "7 min read",
      image: "/images/blog/success-stories.jpg",
      slug: "lb-jdp-student-success-stories",
      category: "Success Stories",
      status: "coming-soon"
    },
    {
      id: 5,
      title: "LoopingBinary's Long-Term Vision for Africa's Tech Revolution",
      excerpt: "Our roadmap for building a sustainable tech ecosystem that empowers African developers and entrepreneurs.",
      date: "Coming Soon",
      readTime: "8 min read",
      image: "/images/blog/tech-revolution.jpg",
      slug: "loopingbinary-vision-africa-tech-revolution",
      category: "Vision & Strategy",
      status: "coming-soon"
    }
  ];

  // Current available posts (you can add more here)
  const blogPosts = [
    {
      id: 6,
      title: "Getting Started with the LB JDP: Your First Steps",
      excerpt: "Everything you need to know before joining the LoopingBinary Junior Developer Program.",
      date: "June 18, 2025",
      readTime: "4 min read",
      image: "/images/blog/getting-started.jpg",
      slug: "getting-started-lb-jdp",
      category: "Getting Started"
    },
    {
      id: 7,
      title: "Setting Up Your Development Environment for LB JDP",
      excerpt: "A step-by-step guide to configuring your local environment for program projects.",
      date: "June 15, 2025",
      readTime: "6 min read",
      image: "/images/blog/dev-environment.jpg",
      slug: "setting-up-development-environment",
      category: "Technical Setup"
    }
  ];

  // All posts combined
  const allPosts = [...blogPosts, ...comingSoonPosts];

  // Categories
  const categories = [
    { name: "All", count: allPosts.length + 1 }, // +1 for featured post
    { name: "Founder's Vision", count: 1 },
    { name: "Guides", count: 1 },
    { name: "Industry Insights", count: 1 },
    { name: "Success Stories", count: 1 },
    { name: "Vision & Strategy", count: 1 },
    { name: "Getting Started", count: 1 },
    { name: "Technical Setup", count: 1 }
  ];
  
  // Filter posts based on search query and category
  const filteredPosts = allPosts.filter(post => {
    const matchesQuery = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Blog & Updates</h1>
        <p className="text-muted-foreground">
          Latest insights, tutorials, and updates from the LoopingBinary Junior Dev Program
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Featured Post */}
      <div className="mb-12">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-full h-full flex items-center justify-center">
                <div className="text-center text-primary">
                  <Rocket className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-sm font-medium">Featured Article</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <Badge className="mb-2 bg-primary">{featuredPost.category}</Badge>
                <h2 className="text-2xl font-medium mb-4 leading-tight">{featuredPost.title}</h2>
                <p className="text-muted-foreground text-sm mb-4">{featuredPost.excerpt}</p>
              </div>
              <div>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <div className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/20 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">TW</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">{featuredPost.author.name}</span>
                      <span className="text-xs text-muted-foreground">{featuredPost.author.title}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Button>
                      Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Category Tabs */}
      <Tabs 
        defaultValue="All" 
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="mb-6"
      >
        <TabsList className="mb-6 flex-wrap h-auto">
          {categories.map(category => (
            <TabsTrigger key={category.name} value={category.name} className="text-xs">
              {category.name} <span className="ml-1 text-xs text-muted-foreground">({category.count})</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={selectedCategory}>
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className={`flex flex-col overflow-hidden ${post.status === 'coming-soon' ? 'opacity-75 border-dashed' : ''}`}>
                  <div className="relative h-48">
                    {post.status === 'coming-soon' ? (
                      <div className="bg-gradient-to-br from-muted to-muted/50 w-full h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          {post.category === 'Guides' && <BookOpen className="h-8 w-8 mx-auto mb-2" />}
                          {post.category === 'Industry Insights' && <Globe className="h-8 w-8 mx-auto mb-2" />}
                          {post.category === 'Success Stories' && <Users className="h-8 w-8 mx-auto mb-2" />}
                          {post.category === 'Vision & Strategy' && <Rocket className="h-8 w-8 mx-auto mb-2" />}
                          {post.category === 'Getting Started' && <Code className="h-8 w-8 mx-auto mb-2" />}
                          {post.category === 'Technical Setup' && <Code className="h-8 w-8 mx-auto mb-2" />}
                          <p className="text-xs font-medium">Coming Soon</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-200 w-full h-full"></div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={post.status === 'coming-soon' ? 'secondary' : 'outline'}>
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                    <CardDescription>
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {post.status === 'coming-soon' ? (
                      <Button variant="outline" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    ) : (
                      <Link href={`/blog/${post.slug}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Read Article <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
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
                  <h3 className="text-xl font-medium mb-2">No Articles Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No articles match your search for "${searchQuery}"`
                      : "No articles are available in this category"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Contact CTA */}
      <Card className="mt-12 bg-primary text-primary-foreground">
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-4">Ready to Join LB JDP?</h2>
            <p className="text-sm mb-6 max-w-2xl mx-auto opacity-90">
              Want in? Apply to join the LoopingBinary Junior Dev Program and start building your future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Link href="/join" className="flex-grow">
                <Button variant="secondary" className="w-full">
                  Apply to Join LB JDP
                </Button>
              </Link>
              <Link href="https://www.linkedin.com/company/looping-binary" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Follow on LinkedIn
                </Button>
              </Link>
            </div>
            <div className="mt-4 text-sm opacity-75">
              📧 Contact: <a href="mailto:info@loopingbinary.com" className="underline">info@loopingbinary.com</a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
