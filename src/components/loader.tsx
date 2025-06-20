import { Loader2 } from 'lucide-react'
import React from 'react'

function Loader() {
  return (
   
        <div>
       
  
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      </div>
    
  )
}

export default Loader
