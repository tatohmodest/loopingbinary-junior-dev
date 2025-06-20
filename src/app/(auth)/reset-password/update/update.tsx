// src/app/(auth)/reset-password/update/page.tsx
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
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react"

export default function ResetPasswordUpdatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Check if we have the necessary parameters
        const accessToken = searchParams.get("access_token")
        const refreshToken = searchParams.get("refresh_token")
        const type = searchParams.get("type")
        
        if (!accessToken || !refreshToken || type !== "recovery") {
          setTokenValid(false)
          setValidatingToken(false)
          return
        }
        
        // Set the session in Supabase
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        
        if (error) throw error
        
        setTokenValid(true)
      } catch (error) {
        console.error("Token validation error:", error)
        setTokenValid(false)
      } finally {
        setValidatingToken(false)
      }
    }
    
    validateToken()
  }, [searchParams])
  
 

const handlePasswordUpdate = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)
  
  try {
    // Validate password
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }
    
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match")
    }
    
    // Update the password
    const { error } = await supabase.auth.updateUser({
      password
    })
    
    if (error) throw error
    
    setSuccess(true)
    
    // Redirect to confirmation page instead of login
    setTimeout(() => {
      router.push("/reset-password/confirmation?status=success")
    }, 1500)
  } catch (error: any) {
    setError(error.message || "Failed to update password")
    
    // For serious errors, redirect to the error confirmation page
    if (error.status === 401 || error.status === 403) {
      setTimeout(() => {
        router.push(`/reset-password/confirmation?status=error&message=${encodeURIComponent(error.message)}`)
      }, 1500)
    }
  } finally {
    setLoading(false)
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
              {success ? "Password Updated!" : "Set New Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {success 
                ? "Your password has been successfully updated" 
                : "Create a new password for your account"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid gap-4">
            {validatingToken && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {!validatingToken && !tokenValid && (
              <div className="text-center py-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Invalid or Expired Link</h3>
                <p className="text-sm text-muted-foreground">
                  This password reset link is invalid or has expired.
                </p>
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
                  Redirecting you to the login page...
                </p>
              </div>
            ) : (
              <>
                {!validatingToken && tokenValid && (
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                )}
                
                {!validatingToken && !tokenValid && (
                  <Button 
                    className="w-full" 
                    onClick={() => router.push("/reset-password")}
                  >
                    Request New Reset Link
                  </Button>
                )}
              </>
            )}
          </CardContent>
          
          {success && (
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => router.push("/login")}
              >
                Go to Login
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
