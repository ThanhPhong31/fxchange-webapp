import { Notification, Type } from '@/types/model'
import { MessageInstance } from 'antd/es/message/interface'
import { IconType, NotificationInstance } from 'antd/es/notification/interface'
import { createContext, useContext } from 'react'

export type NotifyArgs = {
  type: IconType
  title: string
  description?: string
  duration?: number
  onClick?: () => void
}

export type AppContextType = {
  toast?: ToastState
  addingModal: boolean
  chatDrawer: boolean
  onOpenChatDrawer: (channel_id?: string) => void
  onCloseChatDrawer: () => void
  onOpen: (type?: Type) => void
  onClose: () => void
  toastIt: (toast: ToastState) => void
  contextHolder: React.ReactElement<any> | null
  messageApi: MessageInstance | null
  notificationApi: NotificationInstance | null
  notificationContextHolder: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  > | null

  notifySuccess: (title: string, description?: string) => void
  notifyError: (title: string, description?: string) => void
  notify: (args: NotifyArgs) => void
  notifications: Notification[]
  pushNotification: (notification: Notification) => void
  getNotifications: () => void
  totalUnreadNotification: number
  setAnchorElNotification: (anchor: HTMLButtonElement | null) => void
  anchorElNotification: HTMLButtonElement | null
  refetchUnreadTotal: () => void
  totalUnreadMessageNotifications: number
  [key: string]: any
}

export type ToastState = {
  title?: string
  description?: string
  Action?: React.ReactNode
}

const appContextDefaultValue: AppContextType = {
  addingModal: false,
  chatDrawer: false,
  onOpenChatDrawer: () => {},
  onCloseChatDrawer: () => {},
  onOpen: () => {},
  onClose: () => {},
  contextHolder: null,
  messageApi: null,
  notificationApi: null,
  notificationContextHolder: null,
  toastIt: () => {},
  notifySuccess: () => {},
  notifyError: () => {},
  notify: () => {},
  notifications: [],
  getNotifications: () => {},
  pushNotification: () => {},
  totalUnreadNotification: 0,
  setAnchorElNotification: () => {},
  anchorElNotification: null,
  refetchUnreadTotal: () => {},
  totalUnreadMessageNotifications: 0,
}

export const AppContext = createContext(appContextDefaultValue)
export const AppProvider = AppContext.Provider

export const useApp = () => {
  return useContext(AppContext)
}
