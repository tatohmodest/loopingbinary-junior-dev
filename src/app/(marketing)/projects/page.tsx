// src/app/(marketing)/project/page.tsx
"use client"

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight, 
  Users, 
  Code, 
  Briefcase, 
  GitBranch, 
  Zap,
  CheckCircle,
  Layers
} from "lucide-react"

export default function ProjectPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Looping Binary Junior Developer Arena
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Not just learning programming. Building real-world projects with real teams.
        </p>
        <div className="mt-8">
          <Link href="/register">
            <Button size="lg">
              Join the Arena <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* What's Happening Section */}
      <Card className="mb-12 border border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl">What's Happening?</CardTitle>
          <CardDescription>
            Our first community project is launching now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-muted-foreground">
            We are launching our first community project: a real-life software platform that will be built, 
            tested, and deployed by YOU and your team.
          </p>
          <p className="mb-6 text-sm text-muted-foreground">
            Instead of every team building a different app, this project will be structured as one big platform, 
            where each team is assigned a feature or module to develop.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-3">Team-Based Development</h3>
                <p className="text-sm text-muted-foreground">Each team works on a specific module of the platform, from authentication to payment systems.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-3">Real-World Experience</h3>
                <p className="text-sm text-muted-foreground">Gain practical experience building production-ready features in a collaborative environment.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-3">Unified Platform</h3>
                <p className="text-sm text-muted-foreground">All teams merge their parts into a single, unified platform under the LoopingBinary brand.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-3">One-Month Timeline</h3>
                <p className="text-sm text-muted-foreground">This intensive project runs for one month, giving you focused, deadline-driven experience.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Project Theme */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Community Project Theme</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="rounded-full bg-slate-100 p-2 w-fit">
                <Layers className="h-6 w-6" />
              </div>
              <CardTitle className="mt-4">Community Services Platform</CardTitle>
              <CardDescription>
                A system where individuals can post, book, and review services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                This project will eventually support:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Web and mobile versions (built on the same tech stack)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Admin and user dashboards</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Authentication and payment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-slate-600 mr-2 mt-0.5 shrink-0" />
                  <span className="text-sm">Real-time messaging or notification features</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="rounded-full bg-slate-100 p-2 w-fit">
                <Code className="h-6 w-6" />
              </div>
              <CardTitle className="mt-4">Microservice-Based Teams</CardTitle>
              <CardDescription>
                Each team builds a standalone service that integrates with the main platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Each team will work on a self-contained microservice, built with the
                same stack but running independently, to be plugged into the main
                platform.
              </p>
              <p className="text-sm text-muted-foreground">
                This promotes modularity and cleaner architecture. If we go
                this route, the same roles and modules apply, but each module is
                designed and developed as a standalone service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="font-medium text-xl mb-3">Form Your Team</h3>
              <p className="text-sm text-muted-foreground">Create a team of 5-6 members, give it a unique name, and assign roles based on skills.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="font-medium text-xl mb-3">Choose Your Module</h3>
              <p className="text-sm text-muted-foreground">Select one of the 20 available modules to build as part of the larger platform.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="font-medium text-xl mb-3">Build & Learn</h3>
              <p className="text-sm text-muted-foreground">Access premium courses, collaborate with your team, and build your assigned module.</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/features">
            <Button variant="outline">
              View all available modules <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Benefits */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Why Join the Arena?</CardTitle>
          <CardDescription>Benefits of participating in our community project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                <GitBranch className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Real Project Experience</h3>
                <p className="text-sm text-muted-foreground">Contribute to a real platform with teammates and gain project-based experience in real environments.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                <Zap className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Accelerated Learning</h3>
                <p className="text-sm text-muted-foreground">Learn by doing in a structured environment with mentorship and premium learning resources.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Team Collaboration</h3>
                <p className="text-sm text-muted-foreground">Experience real team dynamics, code reviews, and collaborative development workflows.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-4 mt-1 bg-slate-100 p-2 rounded-full">
                <Briefcase className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Portfolio Builder</h3>
                <p className="text-sm text-muted-foreground">Build a public dev portfolio with concrete evidence of your skills and teamwork.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Link href="/register">
            <Button>
              Join for 5,000 XAF/Month <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Testimonials */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Developer Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <p className="italic mb-6 text-sm text-muted-foreground">"Joining the Looping Binary Junior Dev Arena gave me real-world experience I couldn't get anywhere else. Now I have a portfolio that actually impresses employers."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Alex M.</p>
                  <p className="text-xs text-muted-foreground">Frontend Developer</p>
                </div>
              </div>
            </CardContent>
          // src/app/(marketing)/project/page.tsx (continued)
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="italic mb-6 text-sm text-muted-foreground">"Working in a team of developers taught me more than just code. I learned communication, git workflows, and how to collaborate effectively."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Sarah K.</p>
                  <p className="text-xs text-muted-foreground">Full Stack Developer</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="italic mb-6 text-sm text-muted-foreground">"As a beginner, I was worried I wouldn't contribute much. The mentorship and structure helped me grow rapidly and I was writing meaningful code within weeks."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Michael T.</p>
                  <p className="text-xs text-muted-foreground">Junior Developer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-slate-50">
        <CardContent className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Join the Arena?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
              The future doesn't come to those who watch. It comes to those who build.
            </p>
            <Link href="/register">
              <Button>
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

