import cn from '@/libs/utils'
import { Chip } from '@mui/joy'
import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: '1' | '2' | '3' | '4' | undefined | null | string
}

export const badgeVariant: {
  [key: string]: string
} = {
  exchange: '1',
  market: '2',
  auction: '3',
  donate: '4',
}

function Badge({ children, className, variant = '1' }: BadgeProps) {
  return (
    <Chip
      variant="soft"
      size="sm"
      className={cn(
        '!min-w-[80px] !text-xs max-md:!text-[10px] !text-white bg-primary-700 max-md:!px-3 text-center !px-5',
        {
          '!bg-gradient-to-r !from-primary-500 !to-primary-700': variant === '1',
          '!bg-gradient-to-r !from-sky-500 !to-sky-700': variant === '2',
          '!bg-gradient-to-r !from-amber-500 !to-amber-700': variant === '3',
          '!bg-gradient-to-r !from-violet-500 !to-violet-700': variant === '4',
        },
        className
      )}
    >
      {children}
    </Chip>
  )
}

export default Badge
