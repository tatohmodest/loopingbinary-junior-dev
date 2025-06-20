import { Loader2 } from 'lucide-react'
import React, { Suspense } from 'react'
import PaymentCancelPage from './Cancel'

function Cancel() {
  return (
    <div>
      <Suspense fallback={(
          <div>
       
  
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      </div>
      )}>
        <PaymentCancelPage />
      </Suspense>
    </div>
  )
}

export default Cancel
