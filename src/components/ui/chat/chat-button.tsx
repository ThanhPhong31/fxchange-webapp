import { useApp } from '@/contexts/app-context'
import { IconButton } from '@mui/joy'
import { Badge } from 'antd'
import { MessageCircle } from 'lucide-react'
import React from 'react'

const ChatButton = () => {
  const { onOpenChatDrawer, totalUnreadMessageNotifications } = useApp()
  return (
    <Badge
      className="z-50"
      dot={totalUnreadMessageNotifications > 0}
      color="blue"
    >
      <IconButton
        variant="plain"
        color="neutral"
        className="max-md:hidden"
        onClick={() => onOpenChatDrawer()}
      >
        <MessageCircle />
      </IconButton>
    </Badge>
  )
}

export default ChatButton
