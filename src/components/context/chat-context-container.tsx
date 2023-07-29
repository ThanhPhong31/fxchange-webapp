import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import { ChatProvider } from '@/contexts/chat-context'
import { useSocket } from '@/contexts/socket-context'
import client from '@/graphql'
import chatQuery from '@/graphql/queries/chat-query'
import { ConversationType } from '@/libs/constants'
import { generateUUID } from '@/libs/utils'
import { WithChildren } from '@/types/WithChildren'
import { ConversationListGraphQLResponse, MessagesListGraphQLResponse } from '@/types/common'
import { Conversation, ConversationTypeEnum, Message } from '@/types/model'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

interface MessagePayload {
  id?: string
  external_id: string
  channel_id: string
  content: string
  sender_id: string
  receiver_id: string
}

function ChatContextContainer({ children }: WithChildren) {
  const router = useRouter()
  const { notifyError, chatDrawer } = useApp()
  const { user, isValidating } = useAuth()
  const { socket, isConnected } = useSocket()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isDiscussion, setIsDiscussion] = useState(false)
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])
  const [sendMessageAPI, { data, loading: loadingOnSendMessage, error: errorOnSendMessage }] =
    useMutation(chatQuery.sendMessage())
  const [
    fetchMessages,
    { data: messagesData, loading: loadingMessages, error, refetch: refetchMessages, called },
  ] = useLazyQuery<MessagesListGraphQLResponse>(chatQuery.messages(), {
    fetchPolicy: 'network-only',
  })
  const [forceFetchMessages, setForceFetchMessages] = useState(true)

  useEffect(() => {
    if (router.query.conversation) {
      const conversation = conversations.find((c) => c.channel_id === router.query.conversation)
      if (conversation) setCurrentConversation(conversation)
    }
  }, [conversations, router])

  useEffect(() => {
    if (chatDrawer && currentConversation && forceFetchMessages) {
      fetchMessages({
        variables: {
          channelId: currentConversation.channel_id,
        },
      })
      setForceFetchMessages(false)
    }

    if (!chatDrawer) setIsDiscussion(false)
  }, [chatDrawer, currentConversation, fetchMessages, forceFetchMessages])

  const pushMessage = useCallback((message: Message) => {
    if (!message) return console.error('Cannot push message')
    setCurrentMessages((prevMessages) => {
      const _messages = prevMessages
      if (!_messages.find((msg) => msg.external_id === message.external_id)) _messages.push(message)
      return _messages
    })
    setConversations((prevConversations) => {
      const _conversations = _.cloneDeep(prevConversations)
      _conversations.forEach((c) => {
        if (c.channel_id === message.channel_id) {
          if (!c.messages?.find((msg) => msg.external_id === message.external_id)) {
            c.messages?.push(message)
            c.last_message = message
          }
        }
      })
      return _conversations
    })
  }, [])

  useEffect(() => {
    if (messagesData && messagesData.messages && messagesData.messages.length > 0) {
      setCurrentMessages(messagesData.messages)
    }
  }, [messagesData])

  // useEffect(() => {
  //   if (loadingMessages) {
  //     setCurrentMessages([])
  //   }
  // }, [loadingMessages])

  React.useEffect(() => {
    if (!socket || isValidating) return
    socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [socket, isValidating])

  React.useEffect(() => {
    if (!socket || isValidating) return

    const createdMessageHandler = (message: Message) => {
      pushMessage(message)
    }

    socket.on('chat:transfer', createdMessageHandler)

    return () => {
      socket.off('chat:transfer', createdMessageHandler)
    }
  }, [socket, isValidating, pushMessage])

  const isExistInConversation = useCallback(
    (channelId: string) => {
      return !!conversations.find((cvs) => cvs.channel_id === channelId)
    },
    [conversations]
  )

  // Trigger when change conversation
  useEffect(() => {
    if (!currentConversation) return
    if (!isExistInConversation(currentConversation.channel_id)) {
      setConversations((prevState) => {
        prevState.push(currentConversation)
        return _.cloneDeep(prevState)
      })
    }

    if (!socket || !currentConversation) return
    socket.emit('chat:join', { channel_id: currentConversation.channel_id })
  }, [currentConversation, fetchMessages, isExistInConversation, socket])

  const joinConversation = useCallback(
    async (
      partnerId: string,
      type: ConversationTypeEnum,
      stuffId?: string,
      exchangeStuffId?: string
    ) => {
      try {
        const response = await client.mutate({
          mutation: chatQuery.startConversation(),
          variables: {
            partnerId: partnerId,
            type: type,
            stuffId: stuffId,
            exchangeStuffId: exchangeStuffId,
          },
        })
        const conversation: Conversation = response.data.conversation
        if (!conversation)
          return notifyError('Không thể bắt đầu trò chuyện', 'Cuộc hội thoại không tồn tại.')

        setCurrentConversation(conversation)
        updateConversation(conversation)
      } catch (error) {
        notifyError('Đã xảy ra lỗi', 'Chưa thể trò chuyện ngay lúc này. Vui lòng thử lại sau.')
      }
    },
    [notifyError]
  )

  const updateConversation = (conversation: Conversation) => {
    setConversations((prevConversations) => {
      const _conversations = _.cloneDeep(prevConversations)
      const targetIndex = _conversations.findIndex((c) => c.channel_id === conversation.channel_id)
      if (targetIndex) {
        _conversations.splice(targetIndex, 1, conversation)
      }
      return _.cloneDeep([..._conversations])
    })
  }

  const sendMessage = useCallback(
    (content: string) => {
      if (!user) return console.error('Must login first')
      if (!currentConversation) return console.error('Conversation not found')
      if (!content || content.trim() === '') return console.error('Enter message first.')

      const externalId = generateUUID(7)
      const message: Message = {
        channel_id: currentConversation.channel_id,
        content: content,
        external_id: externalId,
      }
      // socket?.emit('chat:send', message)
      sendMessageAPI({
        variables: {
          message: message,
        },
      })
      pushMessage({
        ...message,
        sender_id: user.uid as string,
      })
    },
    [currentConversation, pushMessage, sendMessageAPI, user]
  )

  const handleChangeConversation = (conversation?: Conversation | null) => {
    if (!conversation) return
    setCurrentMessages([])
    setCurrentConversation(conversation || null)
    fetchMessages({
      variables: {
        channelId: conversation.channel_id,
      },
    })
  }

  return (
    <ChatProvider
      value={{
        conversations: conversations,
        currentConversation: currentConversation,
        onChangeConversation: handleChangeConversation,
        currentMessages: currentMessages,
        joinConversation: joinConversation,
        sendMessage: sendMessage,
        setConversations: setConversations,
        isLoadMessage: loadingMessages,
        isDiscussion: isDiscussion,
        setIsDiscussion: setIsDiscussion,
      }}
    >
      {children}
    </ChatProvider>
  )
}

export default ChatContextContainer
