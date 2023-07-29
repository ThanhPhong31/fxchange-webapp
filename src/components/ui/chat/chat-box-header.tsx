import UserCard from '../common/user-card'
import { UserDetailInResponse } from '@/types/model'
import { IconButton } from '@mui/joy'
import { ArrowLeft, ChevronLeft, MoreHorizontal } from 'lucide-react'
import React from 'react'

interface ChatBoxHeaderProps {
  user: UserDetailInResponse
  onShowConversation: () => void
}

const ChatBoxHeader = ({ user, onShowConversation }: ChatBoxHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-white border-b fx-chat-header">
      <div className="flex items-center gap-3">
        <ChevronLeft
          onClick={onShowConversation}
          className="hidden cursor-pointer max-md:block"
        />
        <UserCard
          avatarUrl={user?.information.avatar_url}
          username={user?.information.full_name}
        />
      </div>
      {/* <IconButton
        color="neutral"
        size="sm"
      >
        <MoreHorizontal />
      </IconButton> */}
    </div>
  )
}

export default ChatBoxHeader
