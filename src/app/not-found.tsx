
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Home, Search, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function NotFoundPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  
  // Animation for the numbers
  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      } 
    }
  }
  
  // Staggered animation for the 404 digits
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
        when: "beforeChildren"
      }
    }
  }
  
  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    try {
      // You can replace this with your actual search logic
      // This is just a placeholder that searches your teams table
      const { data } = await supabase
        .from('teams')
        .select('id, name')
        .ilike('name', `%${searchQuery}%`)
        .limit(5)
      
      setSuggestions(data || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }
  
  // Navigate to a suggested result
  const navigateToSuggestion = (id) => {
    router.push(`/dashboard/teams/${id}`)
  }
  
  // Easter egg - clicking on 404 triggers a fun animation
  const [easterEggActive, setEasterEggActive] = useState(false)
  const triggerEasterEgg = () => {
    setEasterEggActive(true)
    setTimeout(() => setEasterEggActive(false), 2000)
  }
  
  useEffect(() => {
    // Set animation complete after a delay
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="container flex max-w-3xl flex-col items-center justify-center gap-8 px-4 py-16 text-center md:py-24">
        {/* Animated 404 Header */}
        <motion.div 
          className="flex items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onClick={triggerEasterEgg}
        >
          <motion.span 
            className="text-8xl font-bold text-primary md:text-9xl" 
            variants={variants}
          >
            4
          </motion.span>
          <motion.div 
            className="relative mx-2 h-24 w-24 md:h-32 md:w-32"
            variants={variants}
          >
            <motion.div 
              className={`absolute inset-0 rounded-full ${easterEggActive ? 'bg-primary animate-ping' : 'bg-muted'}`}
              animate={easterEggActive ? 
                { scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] } : 
                {}
              }
              transition={{ duration: 0.6 }}
            />
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={easterEggActive ? 
                { rotate: [0, 360] } : 
                {}
              }
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <Search className={`h-12 w-12 md:h-16 md:w-16 ${easterEggActive ? 'text-background' : 'text-muted-foreground'}`} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
          <motion.span 
            className="text-8xl font-bold text-primary md:text-9xl" 
            variants={variants}
          >
            4
          </motion.span>
        </motion.div>
        
        {/* Subtitle with animation */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Page not found
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Oops! It seems you've ventured into uncharted territory.
          </p>
        </motion.div>
        
        {/* Search form with animation */}
        <motion.div 
          className="w-full max-w-md space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: animationComplete ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Try searching for something..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost" 
              className="absolute right-0 top-0"
              disabled={isSearching}
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>
          
          {/* Search suggestions */}
          {suggestions.length > 0 && (
            <motion.div 
              className="mt-2 overflow-hidden rounded-md border bg-background shadow-md"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="divide-y">
                {suggestions.map((item) => (
                  <li key={item.id} className="cursor-pointer p-3 hover:bg-muted" onClick={() => navigateToSuggestion(item.id)}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
        
        {/* Action buttons with staggered animation */}
        <motion.div 
          className="flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: animationComplete ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="gap-2 group transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button asChild size="lg" className="gap-2 group">
            <Link href="/">
              <Home className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="gap-2">
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
        </motion.div>
        
        {/* Footer with helpful links */}
        <motion.div 
          className="mt-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: animationComplete ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>Looking for something specific?</p>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/dashboard" className="hover:text-primary hover:underline">Dashboard</Link>
            <Link href="/dashboard/teams" className="hover:text-primary hover:underline">Teams</Link>
            <Link href="/dashboard/payments" className="hover:text-primary hover:underline">Payments</Link>
            <Link href="/help" className="hover:text-primary hover:underline">Help Center</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
