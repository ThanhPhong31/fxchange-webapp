import cn from '@/libs/utils'
import React from 'react'

type Props = {
  children?: React.ReactNode
  className?: string
  fluid?: boolean
  variant?: 'outline' | 'primary'
}

function Button({ children, className, fluid = false, variant = 'primary' }: Props) {
  const buttonClassName =
    'flex items-center text-slate-800 font-medium justify-center rounded-md overflow-hidden px-4 py-2'
  const rootClassName = cn(
    buttonClassName,
    {
      ['w-full']: fluid,
      ['bg-primary-500 text-white']: variant === 'primary',
      ['border border-slate-200 hover:bg-slate-100']: variant === 'outline',
    },
    className
  )

  return <button className={rootClassName}>{children}</button>
}

export default Button
