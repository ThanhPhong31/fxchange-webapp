import NotificationCard from './notification-card'
import { Notification } from '@/types/model'
import { useVirtualizer } from '@tanstack/react-virtual'
import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'

interface Props {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onClickItem: () => void
}

const VirtualNotificationList = ({ notifications, onClickItem, onMarkRead }: Props) => {
  const getItemSize = (index: number) => {
    const notification = notifications[index]
    const maxCharsPerLine = 35 // Adjust this value based on your font size and content width
    const maxLines = 3
    const lineHeight = 20 // Adjust this value based on your font size and line height
    const padding = 16
    const timeHeight = 16

    // Calculate the number of lines based on the content length and maxCharsPerLine
    const lineCount = Math.min(Math.ceil(notification.content.length / maxCharsPerLine), maxLines)

    return lineCount * lineHeight + padding + timeHeight
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <NotificationCard
        key={notifications[index].id}
        id={notifications[index].id}
        isRead={notifications[index].is_read != undefined ? notifications[index].is_read : true}
        content={notifications[index].content}
        url={notifications[index].target_url}
        createdAt={notifications[index].create_at}
        onRead={onMarkRead}
        onClick={onClickItem}
      />
    </div>
  )

  return (
    <div className="md:w-[350px] h-[500px] px-2 overflow-y-auto pb-4">
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <List
            // className="md:w-[350px] h-[500px] px-2 overflow-y-auto pb-4"
            height={height}
            width={width}
            itemCount={notifications.length}
            itemSize={getItemSize}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
      {/* {loading && (
        <CenterContainer>
          <CircularProgress color="primary" />
        </CenterContainer>
      )} */}
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
}

export default VirtualNotificationList
