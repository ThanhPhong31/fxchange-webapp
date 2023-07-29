import cn from '@/libs/utils'
import { Avatar } from '@mui/joy'
import moment from 'moment'
import Link from 'next/link'
import React, { useState } from 'react'

interface NotificationCardProps {
  id?: string
  content: string
  createdAt: Date
  url: string
  isRead: Boolean
  onRead: (notificationId: string) => void
  onClick: () => void
  [key: string]: any
}

const NotificationCard = ({
  content,
  createdAt,
  url,
  isRead = true,
  onRead,
  onClick,
  id,
  ...props
}: NotificationCardProps) => {
  const [isReadState, setIsReadState] = useState(isRead)
  return (
    <div
      className={cn(
        'px-3 py-2 cursor-pointer relative hover:bg-slate-100/80 rounded-lg overflow-hidden'
      )}
      onClick={() => {
        onClick()
        if (isRead || !id) return
        setIsReadState(true)
        onRead(id)
      }}
      {...props}
    >
      <Link
        className="flex items-center gap-3"
        href={url}
      >
        <Avatar />
        <div>
          <p
            className={cn(
              'line-clamp-3',
              isReadState ? 'text-gray-500 ' : 'text-zinc-900 font-medium'
            )}
          >
            {content}
          </p>
          <p className="text-xs text-primary-600">{moment(createdAt).format('HH:mm DD/MM/YYYY')}</p>
        </div>
      </Link>
      {!isReadState && (
        <div className="absolute w-2 h-2 -translate-y-1/2 bg-blue-700 rounded-full aspect-square top-1/2 right-3"></div>
      )}
    </div>
  )
}

export default NotificationCard
