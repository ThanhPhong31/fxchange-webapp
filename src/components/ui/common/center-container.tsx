import cn from '@/libs/utils'
import { WithClassName } from '@/types/common'
import React from 'react'

interface Props extends WithClassName {
  children?: React.ReactNode
  fixed?: boolean
}

const CenterContainer = ({ children, className, fixed = false }: Props) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center h-screen',
        fixed && 'fixed inset-0',
        className
      )}
    >
      {children}
    </div>
  )
}

export default CenterContainer
