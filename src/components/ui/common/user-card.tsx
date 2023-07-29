import UserAvatar, { AvatarSize } from './user-avartar'
import cn from '@/libs/utils'
import { Tooltip } from 'antd'
import React from 'react'

interface UserCardProps {
  avatarUrl?: string
  username?: string
  avatarSize?: AvatarSize
  avatarWidth?: number
  userNameClassName?: string
  additionalInformation?: React.ReactNode
}

const UserCard = ({
  avatarUrl,
  username,
  additionalInformation,
  avatarSize = 'sm',
  avatarWidth,
  userNameClassName,
}: UserCardProps) => {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar
        className="flex-shrink-0"
        size={avatarSize}
        width={avatarWidth}
        src={avatarUrl || 'https://source.unsplash.com/random'}
      />
      <div>
        <Tooltip title={username || 'Ẩn danh'}>
          <h4
            className={cn(
              'text-sm font-sans line-clamp-1 font-semibold cursor-pointer hover:underline max-md:text-base',
              userNameClassName
            )}
          >
            {username || 'Ẩn danh'}
          </h4>
        </Tooltip>
        {additionalInformation && (
          <>
            <span className="font-sans whitespace-nowrap line-clamp-1">
              {additionalInformation}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default UserCard
