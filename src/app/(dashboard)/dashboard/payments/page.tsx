// src/app/(dashboard)/dashboard/payments/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  CalendarIcon,
  Loader2
} from "lucide-react"
import { initializePayment } from "@/lib/payunit"

export default function PaymentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [team, setTeam] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
         const {data} = await supabase.auth.getSession();
      const access_token = data?.session?.access_token;
       console.log("Access token : ", access_token)
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)

        // Try to find a team where the user is a member
        let { data: teamMember } = await supabase
          .from("team_members")
          .select("team_id, teams(*)")
          .eq("user_id", user.id)
          .single()

        let teamData = null

        // If not a member, check if user created a team
        if (!teamMember) {
          const { data: createdTeam } = await supabase
            .from("teams")
            .select("*")
            .eq("created_by", user.id)
            .single()
          if (createdTeam) {
            teamData = createdTeam
          }
        } else {
          teamData = teamMember.teams
        }

        if (teamData) {
          setTeam(teamData)
          // Fetch payments for this team
          const { data: paymentsData } = await supabase
            .from("payments")
            .select("*")
            .eq("team_id", teamData.id)
            .order("created_at", { ascending: false })
          setPayments(paymentsData || [])
        } else {
          setTeam(null)
          setPayments([])
        }
      } catch (error: any) {
        setError(error.message || "Failed to load payment data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])
  
  const handleMakePayment = async () => {
    setProcessingPayment(true);
    setError(null);
      const {data} = await supabase.auth.getSession();
      const access_token = data?.session?.access_token;
      console.log("access_token", access_token)

    try {
      if (!team) {
        console.log("No team found for payment.");
        throw new Error("You must be in a team to make a payment");
      }
  
      const transactionId = `TEAM-${team.id}-${Date.now()}`;
      console.log("Creating pending payment record...", { transactionId });

      // First create pending payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert([
          {
            team_id: team.id,
            amount: 5000, // 5000 XAF
            payment_method: "PayUnit",
            transaction_id: transactionId,
            status: "Pending",
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
          }
        ])
        .select()
        .single();

      console.log("Supabase payment insert response:", { payment, paymentError });
     
      if (paymentError) throw paymentError;
     

      // Initialize PayUnit payment using your implementation
      console.log("Calling /api/payunit with:", {
        amount: 5000,
        transactionId,
        successUrl: `${window.location.origin}/dashboard/payments/success?payment_id=${payment.id}`,
        cancelUrl: `${window.location.origin}/dashboard/payments/cancel?payment_id=${payment.id}`,
        description: `Team Subscription for ${team.name}`,
      });

      const payunitResponse = await fetch("/api/payunit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${access_token}`

         },
        body: JSON.stringify({
          amount: 5000,
          transactionId,
          successUrl: `${window.location.origin}/dashboard/payments/success?payment_id=${payment.id}`,
          cancelUrl: `${window.location.origin}/dashboard/payments/cancel?payment_id=${payment.id}`,
          description: `Team Subscription for ${team.name}`,

        }),
      }).then(async res => {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          console.log("Raw /api/payunit response JSON:", json);
          return json;
        } catch (e) {
          console.error("Raw /api/payunit response (not JSON):", text);
          throw new Error("PayUnit API did not return JSON");
        }
      });

      console.log("PayUnit response after fetch:", payunitResponse);

      if (payunitResponse.status === 'SUCCESS' && payunitResponse.data?.redirect) {
        console.log("Redirecting to PayUnit URL:", payunitResponse.data.redirect);
        window.location.href = payunitResponse.data.redirect;
      } else {
        console.error("PayUnit error or missing redirect:", payunitResponse);
        throw new Error(payunitResponse?.message || "Failed to initialize payment");
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || "Failed to process payment");
    } finally {
      setProcessingPayment(false);
    }
  }
  
  const getSubscriptionStatus = () => {
    if (!payments || payments.length === 0) {
      return "Inactive"
    }
    
    const latestPayment = payments[0]
    if (latestPayment.status !== "Completed") {
      return "Pending"
    }
    
    const expiryDate = new Date(latestPayment.expires_at)
    const now = new Date()
    
    return expiryDate > now ? "Active" : "Expired"
  }
  
  const getExpiryDate = () => {
    if (!payments || payments.length === 0) {
      return null
    }
    
    const latestPayment = payments[0]
    if (latestPayment.status !== "Completed") {
      return null
    }
    
    return new Date(latestPayment.expires_at).toLocaleDateString()
  }
  
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()} XAF`;
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <p className="text-muted-foreground">
          Manage your team's subscription payments
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!team ? (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center py-6">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Team Found</h3>
              <p className="text-muted-foreground mb-6">
                You need to be part of a team to manage payments
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => router.push("/dashboard/team/create")}>
                  Create Team
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/team/join")}>
                  Join Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
             <CardDescription>
                Current subscription status for team {team.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <div className="flex items-center mt-1">
                    <Badge className={
                      getSubscriptionStatus() === "Active" 
                        ? "bg-green-500" 
                        : getSubscriptionStatus() === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }>
                      {getSubscriptionStatus()}
                    </Badge>
                    {getSubscriptionStatus() === "Active" && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
                    {getSubscriptionStatus() === "Pending" && <Clock className="ml-2 h-4 w-4 text-yellow-500" />}
                    {getSubscriptionStatus() === "Expired" && <AlertCircle className="ml-2 h-4 w-4 text-red-500" />}
                    {getSubscriptionStatus() === "Inactive" && <AlertCircle className="ml-2 h-4 w-4 text-red-500" />}
                  </div>
                </div>
                
                {getExpiryDate() && (
                  <div className="text-right">
                    <h3 className="font-semibold">Expires</h3>
                    <div className="flex items-center mt-1 text-muted-foreground">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {getExpiryDate()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <h3 className="font-semibold mb-2">Subscription Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span>Team Subscription</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span>{formatAmount(5000)} / month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Features</span>
                    <span>Full access to all Learning Kit and Modules</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {getSubscriptionStatus() !== "Active" && (
                <Button 
                  className="w-full" 
                  onClick={handleMakePayment}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" /> Make Payment
                    </>
                  )}
                </Button>
              )}
              {getSubscriptionStatus() === "Active" && (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleMakePayment}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" /> Renew Subscription
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Recent payments for your team subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {payment.payment_method}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs mt-1">
                          ID: {payment.transaction_id}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatAmount(payment.amount)}
                        </div>
                        <Badge className={
                          payment.status === "Completed" 
                            ? "bg-green-500" 
                            : payment.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Payment History</h3>
                  <p className="text-muted-foreground">
                    Your team hasn't made any payments yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
