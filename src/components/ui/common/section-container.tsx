import cn from '@/libs/utils'
import { WithChildren } from '@/types/WithChildren'
import { WithClassName } from '@/types/common'
import React from 'react'

const SectionContainer = ({ children, className }: WithChildren & WithClassName) => {
  return (
    <div
      className={cn(
        'md:bg-white md:shadow-black/5 md:shadow-md md:rounded-xl md:overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  )
}

export default SectionContainer
