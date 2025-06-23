"use client"

import { useState, useEffect } from "react"
import { X, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProgramAlertCardProps {
  onClose?: () => void
  className?: string
}

export function ProgramAlertCard({ onClose, className = "" }: ProgramAlertCardProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const endDate = new Date("2025-07-23T23:59:59")
      const difference = endDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else {
        setTimeLeft("Expired")
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <Card className={`relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1 h-5 w-5 p-0 hover:bg-black/10 dark:hover:bg-white/10"
        onClick={handleClose}
      >
        <X className="h-3 w-3" />
      </Button>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
              Program Started! Expires July 23
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Time left: <span className="font-mono text-blue-600">{timeLeft}</span>
          </div>
          
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Register Your Team Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
