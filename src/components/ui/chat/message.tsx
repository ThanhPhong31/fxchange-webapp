import UserAvatar from '../common/user-avartar'
import { useAuth } from '@/contexts/auth-context'
import cn from '@/libs/utils'
import { WithClassName } from '@/types/common'
import { Message as MessageType, UserDetailInMessage } from '@/types/model'
import { Chip } from '@mui/joy'
import { block } from 'million/react'
import React from 'react'

interface MessageProps extends WithClassName {
  message: MessageType
  currentUserId?: string | null
}

const Message: React.FC<MessageProps> = (props) => {
  const { user } = useAuth()

  const sender = props.message.sender
  const isOwnerChecker = (id?: string) => {
    return id === user?.uid
  }

  const isOwner = isOwnerChecker(props.message?.sender?.id || props.message?.sender_id)

  if (isOwner) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 ml-6 mr-1 mb-1',
          'peer/my flex-row-reverse',
          props.className
        )}
      >
        <Chip
          sx={{
            display: 'block',
            wordBreak: 'break-all',
            maxWidth: '100%',
            whiteSpace: 'pre-wrap',
            padding: '8px 12px ',
          }}
          size="lg"
          className="!font-normal text-sm"
          variant="solid"
          color="info"
        >
          {props.message.content}
        </Chip>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2 mr-6 ml-1 mb-1', 'peer/u', props.className)}>
      <UserAvatar
        src={sender?.information?.avatar_url || 'https://source.unsplash.com/random'}
        alt={sender?.information?.full_name || 'Avatar of user'}
        width={20}
      />
      <Chip
        sx={{
          display: 'block',
          wordBreak: 'break-all',
          maxWidth: '100%',
          whiteSpace: 'pre-wrap',
          padding: '8px 12px ',
        }}
        size="lg"
        className="!font-normal text-sm"
        variant="soft"
        color="neutral"
      >
        {props.message.content}
      </Chip>
    </div>
  )
}

// export default block(Message)
export default Message
