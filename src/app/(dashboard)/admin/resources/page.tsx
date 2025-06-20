// src/app/(dashboard)/dashboard/admin/resources/page.tsx
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2,
  FileText,
  Video,
  Link,
  ExternalLink,
  BookOpen,
  Users,
  Target
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Resource {
  id: string
  title: string
  description: string | null
  url: string | null
  resource_type: string
  roles: string[]
  tracks: string[]
  created_at: string
  updated_at: string
}

const RESOURCE_TYPES = ["Article", "Video", "Link", "Other"]
const ROLES = ["Student", "Mentor", "Instructor", "Admin", "Alumni"]
const TRACKS = ["Beginner", "Intermediate", "Advanced"]

export default function ResourcesManagement() {
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    resource_type: "",
    roles: [] as string[],
    tracks: [] as string[]
  })

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || resource.resource_type === typeFilter
    
    return matchesSearch && matchesType
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      resource_type: "",
      roles: [],
      tracks: []
    })
  }

  const handleCreateResource = async () => {
    try {
      const { error } = await supabase
        .from("resources")
        .insert([formData])

      if (error) throw error
      
      await fetchResources()
      setCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creating resource:", error)
    }
  }

  const handleUpdateResource = async () => {
    if (!selectedResource) return
    
    try {
      const { error } = await supabase
        .from("resources")
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedResource.id)

      if (error) throw error
      
      await fetchResources()
      setEditDialogOpen(false)
      setSelectedResource(null)
      resetForm()
    } catch (error) {
      console.error("Error updating resource:", error)
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return
    
    try {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", resourceId)

      if (error) throw error
      
      await fetchResources()
    } catch (error) {
      console.error("Error deleting resource:", error)
    }
  }

  const openEditDialog = (resource: Resource) => {
    setSelectedResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description || "",
      url: resource.url || "",
      resource_type: resource.resource_type,
      roles: resource.roles || [],
      tracks: resource.tracks || []
    })
    setEditDialogOpen(true)
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "Article": return FileText
      case "Video": return Video
      case "Link": return Link
      default: return BookOpen
    }
  }

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case "Article": return "bg-blue-500"
      case "Video": return "bg-red-500"
      case "Link": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        roles: [...formData.roles, role]
      })
    } else {
      setFormData({
        ...formData,
        roles: formData.roles.filter(r => r !== role)
      })
    }
  }

  const handleTrackChange = (track: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        tracks: [...formData.tracks, track]
      })
    } else {
      setFormData({
        ...formData,
        tracks: formData.tracks.filter(t => t !== track)
      })
    }
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>
<div>
            <h1 className="text-3xl font-bold">Resources Management</h1>
            <p className="text-muted-foreground">
              Manage learning resources and materials
            </p>
          </div>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {RESOURCE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Results</Label>
              <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                <span className="text-sm text-muted-foreground">
                  {filteredResources.length} resources found
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resources ({filteredResources.length})</CardTitle>
          <CardDescription>
            All learning resources in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Target Roles</TableHead>
                  <TableHead>Target Tracks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => {
                  const TypeIcon = getResourceTypeIcon(resource.resource_type)
                  
                  return (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1 rounded ${getResourceTypeColor(resource.resource_type)}`}>
                              <TypeIcon className="h-3 w-3 text-white" />
                            </div>
                            <div className="font-medium">{resource.title}</div>
                            {resource.url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(resource.url!, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          {resource.description && (
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {resource.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getResourceTypeColor(resource.resource_type)}>
                          {resource.resource_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {resource.roles.length > 0 ? (
                            resource.roles.slice(0, 2).map((role, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">All roles</span>
                          )}
                          {resource.roles.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{resource.roles.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {resource.tracks.length > 0 ? (
                            resource.tracks.map((track, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Target className="h-3 w-3 mr-1" />
                                {track}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">All tracks</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(resource.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(resource)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Resource Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>
              Create a new learning resource
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter resource title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.resource_type}
                onValueChange={(value) => setFormData({ ...formData, resource_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this resource..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Target Roles</Label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(role => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role}`}
                      checked={formData.roles.includes(role)}
                      onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                    />
                    <Label htmlFor={`role-${role}`} className="text-sm">{role}</Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to target all roles
              </p>
            </div>

            <div className="space-y-2">
              <Label>Target Tracks</Label>
              <div className="grid grid-cols-3 gap-2">
                {TRACKS.map(track => (
                  <div key={track} className="flex items-center space-x-2">
                    <Checkbox
                      id={`track-${track}`}
                      checked={formData.tracks.includes(track)}
                      onCheckedChange={(checked) => handleTrackChange(track, checked as boolean)}
                    />
                    <Label htmlFor={`track-${track}`} className="text-sm">{track}</Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to target all tracks
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateResource} disabled={!formData.title || !formData.resource_type}>
              Create Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Update resource information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter resource title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={formData.resource_type}
                onValueChange={(value) => setFormData({ ...formData, resource_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this resource..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Target Roles</Label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(role => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-role-${role}`}
                      checked={formData.roles.includes(role)}
                      onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                    />
                    <Label htmlFor={`edit-role-${role}`} className="text-sm">{role}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Tracks</Label>
              <div className="grid grid-cols-3 gap-2">
                {TRACKS.map(track => (
                  <div key={track} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-track-${track}`}
                      checked={formData.tracks.includes(track)}
                      onCheckedChange={(checked) => handleTrackChange(track, checked as boolean)}
                    />
                    <Label htmlFor={`edit-track-${track}`} className="text-sm">{track}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateResource} disabled={!formData.title || !formData.resource_type}>
              Update Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
