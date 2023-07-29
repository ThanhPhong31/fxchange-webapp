'use client'

import { excludeRoutes } from '@/libs/constants'
import { useRouter } from 'next/router'

function useLimit(currentRouter: string) {
  return excludeRoutes.includes(currentRouter)
}

export default useLimit
