import CenterContainer from '../common/center-container'
import ChatInput from '../form/input/comment-input'
import DangerModal from '../modal/danger-modal'
import ScheduleModal from '../modal/schedule-modal'
import ChatBoxHeader from './chat-box-header'
import ChatPinStuff from './chat-pin-stuff'
import VirtualMessageList from './virtual-message-list'
import ChatBoxEmpty from '@/components/exceptions/chat-box-empty'
import { useApp } from '@/contexts/app-context'
import { useChat } from '@/contexts/chat-context'
import { useSocket } from '@/contexts/socket-context'
import chatQuery from '@/graphql/queries/chat-query'
import transactionQuery from '@/graphql/queries/transaction-query'
import { ConversationType } from '@/libs/constants'
import { TransactionGraphQLResponse } from '@/types/common'
import { Conversation, Message, Stuff, User, UserDetailInResponse } from '@/types/model'
import { useMutation } from '@apollo/client'
import { CircularProgress } from '@mui/joy'
import { Send } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface TransactionFormData {
  is_pickup: boolean | null
  expire_at?: Date | null
  exchange_stuff_id?: string | null
  stuff_id: string | null
}

interface ChatBoxProps {
  conversation?: Conversation | null
  onSendMessage: (content: string, receiver_id: string) => void
  currentUser?: User | null
  receiver?: UserDetailInResponse | null
  messages?: Message[]
  isLoading?: boolean
  onShowConversation: () => void
}

const ChatBox = ({
  conversation,
  onSendMessage,
  currentUser,
  receiver,
  messages = [],
  isLoading,
  onShowConversation,
}: ChatBoxProps) => {
  const { onCloseChatDrawer, messageApi } = useApp()
  const { socket } = useSocket()
  const router = useRouter()
  const { joinConversation } = useChat()
  const [
    startTransaction,
    { loading: loadOnStartTransaction, error: errorOnStartTransaction, data: startedTransaction },
  ] = useMutation<TransactionGraphQLResponse>(transactionQuery.startTransaction())
  const [detachStuff, { data: updatedStuff, loading: isDetaching, error: errorOnDetachStuff }] =
    useMutation(chatQuery.detachStuffFromConversation())
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    if (!socket) return
    socket.on('conversation:detached', (payload: { conversation: Conversation; from: string }) => {
      const { conversation: updatedConversation, from } = payload
      if (
        conversation?.channel_id === updatedConversation?.channel_id &&
        receiver?.id &&
        currentUser?.uid !== from
      ) {
        messageApi?.warning(
          receiver?.information.full_name +
            ' không muốn tiếp tục giao dịch ' +
            (conversation?.stuff?.name || 'Món đồ') +
            ' sẽ bị gỡ khỏi cuộc hội thoại này.'
        )
        messageApi?.loading('Tải lại cuộc trò chuyện')
        joinConversation(receiver.id, 'DISCUSSING')
      }
    })
  }, [
    conversation?.channel_id,
    conversation?.stuff?.name,
    currentUser?.uid,
    joinConversation,
    messageApi,
    receiver,
    receiver?.information.full_name,
    socket,
  ])

  useEffect(() => {
    if (startedTransaction) {
      setShowScheduleModal(false)
      onCloseChatDrawer()
      router.push('/transactions/' + startedTransaction.transaction.id)
    }
  }, [onCloseChatDrawer, router, startedTransaction])

  if (!conversation || !receiver) return <ChatBoxEmpty />

  if (!currentUser) return <div>Login first</div>

  const handleSendMessage = (value: string) => {
    if (value?.trim() === '') return console.error('Enter message first')
    if (!receiver) return console.error('Receiver is not found')
    return onSendMessage && onSendMessage(value, receiver?.id)
  }

  const isOwner = (id?: string) => {
    return id === currentUser.uid
  }

  const handleConfirm = () => {
    setShowScheduleModal(true)
  }

  const handleCancel = () => {
    setShowCancelModal(true)
  }

  const handleConfirmDetachStuff = async () => {
    const response = await detachStuff({
      variables: {
        channelId: conversation.channel_id,
      },
    })

    if (response.data && !response.errors) {
      joinConversation(receiver.id, 'DISCUSSING')
    }
  }

  const isStuffOwner = conversation.stuff && isOwner(conversation?.stuff.author.id)
  const hasStuff = Boolean(conversation?.stuff)
  const handleConfirmTransaction = (isPickup: boolean, date?: Date | null) => {
    if (!conversation.stuff) return
    if (!conversation.participants) return
    const customer = conversation.participants.find((p) => p.id !== conversation.stuff?.author.id)
    if (!customer) return
    const transaction: TransactionFormData = {
      is_pickup: isPickup,
      expire_at: date,
      stuff_id: conversation.stuff?.id,
      exchange_stuff_id: conversation?.exchange_stuff?.id,
    }

    startTransaction({
      variables: {
        ...transaction,
      },
    })
  }

  return (
    <div className="relative w-full h-full">
      {loadOnStartTransaction && (
        <CenterContainer className="fixed inset-0 bg-transparent">
          <CircularProgress />
        </CenterContainer>
      )}

      <ChatBoxHeader
        onShowConversation={onShowConversation}
        user={receiver}
      />
      {hasStuff && (
        <ChatPinStuff
          isLoading={isDetaching || loadOnStartTransaction}
          onDetach={handleConfirmDetachStuff}
          isDiscussing={conversation.status === ConversationType.DISCUSSING}
          stuff={conversation.stuff as Stuff}
          exchangeStuff={conversation.exchange_stuff as Stuff}
          isOwner={isStuffOwner}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {messages && messages.length > 0 ? (
        <VirtualMessageList
          messages={messages}
          hasPin={hasStuff}
          loading={isLoading}
        />
      ) : (
        <div className="h-[calc(100vh-260px)] flex flex-wrap items-center justify-center">
          <p className="max-w-xs text-lg font-medium text-center">
            Nhập nội dung và nhấn nút
            <span className="inline-block p-1 mx-2 rounded-md w-fit bg-slate-100">
              <Send size={20} />
            </span>
            để bắt đầu trao đổi
          </p>
        </div>
      )}
      <div className="w-full bg-white ">
        <ChatInput onSubmit={handleSendMessage} />
      </div>
      {isStuffOwner && (
        <ScheduleModal
          title="Lên lịch hẹn"
          onConfirm={() => {}}
          onConfirmExchange={handleConfirmTransaction}
          open={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          loading={loadOnStartTransaction}
        />
      )}
      {hasStuff && (
        <DangerModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmDetachStuff}
          open={showCancelModal}
          title="Xác nhận hủy giao dịch"
          description="Bạn chắc chắn muốn hủy giao dịch này?"
          isLoading={isDetaching}
        />
      )}
    </div>
  )
}

export default ChatBox
