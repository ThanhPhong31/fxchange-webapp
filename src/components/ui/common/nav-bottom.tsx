import cn from '@/libs/utils'
import { WithChildren } from '@/types/WithChildren'
import { WithClassName } from '@/types/common'
import React from 'react'

interface NavBottom extends WithChildren, WithClassName {
  containerClassName?: string
  mount?: boolean
}

const NavBottom = ({ children, className, containerClassName, mount }: NavBottom) => {
  return (
    <div
      className={cn(
        ' w-full py-4 max-lg:py-3 bg-white',
        mount ? 'relative' : 'fixed bottom-0 left-0 z-10 border-t',
        className
      )}
    >
      <div className={cn('container flex justify-between w-full', containerClassName)}>
        {children}
      </div>
    </div>
  )
}

export default NavBottom
