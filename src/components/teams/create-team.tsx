// src/components/teams/create-team-form.tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export function CreateTeamForm({ userId }: { userId: string }) {
  const [teamName, setTeamName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  

  const generateTeamCode = () => {
    // Generate a random 6-character alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Generate team code
      const teamCode = generateTeamCode()
      
      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([
          { 
            name: teamName, 
            team_code: teamCode,
            discord_link: `https://discord.gg/${teamCode}`, // Placeholder
            created_by: userId
          }
        ])
        .select()
        .single()
        
      if (teamError) throw teamError
      
      // Add creator as team leader
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([
          { 
            team_id: team.id, 
            user_id: userId,
            role: 'Team Lead',
            is_leader: true
          }
        ])
        
      if (memberError) throw memberError
      
      router.refresh()
      router.push(`/teams/${team.id}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the team')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Team</CardTitle>
        <CardDescription>
          Start a new team for the Junior Dev Arena. You'll be automatically assigned as the Team Lead.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Awesome Devs"
              required
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Team
              </>
            ) : (
              'Create Team'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Teams are limited to 5-6 members maximum
      </CardFooter>
    </Card>
  )
}
