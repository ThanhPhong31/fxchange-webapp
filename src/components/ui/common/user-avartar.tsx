import { useAuth } from '@/contexts/auth-context'
import cn from '@/libs/utils'
import { WithClassName } from '@/types/common'
import { Avatar } from '@mui/joy'
import Image from 'next/image'
import React from 'react'

export type AvatarSize = 'sm' | 'md' | 'lg'
interface UserAvatarProps extends WithClassName {
  src?: string
  alt?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  size?: AvatarSize
  width?: number
}

const UserAvatar = ({
  src,
  alt,
  onClick,
  size = 'md',
  width,
  className,
  ...props
}: UserAvatarProps) => {
  const { user } = useAuth()

  const sizes = {
    sm: 30,
    md: 40,
    lg: 60,
  }

  return (
    <button
      className={cn(
        'overflow-hidden flex-shrink-0 w-full rounded-full aspect-square bg-slate-100',
        className
      )}
      style={{
        maxWidth: width || sizes[size],
      }}
      onClick={onClick ?? onClick}
    >
      <Image
        className="w-full h-full aspect-square"
        width={width || sizes[size]}
        height={width || sizes[size]}
        {...props}
        src={src || 'https://source.unsplash.com/random'}
        alt={alt || ''}
        rel="noreferrer"
        referrerPolicy="no-referrer"
        // variant="soft"
        // color="primary"
      />
    </button>
  )
}

export default UserAvatar
