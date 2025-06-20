// src/app/(marketing)/pricing/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  Code,
  MessageSquare,
  FileText,
  Video
} from "lucide-react"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Team Registration</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Register your team to get full access to premium resources and start building your project module
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="flex items-center justify-center mb-8">
        <Label htmlFor="billing-toggle" className={`mr-2 ${!isAnnual ? "font-medium" : ""}`}>
          Monthly
        </Label>
        <Switch
          id="billing-toggle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <Label htmlFor="billing-toggle" className={`ml-2 ${isAnnual ? "font-medium" : ""}`}>
          Annual <Badge className="ml-1.5 font-normal">Save 20%</Badge>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Free Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Access</CardTitle>
            <CardDescription>
              Basic access to public resources
            </CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">Free</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Access to public blog posts</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Public documentation access</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Community Discord read-only</span>
              </li>
              <li className="flex items-start opacity-50">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">No module selection</span>
              </li>
              <li className="flex items-start opacity-50">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">No team formation</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/register?tier=free" className="w-full">
              <Button variant="outline" className="w-full">
                Sign Up Free
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Team Tier */}
        <Card className="border-slate-300 shadow-md relative">
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <Badge className="px-3 py-1">Recommended</Badge>
          </div>
          <CardHeader>
            <CardTitle>Team Access</CardTitle>
            <CardDescription>
              Full team access to build your module
            </CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                {isAnnual ? "4,000 XAF" : "5,000 XAF"}
              </span>
              <span className="text-muted-foreground ml-1">/ month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm"><strong>Team of 5-6 members</strong> working together</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Access to <strong>all premium resources</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm"><strong>Select and build one module</strong> of the platform</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Full Discord access with team channel</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Weekly team mentorship sessions</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/register?tier=team" className="w-full">
              <Button className="w-full">
                Register Your Team
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Organization Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>
              For schools and coding bootcamps
            </CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">Custom</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Multiple teams under one organization</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Organization dashboard and analytics</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Dedicated organization mentor</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Custom module assignments</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-600 mr-2 mt-0.5 shrink-0" />
                <span className="text-sm">Bulk team management</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/contact" className="w-full">
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* What's Included */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">What's Included with Team Registration</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Team Formation</h3>
                  <p className="text-sm text-muted-foreground">Create a team of 5-6 members with defined roles to tackle your module together.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                  <Code className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Module Selection</h3>
                  <p className="text-sm text-muted-foreground">Choose one of 20 available modules to build as your team's contribution to the platform.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Premium Resources</h3>
                  <p className="text-sm text-muted-foreground">Access all premium tutorials, courses, and guides to help your team succeed.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Team Discord Channel</h3>
                  <p className="text-sm text-muted-foreground">Get a private Discord channel for your team plus access to community channels.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                  <Video className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Weekly Mentorship</h3>
                  <p className="text-sm text-muted-foreground">Schedule weekly video calls with experienced mentors to guide your team.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Project Templates</h3>
                  <p className="text-sm text-muted-foreground">Get starter templates and boilerplate code for your specific module.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-2">How does team registration work?</h3>
              <p className="text-sm text-muted-foreground">
                One team member registers and pays for the team subscription. They'll receive a team code that other members can use to join. Each team should have 5-6 members.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-2">Can I join without a team?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can register as an individual looking for a team, and we'll help match you with other developers based on your skills and interests.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-2">How long does the project last?</h3>
              <p className="text-sm text-muted-foreground">
                The community project runs for one month, but your team subscription gives you access to all resources for as long as you maintain it.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-2">What happens after we build our module?</h3>
              <p className="text-sm text-muted-foreground">
                Your module becomes part of the Looping Binary platform, and your team will be credited as contributors. You can use it in your portfolio and resume.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-2">What technologies will we use?</h3>
              <p className="text-sm text-muted-foreground">
                The platform is built with Next.js, React, Supabase, and Tailwind CSS. Mobile components use React Native. You'll learn and use these technologies.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-2">Can we cancel our subscription?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel anytime. However, to participate in the community project, your team needs an active subscription for the duration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-slate-50">
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Building?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
              Register your team today and begin your journey of building real-world software with a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">
                  Register Your Team <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg">
                  Browse Available Modules
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
