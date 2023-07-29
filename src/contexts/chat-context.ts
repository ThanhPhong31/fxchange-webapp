import { createContext, useContext } from 'react';

import { Conversation, ConversationTypeEnum, Message } from '@/types/model';

interface ChatContextArgs {
  currentConversation?: Conversation | null
  onChangeConversation: (conversation?: Conversation | null) => void
  conversations: Conversation[]
  setConversations: (conversations: Conversation[]) => void
  currentMessages: Message[]
  joinConversation: (
    partnerId: string,
    type: ConversationTypeEnum,
    stuffId?: string,
    exchangeStuffId?: string
  ) => void
  sendMessage: (content: string) => void
  isLoadMessage: boolean
  isDiscussion: boolean
  setIsDiscussion: (status: boolean) => void
}

const initialState: ChatContextArgs = {
  conversations: [],
  setConversations: () => {},
  currentConversation: null,
  onChangeConversation: () => {},
  joinConversation: () => {},
  sendMessage: () => {},
  currentMessages: [],
  isLoadMessage: false,
  isDiscussion: false,
  setIsDiscussion: () => {},
}

const ChatContext = createContext(initialState)
export const ChatProvider = ChatContext.Provider

export const useChat = () => useContext(ChatContext)
