"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  Code,
  BookOpen,
  Users,
  Briefcase,
  FileText,
  HelpCircle,
  ArrowRight,
  Heart
} from "lucide-react"

export function SiteFooter() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {mounted && (
                <div className="relative h-8 w-auto">
                  {theme === "dark" ? (
                    <Image
                      src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-theme.png"
                      alt="LoopingBinary"
                      width={120}
                      height={32}
                      className="h-8 w-auto"
                    />
                  ) : (
                    <Image
                      src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/dark-logo.png"
                      alt="LoopingBinary"
                      width={120}
                      height={32}
                      className="h-8 w-auto"
                    />
                  )}
                </div>
              )}
              {!mounted && (
                <div className="h-8 w-[120px] bg-muted rounded animate-pulse" />
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering the next generation of developers through comprehensive training, 
              mentorship, and real-world project experience.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="https://github.com/loopingbinary" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="https://twitter.com/loopingbinary" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="https://linkedin.com/company/loopingbinary" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="space-y-3">
              <Link 
                href="/about" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <FileText className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                About Us
              </Link>
              <Link 
                href="/modules" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <BookOpen className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                Training Modules
              </Link>
              <Link 
                href="/teams" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Users className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                Teams
              </Link>
              <Link 
                href="/projects" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Code className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                Projects
              </Link>
              <Link 
                href="/blog" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <FileText className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                Blog
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <nav className="space-y-3">
              <Link 
                href="/help" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <HelpCircle className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                Help Center
              </Link>
              <Link 
                href="/resources" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <BookOpen className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                Resources
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Mail className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                Contact Us
              </Link>
              <Link 
                href="/careers" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Briefcase className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                Careers
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest updates on new courses, projects, and opportunities.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
            </form>
            
            {/* Contact Info */}
               {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+237650318856" className="hover:text-foreground transition-colors">
                  +237 650 318 856
                </a>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:loopingbinary@gmail.com" className="hover:text-foreground transition-colors">
                  loopingbinary@gmail.com
                </a>
              </div>
              <div className="flex items-start text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                <span>
                  Douala, Cameroon
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

       
       {/* Bottom Footer */}
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Copyright and Company Info */}
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">© 2025 LoopingBinary Junior Dev Program — Empowering Africa's Next Generation of Builders.</p>
          </div>

          {/* Powered by LoopingBinary - Centralized and Bigger */}
          <div className="flex flex-col items-center space-y-3 pt-4 border-t border-border w-full">
            <div className="flex justify-center  items-center space-x-2 text-lg font-semibold text-foreground">
              <span className="flex items-center">
                Powered by 
              </span>
              {mounted && (
                <Link 
                  href="https://www.linkedin.com/company/looping-binary" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <div className="relative h-7 w-[100px]">
                    {theme === "dark" ? (
                      <Image
                        src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/lb-dark-theme.png"
                        alt="LoopingBinary"
                        width={80}
                        height={28}
                        className="h-7 w-auto"
                      />
                    ) : (
                      <Image
                        src="https://loopingbinary.s3.eu-north-1.amazonaws.com/looping-binary/Looping+Binary+Logo-sets/lb-white-theme.png"
                        alt="LoopingBinary"
                        width={80}
                        height={28}
                        className="h-7 w-auto"
                      />
                    )}
                  </div>
                </Link>
              )}
              {!mounted && (
                <div className="h-7 w-[80px] bg-muted rounded animate-pulse" />
              )}
            </div>
            <p className="text-sm text-muted-foreground italic">
              Building technology that builds people.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}