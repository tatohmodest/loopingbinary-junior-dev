"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, AlertCircle, Users, CheckCircle2, Info, CreditCard } from "lucide-react"

export default function JoinTeamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [teamId, setTeamId] = useState<string | null>(null)
  const [teamName, setTeamName] = useState<string | null>(null)
  const [teamActive, setTeamActive] = useState<boolean>(false)
  
  // Form fields
  const [joinCode, setJoinCode] = useState("")
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/login")
          return
        }
        
        setUser(user)
        
        // Check if user is already in a team
        const { data: teamMember, error: memberError } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", user.id)
          .maybeSingle()
          
        if (teamMember) {
          // User already has a team, redirect to team page
          router.push("/dashboard/team")
          return
        }
        
        // Check if there's a join code in the URL
        const codeFromUrl = searchParams.get("code")
        if (codeFromUrl) {
          setJoinCode(codeFromUrl)
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error)
        setError(error.message || "Failed to load user data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [router, searchParams])
  
  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setJoining(true)
    setError(null)
    
    try {
      if (!joinCode.trim()) {
        throw new Error("Join code is required")
      }
      
      console.log("Searching for team with join code:", joinCode.trim())
      
      // Find the team with the provided join code
      const { data: teams, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("join_code", joinCode.trim())
      
      console.log("Team search results:", { teams, teamError })
      
      if (teamError) {
        console.error("Database error when searching for team:", teamError)
        throw teamError
      }
      
      // Important: Log the exact length and content of the teams array
      console.log(`Found ${teams?.length || 0} teams with join code "${joinCode.trim()}":`, teams)
      
      if (!teams || teams.length === 0) {
        throw new Error("Invalid join code. Please check and try again.")
      }
      
      // If multiple teams found, use the first one
      // This is a workaround for duplicate join codes
      const team = teams[0]
      console.log("Selected team:", team)
      
     
      
      // Check if user is already a member of this team
      const { data: existingMember, error: existingError } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", team.id)
        .eq("user_id", user.id)
        .maybeSingle()
      
      console.log("Existing membership check:", { existingMember, existingError })
        
      if (existingMember) {
        throw new Error("You are already a member of this team.")
      }
      
      // Add the user as a team member
      const { data: newMember, error: memberError } = await supabase
        .from("team_members")
        .insert([
          {
            team_id: team.id,
            user_id: user.id,
            role: 'member'
          }
        ])
        .select()
      
      console.log("Team member insert result:", { newMember, memberError })
        
      if (memberError) throw memberError
      
      setSuccess(true)
      setTeamId(team.id)
      setTeamName(team.name)
      setTeamActive(true)
      
      // Redirect to team page after a short delay
      setTimeout(() => {
        router.push("/dashboard/team")
      }, 2000)
    } catch (error: any) {
      console.error("Error joining team:", error)
      setError(error.message || "Failed to join team")
    } finally {
      setJoining(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <div className="container py-6 md:py-8 max-w-md">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="pl-0" 
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Join a Team</CardTitle>
          <CardDescription>
            Enter a team code to join an existing team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Joined Successfully!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You have joined the team "{teamName}". You can now collaborate with your team members.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to team page...
              </p>
            </div>
          ) : error && error.includes("inactive") ? (
            <div className="text-center py-6">
              <CreditCard className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Requires Activation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The team "{teamName}" exists but hasn't been activated yet. The team owner needs to complete payment to activate this team.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Please contact the team owner to activate the team, or try again later.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setError(null)
                  setTeamId(null)
                  setTeamName(null)
                }}
              >
                Try Another Code
              </Button>
            </div>
          ) : (
            <form onSubmit={handleJoinTeam} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="joinCode">Team Join Code</Label>
                  <Input
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter team code (e.g. ABC123)"
                    className="text-center text-lg font-mono tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">
                    The team leader can provide you with the join code
                  </p>
                </div>
                
                <Alert className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    You can only be a member of one team at a time. If you join this team, you won't be able to create or join another team unless you leave this one.
                  </AlertDescription>
                </Alert>
              </div>
            </form>
          )}
        </CardContent>
        {!success && !error?.includes("inactive") && (
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={handleJoinTeam}
              disabled={joining || !joinCode.trim()}
            >
              {joining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining Team
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Join Team
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
