import Loader from '@/components/loader'
import React, { Suspense } from 'react'
import VerifyPage from './verify'

function Verify() {
  return (
    <div>
      <Suspense fallback={<Loader />}>
      <VerifyPage />
      </Suspense>
    </div>
  )
}

export default Verify
