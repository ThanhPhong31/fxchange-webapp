import cn from '@/libs/utils'
import React from 'react'

function AppContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('container py-8', className)}>{children}</div>
}

export default AppContainer
