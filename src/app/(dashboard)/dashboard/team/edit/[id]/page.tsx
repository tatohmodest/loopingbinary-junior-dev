"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Loader2, 
  AlertCircle,
  Save,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function EditTeamPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [team, setTeam] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discord_link: "",
    project_url: "",
    github_repo: "",
    is_private: false
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push("/auth/login")
          return
        }
        
        setUser(user)
        
        // Get team data
        const { data: team, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("id", id)
          .single()
        
        if (teamError) {
          throw new Error("Team not found")
        }
        
        // Check if user is team leader
        const { data: membership, error: membershipError } = await supabase
          .from("team_members")
          .select("role")
          .eq("team_id", team.id)
          .eq("user_id", user.id)
          .single()
        
        const isLeader = team.created_by === user.id || 
                        (membership && membership.role === 'admin')
        
        if (!isLeader) {
          throw new Error("You don't have permission to edit this team")
        }
        
        setTeam(team)
        
        // Set form data
        setFormData({
          name: team.name || "",
          description: team.description || "",
          discord_link: team.discord_link || "",
          project_url: team.project_url || "",
          github_repo: team.github_repo || "",
          is_private: team.is_private || false
        })
        
      } catch (error: any) {
        console.error("Error fetching team data:", error)
        setError(error.message || "Failed to load team data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, router])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Team name is required")
      }
      
      // Validate URLs if provided
      const urlFields = ["discord_link", "project_url", "github_repo"]
      for (const field of urlFields) {
        if (formData[field] && !isValidUrl(formData[field])) {
          throw new Error(`Please enter a valid URL for ${field.replace('_', ' ')}`)
        }
      }
      
      // Update team
      const { error: updateError } = await supabase
        .from("teams")
        .update({
          name: formData.name,
          description: formData.description,
          discord_link: formData.discord_link,
          project_url: formData.project_url,
          github_repo: formData.github_repo,
          is_private: formData.is_private,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
      
      if (updateError) {
        throw updateError
      }
      
      setSuccess(true)
      
      // Redirect after short delay
      setTimeout(() => {
        router.push("/dashboard/team")
      }, 1500)
      
    } catch (error: any) {
      console.error("Error updating team:", error)
      setError(error.message || "Failed to update team")
    } finally {
      setSaving(false)
    }
  }
  
  const isValidUrl = (url: string) => {
    if (!url) return true // Empty URL is considered valid (optional field)
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
  
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    )
  }
  
  if (error && !team) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/dashboard/team">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
          </Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/dashboard/team" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Team
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-2">Edit Team</h1>
        <p className="text-muted-foreground">Update your team's information and settings</p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <AlertDescription className="text-green-600 dark:text-green-400">
            Team updated successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>
              Update your team's basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter team name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your team and its mission"
                rows={4}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Team Links</h3>
              
              <div className="space-y-2">
                <Label htmlFor="discord_link">Discord Invite Link</Label>
                <Input
                  id="discord_link"
                  name="discord_link"
                  value={formData.discord_link}
                  onChange={handleChange}
                  placeholder="https://discord.gg/..."
                />
                <p className="text-xs text-muted-foreground">
                  A Discord server link for team communication
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project_url">Project URL</Label>
                <Input
                  id="project_url"
                  name="project_url"
                  value={formData.project_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Link to your project's deployed website or demo
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github_repo">GitHub Repository</Label>
                <Input
                  id="github_repo"
                  name="github_repo"
                  value={formData.github_repo}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
                <p className="text-xs text-muted-foreground">
                  Link to your project's GitHub repository
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Team Settings</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_private"
                  name="is_private"
                  checked={formData.is_private}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, is_private: checked === true})
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="is_private">Private Team</Label>
                  <p className="text-sm text-muted-foreground">
                    Private teams are only visible to team members
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/dashboard/team")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
