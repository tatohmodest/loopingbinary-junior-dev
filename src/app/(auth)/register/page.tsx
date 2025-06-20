// src/app/(auth)/register/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")
  
  // Check password strength
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }
    
    let strength = 0
    let feedback = []
    
    // Length check
    if (password.length >= 8) {
      strength += 1
    } else {
      feedback.push("Use at least 8 characters")
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 1
    } else {
      feedback.push("Add uppercase letters")
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      strength += 1
    } else {
      feedback.push("Add lowercase letters")
    }
    
    // Number check
    if (/[0-9]/.test(password)) {
      strength += 1
    } else {
      feedback.push("Add numbers")
    }
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1
    } else {
      feedback.push("Add special characters")
    }
    
    setPasswordStrength(strength)
    setPasswordFeedback(feedback.join(", "))
  }
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Basic validation
      if (!name.trim()) {
        throw new Error("Please enter your name")
      }
      
      if (!email.trim()) {
        throw new Error("Please enter your email address")
      }
      
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }
      
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }
      
      if (!acceptTerms) {
        throw new Error("You must accept the terms and conditions")
      }
      
      // Register the user with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/verified`,
        }
      })
      
      if (signUpError) throw signUpError
      
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        throw new Error("This email is already registered. Please try logging in.")
      }
      
      // Create profile in profiles table
      if (data?.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              name,
              email,
              created_at: new Date().toISOString()
            }
          ])
        
        if (profileError) {
          console.error("Error creating profile:", profileError)
         
        }
      }
      
      setSuccess(true)
      
      
     
    } catch (error: any) {
      setError(error.message || "Failed to register")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Register to join teams and start your journey
          </p>
        </div>
        
        <Card className="mx-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Sign up</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Registration Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a verification email to <span className="font-medium">{email}</span>.
                  Redirecting you to the verification page...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      checkPasswordStrength(e.target.value)
                    }}
                    required
                  />
                  
                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              passwordStrength >= level 
                                ? passwordStrength < 3 
                                  ? "bg-orange-500" 
                                  : "bg-green-500"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${
                        passwordStrength < 3 
                          ? "text-orange-500" 
                          : "text-green-500"
                      }`}>
                        {passwordStrength < 3 
                          ? "Weak password" 
                          : passwordStrength < 5 
                            ? "Good password" 
                            : "Strong password"}
                      </p>
                      {passwordFeedback && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {passwordFeedback}
                        </p>
                      )}
                    </div>
                  )}
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
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      terms and conditions
                    </Link>
                  </label>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="px-8 text-center text-sm text-muted-foreground">
          <p>
            By clicking "Register", you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
