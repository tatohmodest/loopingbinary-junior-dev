"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ProgramAlertBannerProps {
  onClose?: () => void
}

export function ProgramAlertBanner({ onClose }: ProgramAlertBannerProps) {
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
        setTimeLeft(`${days}d ${hours}h left`)
      } else {
        setTimeLeft("Expired")
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000)
    return () => clearInterval(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <div className="bg-green-900 text-white text-xs py-2 px-4 relative">
      <div className="flex items-center justify-center space-x-2 max-w-7xl mx-auto">
        <span className="font-medium">
          🔥 LoopingBinary Program Started - Register your team now! 
        </span>
        <span className="font-mono bg-black/20 px-2 py-1 rounded">
          {timeLeft}
        </span>
        <button
          onClick={handleClose}
          className="absolute right-2 hover:bg-black/20 rounded p-1"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
