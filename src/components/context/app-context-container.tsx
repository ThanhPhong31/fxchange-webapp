import InitialUser from '../ui/initial-user'
import UpdatePhoneModal from '../ui/modal/update-phone-modal'
import { ROLES } from './auth-context-container'
import { AppContextType, AppProvider, NotifyArgs, ToastState } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import notificationQuery from '@/graphql/queries/notification.query'
import { resourceUrls } from '@/libs/resource-urls'
import { WithChildren } from '@/types/WithChildren'
import { Notification, Type } from '@/types/model'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Phone } from '@mui/icons-material'
import { message, notification } from 'antd'
import { ArgsProps } from 'antd/es/message'
import { IconType } from 'antd/es/notification/interface'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const AppContextContainer = ({ children }: WithChildren) => {
  const [
    getNotifications,
    { data: notificationsData, loading, error, called, refetch: refetchNotifications },
  ] = useLazyQuery<{
    notifications: Notification[]
  }>(notificationQuery.getNotificationByUID())
  const [
    getUnreadTotal,
    {
      data: unreadData,
      loading: loadOnGetUnread,
      error: errorOnGetUnread,
      refetch: refetchUnreadTotal,
    },
  ] = useLazyQuery(notificationQuery.getUnreadNotification())

  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mustUpdatePhone, setMustUpdatePhone] = useState(false)
  const [addingModal, setAddingModal] = React.useState<boolean>(false)
  const [chatDrawer, setChatDrawer] = useState(false)
  const [toastMeta, setToastMeta] = React.useState<ToastState | undefined>(undefined)
  const [messageApi, contextHolder] = message.useMessage()
  const [notificationApi, notificationContextHolder] = notification.useNotification()
  const [anchorElNotification, setAnchorElNotification] = React.useState<HTMLButtonElement | null>(
    null
  )
  const { user, isValidating } = useAuth()
  const [needUpdateInfo, setNeedUpdateInfo] = useState(false)

  useEffect(() => {
    const handleUnload = (e: BeforeUnloadEvent) => {
      if (addingModal) {
        e.preventDefault()
        return 'Thông tin của món đồ nhập chưa được lưu. Bạn có chắc chắn muốn thoát?'
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [addingModal])

  useEffect(() => {
    if (notificationsData) {
      setNotifications([...notificationsData.notifications])
    }
  }, [anchorElNotification, notificationsData])

  useEffect(() => {
    if (user && user?.need_update) setNeedUpdateInfo(true)
  }, [user])

  useEffect(() => {
    if (user && !Boolean(user?.phone || user.phone?.trim() === '')) setMustUpdatePhone(true)
    if (router.query?.mode && router.query?.mode === 'add') {
      setAddingModal(true)
      setNeedUpdateInfo(false)
    }
  }, [user, router])

  useEffect(() => {
    if (user && !isValidating) {
      if (Boolean(anchorElNotification)) {
        if (notificationsData)
          refetchNotifications({
            variables: {
              includeOfMod: user.role === ROLES.ADMIN || user.role === ROLES.MODERATOR,
            },
          })
        else
          getNotifications({
            variables: {
              includeOfMod: user.role === ROLES.ADMIN || user.role === ROLES.MODERATOR,
            },
          })
      }

      if (unreadData) refetchUnreadTotal()
      else getUnreadTotal()
    }
  }, [
    anchorElNotification,
    getNotifications,
    getUnreadTotal,
    user,
    isValidating,
    unreadData,
    refetchUnreadTotal,
  ])

  const onOpen = (type: Type = 'default') => {
    if (!user)
      return router.push(resourceUrls.login, {
        query: {
          ...router.query,
          redirect_url: router.basePath,
        },
      })
    if (type)
      router.push({
        query: {
          ...router.query,
          stuff_type: type,
        },
      })
    setAddingModal(true)
  }

  const onClose = () => {
    setAddingModal(false)
    router.replace({
      query: {},
    })
  }

  const handleOpenChatDrawer = useCallback(
    (channel_id?: string) => {
      setChatDrawer(true)
      if (channel_id) {
        console.log({ channel_id })
        setTimeout(() => {
          router.replace({
            query: {
              conversation: channel_id,
              ...router.query,
            },
          })
        }, 300)
      }
    },
    [router]
  )

  const handleCloseChatDrawer = useCallback(() => {
    setChatDrawer(false)
  }, [])

  const notifySuccess = useCallback(
    (message: string, description?: string) => {
      notificationApi.success({
        message: message,
        description: description,
        duration: 3,
        placement: 'bottomLeft',
      })
    },
    [notificationApi]
  )

  const notifyError = useCallback(
    (message: string, description?: string) => {
      notificationApi.error({
        message: message,
        description: description,
        duration: 3,
        placement: 'bottomLeft',
      })
    },
    [notificationApi]
  )

  const notify = useCallback(
    ({ type, title, description, duration, onClick }: NotifyArgs) => {
      notificationApi.open({
        type: type,
        message: title,
        description: description,
        duration: duration === 0 ? duration : 3,
        placement: 'bottomLeft',
        onClick: onClick,
        style: {
          cursor: 'pointer',
        },
      })
    },
    [notificationApi]
  )

  const pushNotification = (noti: Notification) => {
    refetchUnreadTotal()
    if (!notificationsData?.notifications) return
    setNotifications((prevNotifications) => {
      prevNotifications.unshift(noti)
      return prevNotifications
    })
  }

  const appState: AppContextType = {
    toast: toastMeta,
    addingModal: addingModal,
    onOpen: onOpen,
    onClose: onClose,
    toastIt: setToastMeta,
    setToast: setToastMeta,
    chatDrawer: chatDrawer,
    onOpenChatDrawer: handleOpenChatDrawer,
    onCloseChatDrawer: handleCloseChatDrawer,
    contextHolder: contextHolder,
    messageApi: messageApi,
    notificationContextHolder: notificationContextHolder,
    notificationApi: notificationApi,
    notifySuccess: notifySuccess,
    notifyError: notifyError,
    notify: notify,
    notifications: notifications,
    pushNotification: pushNotification,
    getNotifications: getNotifications,
    totalUnreadNotification: unreadData?.data?.total || 0,
    refetchUnreadTotal: refetchUnreadTotal,
    anchorElNotification: anchorElNotification,
    setAnchorElNotification: setAnchorElNotification,
    totalUnreadMessageNotifications: unreadData?.data?.messages || 0,
  }

  return (
    <AppProvider value={appState}>
      {mustUpdatePhone && !needUpdateInfo && (
        <UpdatePhoneModal
          open
          onClose={() => setMustUpdatePhone(false)}
        />
      )}
      {children}
      {needUpdateInfo && <InitialUser />}
    </AppProvider>
  )
}

export default AppContextContainer
