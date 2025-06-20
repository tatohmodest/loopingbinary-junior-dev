// src/app/(dashboard)/dashboard/payments/cancel/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updateCancelledPayment = async () => {
      try {
        const paymentId = searchParams.get("payment_id")
        
        if (!paymentId) {
          throw new Error("Payment ID not found")
        }
        
        // Update payment status to cancelled
        const { error: updateError } = await supabase
          .from("payments")
          .update({
            status: "Cancelled"
          })
          .eq("id", paymentId)
          
        if (updateError) throw updateError
      } catch (error: any) {
        console.error("Error updating cancelled payment:", error)
        setError(error.message || "Failed to update payment status")
      } finally {
        setLoading(false)
      }
    }
    
    updateCancelledPayment()
  }, [searchParams, router])
  
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <AlertCircle className="h-12 w-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Payment Cancelled</h3>
            <p className="text-muted-foreground mb-4">
              Your payment was cancelled. Your team will remain inactive until payment is completed.
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
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
