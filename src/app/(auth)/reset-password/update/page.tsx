import React, { Suspense } from 'react'
import ResetPasswordUpdatePage from './update'
import { Loader2 } from 'lucide-react'

function UpdatePassword() {
  return (
    <div>
      <Suspense fallback={(  <div>
       
  
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      </div>)}>
      <ResetPasswordUpdatePage />

      </Suspense>
    </div>
  )
}

export default UpdatePassword
