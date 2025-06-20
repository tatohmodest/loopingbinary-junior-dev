import { useState, useEffect } from "react";

 const AnimatedGridBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Grid Layer */}
      <div 
        className={`absolute inset-0 opacity-30 transition-opacity duration-2000 ${
          isVisible ? 'opacity-30' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,191,99,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,191,99,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'grid-drift 20s linear infinite'
        }}
      />
      
      {/* Animated Dots Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(0,191,99,0.4) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          animation: 'dots-pulse 4s ease-in-out infinite'
        }}
      />
      
      {/* Mouse-Following Glow */}
      <div
        className="absolute w-96 h-96 pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(0,191,99,0.15) 0%, rgba(0,191,99,0.05) 40%, transparent 70%)`,
          filter: 'blur(40px)',
          animation: 'glow-pulse 3s ease-in-out infinite'
        }}
      />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0">
        {Array.from({length: 8}).map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i * 12)}%`,
              width: `${40 + (i * 10)}px`,
              height: `${40 + (i * 10)}px`,
              background: `linear-gradient(45deg, rgba(0,191,99,0.2), transparent)`,
              borderRadius: i % 2 === 0 ? '50%' : '0%',
              animation: `float-${i % 3} ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Scanning Lines Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#00bf63] to-transparent opacity-30"
          style={{
            animation: 'scan-vertical 8s linear infinite'
          }}
        />
        <div 
          className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#00bf63] to-transparent opacity-30"
          style={{
            animation: 'scan-horizontal 12s linear infinite'
          }}
        />
      </div>
      
      {/* Neon Circuit Patterns */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path 
              d="M20,20 L180,20 L180,180 L20,180 Z M60,60 L140,60 L140,140 L60,140 Z" 
              stroke="rgba(0,191,99,0.3)" 
              strokeWidth="1" 
              fill="none"
              className="animate-pulse"
            />
            <circle cx="20" cy="20" r="3" fill="rgba(0,191,99,0.5)" className="animate-pulse" />
            <circle cx="180" cy="180" r="3" fill="rgba(0,191,99,0.5)" className="animate-pulse" style={{animationDelay: '1s'}} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
      
      {/* Particle System */}
      <div className="absolute inset-0">
        {Array.from({length: 30}).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00bf63] rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-drift-${i % 4} ${8 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Energy Waves */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({length: 3}).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-[#00bf63]/20"
            style={{
              animation: `energy-wave ${4 + i}s ease-out infinite`,
              animationDelay: `${i * 1.5}s`,
              transform: 'scale(0)',
              transformOrigin: 'center'
            }}
          />
        ))}
      </div>
    </div>
  )
}
export default AnimatedGridBackground;