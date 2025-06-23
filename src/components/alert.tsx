"use client"

import { useState, useEffect } from "react"
import { X, Clock } from "lucide-react"
import Link from "next/link"

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
        setTimeLeft(`${days}d ${hours}h`)
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
    <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white text-sm relative overflow-hidden">
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      <div className="relative flex items-center justify-between max-w-7xl mx-auto px-6 py-1">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold tracking-wide">
              🚀 LoopingBinary Junior Dev Program has began
            </span>
          </div>
          
          <div className="hidden sm:block h-4 w-px bg-white/30"></div>
          <Link href='/dashboard/team'>
          <span className="text-green-100 font-medium">

            Register your team now!
          </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
            <Clock className="h-3 w-3 text-green-200" />
            <span className="font-mono text-xs font-bold text-white">
              {timeLeft}
            </span>
          </div>
          
          <button
            onClick={handleClose}
            className="group hover:bg-white/20 rounded-full p-1.5 transition-all duration-300 hover:rotate-90"
            aria-label="Close banner"
          >
            <X className="h-4 w-4 group-hover:text-green-100" />
          </button>
        </div>
      </div>
    </div>
  )
}
