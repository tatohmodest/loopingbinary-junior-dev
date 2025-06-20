
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function ResetPasswordConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [status, setStatus] = useState<"success" | "error" | "loading">("loading")
  const [message, setMessage] = useState("")
  
  useEffect(() => {
    // Get status from URL parameters
    const statusParam = searchParams.get("status")
    const messageParam = searchParams.get("message")
    
    if (statusParam === "success") {
      setStatus("success")
      setMessage(messageParam || "Your password has been successfully reset.")
    } else if (statusParam === "error") {
      setStatus("error")
      setMessage(messageParam || "There was a problem resetting your password.")
    } else {
      // Default to success if no status provided
      setStatus("success")
      setMessage("Your password has been successfully reset.")
    }
  }, [searchParams])
  
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
              {status === "success" ? "Password Reset" : "Reset Failed"}
            </CardTitle>
            <CardDescription className="text-center">
              {status === "success" 
                ? "Your password has been updated" 
                : "There was a problem with your password reset"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid gap-4">
            {status === "loading" ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : status === "success" ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  {message}
                </p>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => router.push("/login")}
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
