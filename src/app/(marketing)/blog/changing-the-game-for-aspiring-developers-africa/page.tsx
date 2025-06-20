// src/app/(marketing)/blog/changing-the-game-for-aspiring-developers-africa/page.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Rocket,
  Lightbulb,
  Brain,
  Globe,
  Users,
  Heart,
  Sparkles,
  FileText,
  Mail,
  Linkedin
} from "lucide-react"

export default function BlogPostPage() {
  const post = {
    title: "How the LoopingBinary Junior Dev Program Is Changing the Game for Aspiring Developers in Africa",
    date: "June 20, 2025",
    readTime: "8 min read",
    category: "Founder's Vision",
    author: {
      name: "Tatoh Modest Wilton",
      title: "Founder & CEO of LoopingBinary",
      avatar: "/images/team/tatoh-avatar.jpg"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back to Blog */}
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <div className="mb-12">
        <Badge className="mb-4 bg-primary">{post.category}</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>
        
        {/* Author and Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-8 border-b">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-primary/20 rounded-full mr-4 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">TW</span>
            </div>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.title}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <div className="space-y-8">
          {/* Dream Behind It All */}
          <section>
            <div className="flex items-center mb-4">
              <Rocket className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">The Dream Behind It All</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                When we launched LoopingBinary, we had one mission: to build digital products that empower people — not just users, but also the creators behind the screen.
              </p>
              <p>
                Out of that vision, the LoopingBinary Junior Dev Program (LB JDP) was born — a platform for young, aspiring developers across Africa who have the potential, but often lack the structure, mentorship, or community to truly thrive.
              </p>
              <p>
                In Africa, raw tech talent is everywhere. But opportunity? That's a different story. LB JDP is here to change that narrative.
              </p>
            </div>
          </section>

          <Separator />

          {/* Why It Matters */}
          <section>
            <div className="flex items-center mb-4">
              <Lightbulb className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Why the Junior Dev Program Matters</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Most learning platforms teach you how to code. But here's the brutal truth — knowing how to code is not enough.
              </p>
              <p className="font-medium text-foreground">You need:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Real-world experience</li>
                <li>Collaborative team projects</li>
                <li>A portfolio that speaks louder than your résumé</li>
                <li>A mentor to call you out when you're slacking</li>
                <li>A community that challenges and inspires you</li>
              </ul>
              <p>
                LB JDP was created to deliver exactly that.
              </p>
            </div>
          </section>

          <Separator />

          {/* What You'll Do */}
          <section>
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">What You'll Actually Do Inside the Program</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                This isn't a course. It's a development battlefield. You'll build real applications, push production code, handle deadlines, and sometimes even break things — like real devs do.
              </p>
              <p className="font-medium text-foreground">Here's a taste of what's in store:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Frontend & backend development (React, Next.js, Node.js, NestJS)</li>
                <li>Version control and Git collaboration</li>
                <li>API design, DB management (MongoDB, PostgreSQL, Supabase)</li>
                <li>Working in agile teams, code reviews, CI/CD pipelines</li>
                <li>Design thinking and basic UI/UX</li>
                <li><strong>BONUS TRACKS:</strong> Cybersecurity, mobile dev, AI & data science</li>
              </ul>
              <p>
                All while being mentored, challenged, and inspired.
              </p>
            </div>
          </section>

          <Separator />

          {/* Built for Africa */}
          <section>
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Built for Africa, Ready for the World</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                We're proud to be African-born and African-built. But we're not stopping there.
              </p>
              <p>
                LB JDP is training devs to compete globally, create locally, and build products that solve real problems. It's about time Africa stopped being just a tech market and became a tech source.
              </p>
            </div>
          </section>

          <Separator />

          {/* Who Can Join */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Who Can Join?</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                You don't need a fancy laptop, a degree, or even a lot of experience. If you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Have the hunger to learn</li>
                <li>Can show up consistently</li>
                <li>Want to turn your passion into purpose</li>
              </ul>
              <p>
                ...then you're welcome here.
              </p>
            </div>
          </section>

          <Separator />

          {/* Real Brotherhood */}
          <section>
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Real Projects. Real Mentorship. Real Brotherhood.</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                We're not just building devs. We're building a movement. One that values excellence, teamwork, accountability, and vision. LB JDP isn't just a program — it's a brotherhood of future CTOs, product builders, and founders.
              </p>
            </div>
          </section>

          <Separator />

          {/* Vision Ahead */}
          <section>
            <div className="flex items-center mb-4">
              <Sparkles className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">The Vision Ahead</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                This is only the beginning. We're expanding rapidly:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>100+ junior devs and counting</li>
                <li>Mentors joining from top companies</li>
                <li>Plans to monetize team projects</li>
                <li>Collaborations with schools and startups</li>
                <li>AI integration & LMS platform on the roadmap</li>
              </ul>
            </div>
          </section>

          <Separator />

          {/* Final Words */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Final Words from the Founder</h2>
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <blockquote className="text-lg italic text-foreground leading-relaxed">
                  "LoopingBinary was never just about code. It's about giving people the tools to build legacies. LB JDP is how we train the future leaders of Africa's digital economy — one line of code at a time."
                </blockquote>
                <footer className="mt-4 text-right">
                  <cite className="text-sm font-medium text-muted-foreground">
                    – Tatoh Modest Wilton, Founder of LoopingBinary
                  </cite>
                </footer>
              </CardContent>
            </Card>
          </section>
        </div>
      </article>

      {/* Call to Action */}
      <Card className="mt-12 bg-primary text-primary-foreground">
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Want In?</h2>
            <p className="text-sm mb-6 max-w-2xl mx-auto opacity-90">
              Ready to join the movement? Apply to the LoopingBinary Junior Dev Program and start building your future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  👉 Apply to Join LB JDP Now
                </Button>
              </Link>
              <Link href="https://www.linkedin.com/company/looping-binary" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Linkedin className="h-4 w-4 mr-2" />
                  Follow us on LinkedIn
                </Button>
              </Link>
            </div>
            <div className="mt-6 text-sm opacity-75">
              <div className="flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>Contact: </span>
                <a href="mailto:info@loopingbinary.com" className="underline ml-1">
                  loopingbinary@gmail.com
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-12 flex justify-between items-center">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Articles
        </Link>
        <div className="text-sm text-muted-foreground">
          More articles coming soon...
        </div>
      </div>
    </div>
  )
}
