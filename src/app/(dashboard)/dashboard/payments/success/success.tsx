// src/app/(dashboard)/dashboard/payments/success/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"
import { verifyPayment } from "@/lib/payunit"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentVerified, setPaymentVerified] = useState(false)

  useEffect(() => {
    const verifyAndUpdatePayment = async () => {
      try {
        const paymentId = searchParams.get("payment_id")
        
        if (!paymentId) {
          throw new Error("Payment ID not found")
        }
        
        // Get payment details from database
        const { data: payment, error: paymentError } = await supabase
          .from("payments")
          .select("*")
          .eq("id", paymentId)
          .single()
          
        if (paymentError || !payment) {
          throw new Error("Payment not found")
        }
        
        // Verify payment with PayUnit
        const isVerified = await verifyPayment(payment.transaction_id)
        
        if (isVerified) {
          // Update payment status to completed
          const expiryDate = new Date()
          expiryDate.setMonth(expiryDate.getMonth() + 1) // 1 month subscription
          
          const { error: updateError } = await supabase
            .from("payments")
            .update({
              status: "Completed",
              expires_at: expiryDate.toISOString()
            })
            .eq("id", paymentId)
            
          if (updateError) throw updateError
          
          // Update team to active
          const { error: teamError } = await supabase
            .from("teams")
            .update({ active: true })
            .eq("id", payment.team_id)
            
          if (teamError) throw teamError
          
          setPaymentVerified(true)
        } else {
          throw new Error("Payment could not be verified")
        }
      } catch (error: any) {
        console.error("Error verifying payment:", error)
        setError(error.message || "Failed to verify payment")
      } finally {
        setLoading(false)
      }
    }
    
    verifyAndUpdatePayment()
  }, [searchParams, router])
  
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Payment {loading ? "Processing" : paymentVerified ? "Successful" : "Failed"}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p>Verifying your payment...</p>
            </div>
          ) : paymentVerified ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground mb-4">
                Your team has been activated successfully.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Payment Failed</h3>
              <p className="text-muted-foreground mb-4">
                {error || "There was an issue with your payment."}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => router.push("/dashboard/payments")}
            disabled={loading}
          >
            Return to Payments
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
