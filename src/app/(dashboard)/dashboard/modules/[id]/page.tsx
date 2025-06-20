// src/app/(dashboard)/dashboard/modules/[id]/page.tsx (continued)
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  Loader2, 
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Progress
} from "@/components/ui/progress"

export default function ModuleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params.id as string
  
  const [user, setUser] = useState<any>(null)
  const [module, setModule] = useState<any>(null)
  const [teamModule, setTeamModule] = useState<any>(null)
  const [phases, setPhases] = useState<any[]>([])
  const [isLeader, setIsLeader] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Phase update state
  const [updatingPhase, setUpdatingPhase] = useState(false)
  const [newPhase, setNewPhase] = useState<string | null>(null)
  const [proofLink, setProofLink] = useState("")
  const [remarks, setRemarks] = useState("")
  const [phaseError, setPhaseError] = useState<string | null>(null)
  
  // Define all possible phases in order
  const allPhases = [
    "Team Formation",
    "Module Assigned",
    "Execution Started",
    "First Delivery",
    "Final Merge",
    "Launched"
  ]

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
        
        // Fetch module details
        const { data: moduleData } = await supabase
          .from("modules")
          .select("*")
          .eq("id", moduleId)
          .single()
          
        if (!moduleData) {
          router.push("/dashboard/modules")
          return
        }
        
        setModule(moduleData)
        
        // Fetch user's team
        const { data: teamMember } = await supabase
          .from("team_members")
          .select("team_id, is_leader")
          .eq("user_id", user.id)
          .single()
          
        if (teamMember) {
          setIsLeader(teamMember.is_leader)
          
          // Fetch team's module
          const { data: teamModuleData } = await supabase
            .from("team_modules")
            .select("*")
            .eq("team_id", teamMember.team_id)
            .eq("module_id", moduleId)
            .single()
            
          if (teamModuleData) {
            setTeamModule(teamModuleData)
            
            // Fetch project phases
            const { data: phaseData } = await supabase
              .from("project_phases")
              .select("*")
              .eq("team_module_id", teamModuleData.id)
              .order("completed_at", { ascending: true })
              
            setPhases(phaseData || [])
          } else {
            // If the team doesn't have this module, redirect
            router.push("/dashboard/modules")
          }
        } else {
          // If user is not in a team, redirect
          router.push("/dashboard/modules")
        }
      } catch (error: any) {
        setError(error.message || "Failed to load module data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [router, moduleId])
  
  const getNextPhase = () => {
    const completedPhases = phases.map(p => p.phase)
    return allPhases.find(phase => !completedPhases.includes(phase)) || null
  }
  
  const handleUpdatePhase = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdatingPhase(true)
    setPhaseError(null)
    
    try {
      if (!newPhase || !teamModule) {
        throw new Error("Invalid phase or team module")
      }
      
      // Add the new phase
      const { error: phaseError } = await supabase
        .from("project_phases")
        .insert([
          {
            team_module_id: teamModule.id,
            phase: newPhase,
            proof_link: proofLink || null,
            remarks: remarks || null
          }
        ])
        
      if (phaseError) throw phaseError
      
      // Update team module status if needed
      if (newPhase === "Execution Started") {
        await supabase
          .from("team_modules")
          .update({ status: "In Progress" })
          .eq("id", teamModule.id)
      } else if (newPhase === "Launched") {
        await supabase
          .from("team_modules")
          .update({ status: "Completed" })
          .eq("id", teamModule.id)
          
        // Update module status
        await supabase
          .from("modules")
          .update({ status: "Completed" })
          .eq("id", moduleId)
      }
      
      // Refresh the page
      router.refresh()
      window.location.reload()
    } catch (error: any) {
      setPhaseError(error.message || "Failed to update phase")
    } finally {
      setUpdatingPhase(false)
    }
  }
  
  const getProgressPercentage = () => {
    return Math.round((phases.length / allPhases.length) * 100)
  }
  
  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!module || !teamModule) {
    return (
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.push("/dashboard/modules")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Modules
        </Button>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Module Not Found</h3>
              <p className="text-muted-foreground mb-6">
                The module you're looking for doesn't exist or your team doesn't have access to it.
              </p>
              <Button onClick={() => router.push("/dashboard/modules")}>
                Return to Modules
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => router.push("/dashboard/modules")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Modules
      </Button>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{module.name}</CardTitle>
              <CardDescription className="flex items-center mt-2">
                Status: 
                <Badge variant="outline" className="ml-2">
                  {teamModule.status}
                </Badge>
                {teamModule.status === "Taken" && <Clock className="ml-2 h-4 w-4 text-amber-500" />}
                {teamModule.status === "In Progress" && <Clock className="ml-2 h-4 w-4 text-blue-500" />}
                {teamModule.status === "Completed" && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
              </CardDescription>
            </div>
            <Badge className={
              module.difficulty === "Beginner" 
                ? "bg-green-500" 
                : module.difficulty === "Intermediate"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }>
              {module.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {module.description || "No description available"}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Progress</h3>
            <Progress value={getProgressPercentage()} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {phases.length} of {allPhases.length} phases completed ({getProgressPercentage()}%)
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Phases</CardTitle>
          <CardDescription>
            Track your team's progress through the project lifecycle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-l pl-6 pb-2">
            {allPhases.map((phase, index) => {
              const completed = phases.find(p => p.phase === phase)
              
              return (
                <div key={phase} className={`mb-8 relative ${!completed ? 'opacity-50' : ''}`}>
                  <div className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${
                    completed 
                      ? 'border-primary bg-background' 
                      : 'border-muted-foreground bg-background'
                  } flex items-center justify-center`}>
                    {completed && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                  </div>
                  <h3 className="font-semibold">{phase}</h3>
                  {completed ? (
                    <>
                      <time className="text-xs text-muted-foreground">
                        {new Date(completed.completed_at).toLocaleDateString()}
                      </time>
                      {completed.remarks && (
                        <p className="mt-1 text-sm">{completed.remarks}</p>
                      )}
                      {completed.proof_link && (
                        <a 
                          href={completed.proof_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-primary hover:underline inline-flex items-center"
                        >
                          View Proof <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">Pending</p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
        <CardFooter>
          {isLeader && getNextPhase() && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setNewPhase(getNextPhase())
                    setProofLink("")
                    setRemarks("")
                    setPhaseError(null)
                  }}
                  className="w-full"
                >
                  Update Project Phase
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Project Phase</DialogTitle>
                  <DialogDescription>
                    Mark the next phase of your project as completed
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleUpdatePhase} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Phase</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      {newPhase}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proofLink">Proof Link (Optional)</Label>
                    <Input
                      id="proofLink"
                      value={proofLink}
                      onChange={(e) => setProofLink(e.target.value)}
                      placeholder="https://github.com/yourusername/project"
                    />
                    <p className="text-xs text-muted-foreground">
                      Link to GitHub repository, deployed app, or other evidence
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks (Optional)</Label>
                    <Textarea
                      id="remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add any comments or notes about this phase"
                      rows={3}
                    />
                  </div>
                  
                  {phaseError && (
                    <Alert variant="destructive">
                      <AlertDescription>{phaseError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <DialogFooter>
                    <Button type="submit" disabled={updatingPhase}>
                      {updatingPhase ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
                        </>
                      ) : (
                        "Complete Phase"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
