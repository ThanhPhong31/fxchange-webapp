import ChatBox from '../chat/chat-box'
import UserAvatar from '../common/user-avartar'
import { useAuth } from '@/contexts/auth-context'
import { useChat } from '@/contexts/chat-context'
import chatQuery from '@/graphql/queries/chat-query'
import cn from '@/libs/utils'
import { ConversationListGraphQLResponse } from '@/types/common'
import { Conversation, Message, UserDetailInResponse } from '@/types/model'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Maximize } from '@mui/icons-material'
import { useMediaQuery } from '@mui/material'
import { Button, Drawer, Space } from 'antd'
import { Maximize2, Minimize2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface ChatDrawerProps {
  open: boolean
  onClose: () => void
}
//chat drawer
function getReceiver(
  conversation: Conversation,
  uid?: string | null
): UserDetailInResponse | undefined {
  if (!uid) return undefined
  return conversation?.participants?.filter((usr) => usr.id !== uid)[0]
}

const ChatDrawer = ({ open, onClose }: ChatDrawerProps) => {
  const [getConversations, { data, loading, error, called }] =
    useLazyQuery<ConversationListGraphQLResponse>(chatQuery.conversations())

  const { user } = useAuth()
  const {
    currentConversation,
    sendMessage,
    currentMessages,
    onChangeConversation,
    setConversations,
    conversations,
    isLoadMessage,
  } = useChat()
  const isMobile = useMediaQuery('(max-width:768px)')
  const [showConversations, setShowConversations] = useState(false)
  const [isExpand, setIsExpand] = useState(false)
  const receiver = useMemo<UserDetailInResponse | null | undefined>(() => {
    if (!currentConversation || !user || !user.uid) return null
    return getReceiver(currentConversation, user.uid)
  }, [currentConversation, user])

  useEffect(() => {
    const isLoadedConversationSuccess = data && !loading && !error
    if (isLoadedConversationSuccess) setConversations(data.conversations)
  }, [data, loading, error, setConversations])

  useEffect(() => {
    const inChat = Boolean(currentConversation) && isMobile
    setShowConversations(!inChat)
  }, [currentConversation, isMobile])

  useEffect(() => {
    if (open) getConversations()
  }, [getConversations, open])

  const onToggleExpand = () => {
    setIsExpand(!isExpand)
  }

  return (
    <Drawer
      title="Hỏi đáp"
      placement="right"
      bodyStyle={{
        padding: 0,
      }}
      className="!p-0 "
      width={800}
      contentWrapperStyle={{
        width: isMobile || isExpand ? '100%' : 800,
      }}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button
            onClick={onToggleExpand}
            icon={isExpand ? <Minimize2 /> : <Maximize2 />}
          >
            {isExpand ? 'Thu hẹp' : 'Mở rộng'}
          </Button>
          <Button onClick={onClose}>Thoát</Button>
        </Space>
      }
    >
      <div className="flex h-full">
        <div
          className={cn(
            'hidden flex-col w-[25vw] max-md:w-full overflow-auto h-full border-r py-3',
            !isMobile && 'flex',
            showConversations && 'flex'
          )}
        >
          {conversations.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              selected={currentConversation?.channel_id === c.channel_id}
              onSelect={onChangeConversation}
            />
          ))}
        </div>
        {(!isMobile || !showConversations) && (
          <ChatBox
            onShowConversation={() => {
              setShowConversations(true)
            }}
            isLoading={isLoadMessage}
            conversation={currentConversation}
            onSendMessage={sendMessage}
            currentUser={user}
            receiver={receiver}
            messages={currentMessages}
          />
        )}
      </div>
    </Drawer>
  )
}

const ConversationItem = ({
  conversation,
  selected = false,
  onSelect,
}: {
  conversation: Conversation
  selected?: boolean
  onSelect: (conversation: Conversation) => void
}) => {
  const { user, isValidating } = useAuth()
  if (isValidating && !user) return <div>loading...</div>
  const receiver = getReceiver(conversation, user?.uid)
  return (
    <div
      className={cn(
        'flex items-center group focus:bg-slate-100 active:bg-slate-200 w-full gap-3 px-4 py-2 bg-white cursor-pointer conversation hover:bg-slate-100',
        {
          'bg-sky-100/50 hover:bg-primary-100': selected,
        }
      )}
      onClick={() => onSelect(conversation)}
    >
      <UserAvatar
        src={receiver?.information.avatar_url}
        alt={receiver?.information.full_name || 'Ẩn danh'}
      />
      <div>
        <h4 className="text-sm font-semibold line-clamp-1">
          {receiver?.information.full_name || 'Ẩn danh'}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-1">
          {conversation?.last_message?.sender && (
            <span>{conversation.last_message?.sender?.id === user?.uid && 'Bạn: '}</span>
          )}
          {conversation.last_message?.content}
        </p>
      </div>
    </div>
  )
}

export default ChatDrawer
