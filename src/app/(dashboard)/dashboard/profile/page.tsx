// src/app/(dashboard)/dashboard/profile/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, Save, ArrowLeft, Camera, Github, Linkedin, Mail, CheckCircle2, X, Phone } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form fields matching your exact database schema
  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [role, setRole] = useState("")
  const [track, setTrack] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [arenaBadge, setArenaBadge] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/login")
          return
        }
        
        setUser(user)
        
        // Fetch user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
          
        setProfile(profileData)
        
        if (profileData) {
          setName(profileData.name || "")
          setWhatsapp(profileData.whatsapp || "")
          setRole(profileData.role || "")
          setTrack(profileData.track || "")
          setGithubUrl(profileData.github_url || "")
          setLinkedinUrl(profileData.linkedin_url || "")
          setSkills(profileData.skills || [])
          setAvatarUrl(profileData.avatar_url || "")
          setArenaBadge(profileData.arena_badge || false)
        }
      } catch (error: any) {
        setError(error.message || "Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [router])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary via API route
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setAvatarUrl(data.url)
      
      // Auto-save avatar URL to database
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ 
            avatar_url: data.url,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id)
        
        if (error) throw error
      }

    } catch (error: any) {
      setError(error.message || 'Failed to upload image')
      setPreviewImage(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    try {
      setAvatarUrl("")
      setPreviewImage(null)
      
      // Remove from database
      if (user) {
        await supabase
          .from("profiles")
          .update({ 
            avatar_url: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id)
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error: any) {
      setError('Failed to remove image')
    }
  }
  
  const handleSaveProfile = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: name || null,
          whatsapp: whatsapp || null,
          role: role || null,
          track: track || null,
          github_url: githubUrl || null,
          linkedin_url: linkedinUrl || null,
          skills: skills.length > 0 ? skills : null,
          avatar_url: avatarUrl || null,
          arena_badge: arenaBadge,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)
        
      if (error) throw error
      
      setSuccess(true)
      
      // Refresh profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        
      setProfile(profileData)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
      
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }
  
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }
  
  const getInitials = (name: string) => {
    if (!name) return "?"
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  // Available roles and tracks
  const roles = ["Student", "Mentor", "Instructor", "Admin", "Alumni"]
  const tracks = ["Frontend", "Backend", "Full Stack", "Mobile", "Data Science", "DevOps", "UI/UX"]
  
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <div className="container py-6 md:py-8 max-w-5xl">
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
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Preview Card */}
        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
              <CardDescription>
                How others see your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={previewImage || avatarUrl} 
                    alt={name || "Profile"} 
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
                
                <div className="absolute bottom-0 right-0 flex gap-1">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  
                  {(avatarUrl || previewImage) && (
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={handleRemoveImage}
                      disabled={uploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <h3 className="text-lg font-semibold">{name || "Your Name"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {role && (
                  <Badge variant="outline">
                    {role}
                  </Badge>
                )}
                
                {track && (
                  <Badge variant="secondary">
                    {track}
                  </Badge>
                )}

                {arenaBadge && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    🏆 Arena
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-center space-x-2 mt-4">
                {githubUrl && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.open(githubUrl, '_blank')}
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                )}
                {linkedinUrl && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.open(linkedinUrl, '_blank')}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                )}
                {whatsapp && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank')}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add your skills below
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Edit Profile Form */}
        <div className="md:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Profile updated successfully!</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select Role</option>
                      {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="track">Track</Label>
                    <select
                      id="track"
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select Track</option>
                      {tracks.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+1234567890"
                  />
                  <p className="text-xs text-muted-foreground">
                    Include country code (e.g., +1 for US, +44 for UK)
                  </p>
                </div>
                
                <Separator />
                
                <h3 className="text-sm font-medium">Social Profiles</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                        <button 
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="newSkill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g. React, Python, Design)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSkill()
                        }
                      }}
                    />
                    
                    <Button 
                      type="button" 
                      onClick={handleAddSkill}
                      disabled={!newSkill.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Press Enter or click Add to add a skill
                  </p>
                </div>

                <Separator />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="arenaBadge"
                    checked={arenaBadge}
                    onChange={(e) => setArenaBadge(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="arenaBadge" className="text-sm font-medium">
                    Arena Badge Holder 🏆
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveProfile}
                disabled={saving || uploading}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Email Address</Label>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.email_confirmed_at ? (
                    <Badge className="bg-green-500">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500/20">
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <Label>Account Created</Label>
                <div className="p-3 border rounded-md">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Last Updated</Label>
                <div className="p-3 border rounded-md">
                  {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "Never"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
