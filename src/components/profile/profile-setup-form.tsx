// src/components/profile/profile-setup-form.tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

const roles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'DevOps Engineer',
  'QA Engineer',
  'Project Manager'
]

const tracks = ['Beginner', 'Intermediate', 'Advanced']

export function ProfileSetupForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    role: '',
    track: '',
    github_url: '',
    linkedin_url: '',
    skills: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Convert skills string to array
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill !== '')

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          whatsapp: formData.whatsapp,
          role: formData.role,
          track: formData.track,
          github_url: formData.github_url,
          linkedin_url: formData.linkedin_url,
          skills: skillsArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating your profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              placeholder="+237 6XX XXX XXX"
              value={formData.whatsapp}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="role">Primary Role</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('role', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="track">Experience Level</Label>
              <Select 
                onValueChange={(value) => handleSelectChange('track', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  {tracks.map(track => (
                    <SelectItem key={track} value={track}>{track}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub Profile URL</Label>
            <Input
              id="github_url"
              name="github_url"
              placeholder="https://github.com/yourusername"
              value={formData.github_url}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
            <Input
              id="linkedin_url"
              name="linkedin_url"
              placeholder="https://linkedin.com/in/yourusername"
              value={formData.linkedin_url}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Textarea
              id="skills"
              name="skills"
              placeholder="React, TypeScript, Node.js, Express, PostgreSQL"
              value={formData.skills}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Profile
            </>
          ) : (
            'Complete Profile'
          )}
        </Button>
      </div>
    </form>
  )
}
