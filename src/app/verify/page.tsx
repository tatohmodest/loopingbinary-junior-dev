// src/app/verify/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailInput, setEmailInput] = useState(email || "")
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  
  useEffect(() => {
    // Check if we have a verification token in the URL
    const token = searchParams.get("token")
    const type = searchParams.get("type")
    
    if (token && type === "email") {
      handleVerification(token)
    }
  }, [searchParams])
  
  const handleVerification = async (token: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Verify the user's email with the token
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })
      
      if (error) throw error
      
      setSuccess(true)
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "Failed to verify email")
    } finally {
      setLoading(false)
    }
  }
  
  const resendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setResendLoading(true)
    setError(null)
    setResendSuccess(false)
    
    try {
      if (!emailInput.trim()) {
        throw new Error("Please enter your email address")
      }
      
      // Send a new verification email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailInput,
      })
      
      if (error) throw error
      
      setResendSuccess(true)
    } catch (error: any) {
      setError(error.message || "Failed to resend verification email")
    } finally {
      setResendLoading(false)
    }
  }
  
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/login"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {success ? "Email Verified!" : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-center">
              {success 
                ? "Your email has been successfully verified." 
                : "Check your email for a verification link"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid gap-4">
            {loading && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Redirecting you to the dashboard...
                </p>
              </div>
            ) : (
              <>
                {email && !success && (
                  <div className="p-4 border rounded-lg bg-muted">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Verification email sent!</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          We've sent a verification link to <span className="font-medium">{email}</span>. 
                          Please check your inbox and spam folder.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {resendSuccess && (
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      Verification email has been resent. Please check your inbox.
                    </AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={resendVerification} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={resendLoading}>
                    {resendLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                      </>
                    ) : (
                      "Resend Verification Email"
                    )}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
          
          {success && (
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
