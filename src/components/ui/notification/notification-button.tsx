import CenterContainer from '../common/center-container'
import NotificationCard from './notification-card'
import VirtualNotificationList from './virtual-notification-list'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import notificationQuery from '@/graphql/queries/notification.query'
import { Notification } from '@/types/model'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { CircularProgress, IconButton } from '@mui/joy'
import { Badge, Popover } from 'antd'
import { Bell, Settings } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

//show notification button
function NotificationButton() {
  const [markRead, { data, loading }] = useMutation(notificationQuery.markReadNotification())
  const {
    notifications,
    totalUnreadNotification,
    anchorElNotification,
    setAnchorElNotification,
    refetchUnreadTotal,
  } = useApp()

  const open = Boolean(anchorElNotification)

  useEffect(() => {
    if (data) {
      refetchUnreadTotal()
    }
  }, [data])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElNotification(event.currentTarget)
  }

  const handleClose = () => {
    console.log('handleClose')
    setAnchorElNotification(null)
  }

  const onMarkRead = (id: string) => {
    markRead({
      variables: { id: id },
    })
  }

  const id = open ? 'simple-popover' : undefined

  const content = (
    <div className="">
      {/* {loading && (
        <CenterContainer>
          <CircularProgress color="primary" />
        </CenterContainer>
      )} */}
      <VirtualNotificationList
        notifications={notifications}
        onClickItem={handleClose}
        onMarkRead={onMarkRead}
      />
      {/* {notifications.length > 0 && (
        <>
          {notifications.map((noti) => (
            <NotificationCard
              key={noti.id}
              id={noti.id}
              isRead={noti.is_read != undefined ? noti.is_read : true}
              content={noti.content}
              url={noti.target_url}
              createdAt={noti.create_at}
              onRead={onMarkRead}
              onClick={handleClose}
            />
          ))}
        </>
      )} */}
    </div>
  )

  const title = (
    <div className="flex items-center justify-between px-3 pt-3">
      <h3 className="text-lg">Thông báo</h3>
      <IconButton
        size="sm"
        color="neutral"
        variant="plain"
      >
        <Settings size={15} />
      </IconButton>
    </div>
  )

  return (
    <>
      <Popover
        overlayInnerStyle={{
          padding: 0,
        }}
        className="max-md:hidden"
        placement="bottomRight"
        trigger="click"
        content={content}
        title={title}
      >
        <Badge
          dot={totalUnreadNotification > 0}
          color="blue"
        >
          <IconButton
            aria-describedby={id}
            variant="plain"
            color="neutral"
            className="max-md:hidden"
            onClick={handleClick}
          >
            <Bell />
          </IconButton>
        </Badge>
      </Popover>
    </>
  )
}

export default NotificationButton
