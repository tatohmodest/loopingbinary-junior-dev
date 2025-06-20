// src/app/(dashboard)/dashboard/team/create/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Loader2, AlertCircle, Users, CheckCircle2, Info } from "lucide-react"
import { generateSlug } from "random-word-slugs"

export default function CreateTeamPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [teamId, setTeamId] = useState<string | null>(null)
  
  // Form fields
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [maxMembers, setMaxMembers] = useState("5")
  const [isPrivate, setIsPrivate] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [githubRepo, setGithubRepo] = useState("")
  const [discordLink, setDiscordLink] = useState("")
  const [projectUrl, setProjectUrl] = useState("")

  
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
        const { data: teamMember } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", user.id)
          .single()
          
        if (teamMember) {
          // User already has a team, redirect to team page
          router.push("/dashboard/team")
          return
        }
        
        // Generate a random join code
        generateRandomJoinCode()
      } catch (error: any) {
        setError(error.message || "Failed to load user data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [router])
  
  const generateRandomJoinCode = () => {
    // Generate a random 6-character code
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    setJoinCode(result)
  }
  
  const generateTeamName = () => {
    const slug = generateSlug(2, { format: "title" })
    setName(slug)
  }
  
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError(null)
    
    try {
      if (!name.trim()) {
        throw new Error("Team name is required")
      }
      
      // Create the team
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert([
          {
            name,
            description,
            max_members: parseInt(maxMembers),
            is_private: isPrivate,
            join_code: joinCode,
            github_repo: githubRepo,
            discord_link: discordLink || null,
            project_url: projectUrl || null,
            created_by: user.id,
            active: false ,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        
      if (teamError) throw teamError
      
      // Add the user as a team member and leader
      const { error: memberError } = await supabase
        .from("team_members")
        .insert([
          {
            team_id: team[0].id,
            user_id: user.id,
            is_leader: true,
            role: "Team Leader",
            joined_at: new Date().toISOString()
          }
        ])
        
      if (memberError) throw memberError
      
      // Create a notification for the user
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert([
          {
            user_id: user.id,
            title: "Team Created",
            message: `You have successfully created the team "${name}". You can now invite others using the join code.`,
            type: "team_created",
            created_at: new Date().toISOString()
          }
        ])
        
      if (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Don't block the flow if notification creation fails
      }
      
      setSuccess(true)
      setTeamId(team[0].id)
      
      // Redirect to team page after a short delay
      setTimeout(() => {
         router.push(`/dashboard/payments`)
      }, 3000)
    } catch (error: any) {
      setError(error.message || "Failed to create team")
    } finally {
      setCreating(false)
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
    <div className="container  py-6 md:py-8 max-w-3xl">
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
          <CardTitle>Create a New Team</CardTitle>
          <CardDescription>
            Start collaborating with others by creating your own team
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
              <h3 className="text-lg font-semibold mb-2">Team Created Successfully!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your team "{name}" has been created. You can now invite others to join using the join code.
              </p>
              <div className="flex items-center justify-center bg-muted p-3 rounded-md mb-4">
                <code className="text-lg font-mono">{joinCode}</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting to team page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreateTeam} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="name">Team Name</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={generateTeamName}
                    >
                      Generate
                    </Button>
                  </div>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter team name"
                    maxLength={50}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your team's purpose and goals"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
  <Label htmlFor="discordLink">Discord Link (Optional)</Label>
  <div className="flex">
    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
      discord.gg/
    </span>
    <Input
      id="discordLink"
      value={discordLink}
      onChange={(e) => setDiscordLink(e.target.value)}
      className="rounded-l-none"
      placeholder="yourinvite"
    />
  </div>
  <p className="text-xs text-muted-foreground">
    Add your team's Discord server invite link
  </p>
</div>

<div className="space-y-2">
  <Label htmlFor="projectUrl">Project URL (Optional)</Label>
  <Input
    id="projectUrl"
    value={projectUrl}
    onChange={(e) => setProjectUrl(e.target.value)}
    placeholder="https://your-project-url.com"
  />
  <p className="text-xs text-muted-foreground">
    Link to your team's project (if available)
  </p>
</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Maximum Members</Label>
                    <Select
                      value={maxMembers}
                      onValueChange={setMaxMembers}
                    >
                      <SelectTrigger id="maxMembers">
                        <SelectValue placeholder="Select maximum members" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Members</SelectItem>
                        <SelectItem value="5">5 Members</SelectItem>
                        <SelectItem value="8">8 Members</SelectItem>
                        <SelectItem value="10">10 Members</SelectItem>
                        <SelectItem value="15">15 Members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="joinCode">Join Code</Label>
                    <div className="flex">
                      <Input
                        id="joinCode"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        className="rounded-r-none"
                        maxLength={6}
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        className="rounded-l-none"
                        onClick={generateRandomJoinCode}
                      >
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This code will be used by others to join your team
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="isPrivate" className="flex flex-col space-y-1 cursor-pointer">
                    <span>Private Team</span>
                    <span className="font-normal text-xs text-muted-foreground">
                      Private teams won't be listed in the public directory
                    </span>
                  </Label>
                  <Switch
                    id="isPrivate"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="githubRepo">GitHub Repository (Optional)</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      github.com/
                    </span>
                    <Input
                      id="githubRepo"
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                      className="rounded-l-none"
                      placeholder="username/repository"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Link your team's GitHub repository (e.g. username/repository)
                  </p>
                </div>
                
                <Alert className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    By creating a team, you will automatically become the team leader with administrative privileges.
                  </AlertDescription>
                </Alert>
              </div>
            </form>
          )}
        </CardContent>
        {!success && (
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
              onClick={handleCreateTeam}
              disabled={creating || !name.trim()}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Team
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Create Team
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
