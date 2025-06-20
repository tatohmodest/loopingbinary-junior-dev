// src/app/(dashboard)/dashboard/admin/payments/page.tsx
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Search, 
  ArrowLeft, 
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Payment {
  id: string
  team_id: string
  amount: number
  payment_method: string | null
  transaction_id: string | null
  status: string
  expires_at: string | null
  created_at: string
  updated_at: string
  teams: {
    name: string
    team_code: string
  }
}

export default function PaymentsManagement() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    totalAmount: 0,
    pendingAmount: 0,
    completedAmount: 0,
    failedAmount: 0
  })

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          teams(name, team_code)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      
      setPayments(data || [])
      
      // Calculate stats
      const totalAmount = data?.reduce((sum, payment) => sum + payment.amount, 0) || 0
      const pendingAmount = data?.filter(p => p.status === 'Pending').reduce((sum, payment) => sum + payment.amount, 0) || 0
      const completedAmount = data?.filter(p => p.status === 'Completed').reduce((sum, payment) => sum + payment.amount, 0) || 0
      const failedAmount = data?.filter(p => p.status === 'Failed').reduce((sum, payment) => sum + payment.amount, 0) || 0
      
      setStats({
        totalAmount,
        pendingAmount,
        completedAmount,
        failedAmount
      })
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.teams.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.teams.team_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleUpdatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("payments")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", paymentId)

      if (error) throw error
      
      await fetchPayments()
      setDetailsDialogOpen(false)
      setSelectedPayment(null)
    } catch (error) {
      console.error("Error updating payment status:", error)
    }
  }

  const exportPayments = () => {
    const csvContent = [
      ["Team", "Team Code", "Amount", "Status", "Payment Method", "Transaction ID", "Created At"],
      ...filteredPayments.map(payment => [
        payment.teams.name,
        payment.teams.team_code,
        payment.amount,
        payment.status,
        payment.payment_method || "",
        payment.transaction_id || "",
        new Date(payment.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "payments.csv"
    a.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500"
      case "Pending": return "bg-yellow-500"
      case "Failed": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return CheckCircle2
      case "Pending": return Clock
      case "Failed": return XCircle
      default: return AlertTriangle
    }
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
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
        <Button variant="outline" onClick={exportPayments}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
       <div>
            <h1 className="text-3xl font-bold">Payments Management</h1>
            <p className="text-muted-foreground">
              Track and manage all payments
            </p>
          </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAmount} XAF</div>
            <p className="text-xs text-muted-foreground">
              All time revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAmount} XAF</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAmount} XAF</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedAmount} XAF</div>
            <p className="text-xs text-muted-foreground">
              Failed transactions
            </p>
          </CardContent>
        </Card>
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
                  placeholder="Search by team, code, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Results</Label>
              <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                <span className="text-sm text-muted-foreground">
                  {filteredPayments.length} payments found
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payments ({filteredPayments.length})</CardTitle>
          <CardDescription>
            All payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status)
                  const expired = isExpired(payment.expires_at)
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.teams.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.teams.team_code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{payment.amount} XAF</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(payment.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {payment.status}
                          </Badge>
                          {expired && payment.status === 'Pending' && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {payment.payment_method || "Not specified"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">
                          {payment.transaction_id || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(payment.created_at).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.expires_at ? (
                          <div className="text-sm">
                            <div className={expired ? "text-red-500" : ""}>
                              {new Date(payment.expires_at).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(payment.expires_at).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No expiry</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment)
                            setDetailsDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              View and manage payment information
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Team</Label>
                  <p className="text-sm">{selectedPayment.teams.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedPayment.teams.team_code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-lg font-bold">{selectedPayment.amount} XAF</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(selectedPayment.status)}>
                      {selectedPayment.status}
                    </Badge>
                    {isExpired(selectedPayment.expires_at) && selectedPayment.status === 'Pending' && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm">{selectedPayment.payment_method || "Not specified"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Transaction ID</Label>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {selectedPayment.transaction_id || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Created At</Label>
                  <p className="text-sm">{new Date(selectedPayment.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Updated At</Label>
                  <p className="text-sm">{new Date(selectedPayment.updated_at).toLocaleString()}</p>
                </div>
              </div>

              {selectedPayment.expires_at && (
                <div>
                  <Label className="text-sm font-medium">Expires At</Label>
                  <p className={`text-sm ${isExpired(selectedPayment.expires_at) ? 'text-red-500' : ''}`}>
                    {new Date(selectedPayment.expires_at).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Status Update Actions */}
              {selectedPayment.status === 'Pending' && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium mb-3 block">Update Status</Label>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdatePaymentStatus(selectedPayment.id, 'Completed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUpdatePaymentStatus(selectedPayment.id, 'Failed')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Mark as Failed
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
