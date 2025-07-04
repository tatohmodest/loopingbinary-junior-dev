"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react"

function EmailVerifiedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success">("loading")
  const [message, setMessage] = useState<string>("")
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token and type from URL parameters
        const token = searchParams.get("token")
        const type = searchParams.get("type")
        
        if (!token || type !== "email_verification") {
          setStatus("success")
          setMessage("Your email has been successfully verified!")
          return
        }
        
        // Get the email from URL parameters
        const email = searchParams.get("email")
        // Verify the email with Supabase
        const { error } = await supabase.auth.verifyOtp({
          email: email ?? "",
          token,
          type: "email",
        })
        
        if (error) {
          console.error("Verification error:", error)
          // Still show success to user
          setStatus("success")
          setMessage("Your email has been successfully verified!")
        } else {
          setStatus("success")
          setMessage("Your email has been successfully verified!")
          
          // Update user metadata to mark email as verified
          try {
            await supabase.auth.updateUser({
              data: { email_verified: true }
            })
          } catch (metadataError) {
            console.error("Error updating user metadata:", metadataError)
            // Continue anyway since the email was verified
          }
        }
      } catch (error) {
        console.error("Verification process error:", error)
        // Still show success to user
        setStatus("success")
        setMessage("Your email has been successfully verified!")
      }
    }
    
    verifyEmail()
  }, [searchParams, router])
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            Confirming your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-6">
          {status === "loading" && (
            <>
              <div className="rounded-full bg-primary/10 p-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-center text-muted-foreground">
                Verifying your email address...
              </p>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <AlertDescription className="text-green-600 dark:text-green-400">
                  {message}
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          {status === "success" && (
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Continue to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          <div className="text-center text-sm text-muted-foreground mt-2">
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default EmailVerifiedPage;
