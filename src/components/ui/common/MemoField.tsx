import { WithChildren } from '@/types/WithChildren'
import React, { memo } from 'react'

interface MemoFieldProps extends WithChildren {
  as?: React.ElementType<any>
  [key: string]: any
}

const MemoField = ({ as, children, ...props }: MemoFieldProps) => {
  const Component = as || 'div'
  return <Component {...props}>{children}</Component>
}

export default memo(MemoField)
