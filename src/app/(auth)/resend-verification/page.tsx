"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      if (!email || !email.includes('@')) {
        throw new Error("Please enter a valid email address")
      }
      
      // Send verification email
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/email-verified`,
        }
      })
      
      if (resendError) {
        throw resendError
      }
      
      setSuccess(true)
    } catch (error: any) {
      console.error('Error sending verification email:', error)
      setError(error.message || "Failed to send verification email")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Resend Verification Email</CardTitle>
          <CardDescription>
            Enter your email to receive a new verification link
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                <AlertTitle className="text-green-600 dark:text-green-500">Email Sent</AlertTitle>
                <AlertDescription className="text-green-600 dark:text-green-400">
                  A new verification link has been sent to {email}. Please check your inbox and spam folder.
                </AlertDescription>
              </Alert>
            )}
            
            {!success && (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            {!success && (
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                  </>
                ) : (
                  "Send Verification Email"
                )}
              </Button>
            )}
            
            <div className="text-center text-sm text-muted-foreground mt-2">
              <Link href="/login" className="inline-flex items-center underline underline-offset-4 hover:text-primary">
                <ArrowLeft className="mr-1 h-3 w-3" /> Back to login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}