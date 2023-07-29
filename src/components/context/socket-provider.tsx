import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { useApp } from '@/contexts/app-context';
import { useAuth } from '@/contexts/auth-context';
import { SocketContext } from '@/contexts/socket-context';
import socket from '@/libs/socket-io';
import { generateUUID } from '@/libs/utils';
import { Notification, Role } from '@/types/model';
import { WithChildren } from '@/types/WithChildren';

export const SocketProvider = ({ children }: WithChildren) => {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(socket.connected)
  const { notify, chatDrawer, pushNotification } = useApp()
  const { user, isValidating, signOut } = useAuth()

  React.useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    const handlePayload = (payload: any) => {
      console.log({ payload })
    }

    function onWinAuction() {}

    // Connect to the Socket.IO server
    const uuidGenerator = generateUUID()
    try {
      if (isValidating) return
      if (user && user.uid) {
        socket.auth = {
          uid: user.uid,
          roleId: user.role,
        }
      } else {
        socket.auth = {
          uid: 'anonymous-' + uuidGenerator,
        }
      }

      socket.connect()

      socket.on('connect_error', () => {
        setTimeout(() => {
          socket.auth = {
            uid: user?.uid,
          }
          socket.connect()
        }, 1000)
      })

      socket.on('connect', onConnect)
      socket.on('user:active', (payload) => console.log({ payload }))
      socket.on('auction:has-win', onWinAuction)
      socket.on('disconnect', onDisconnect)
    } catch (error) {
      notify({
        type: 'error',
        title: 'Lỗi kết nối',
        description: 'Vui lòng kiểm tra kết nối và thử lại.',
      })
    }

    return () => {
      // socket.disconnect()
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('user:active', (payload) => console.log({ payload }))
      socket.off('test', handlePayload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isValidating])

  React.useEffect(() => {
    if (!socket) return
    const handleReceiveNotification = (payload: Notification) => {
      pushNotification(payload)
      if (chatDrawer && payload.type_slug === 'noti-message') return

      notify({
        type: 'info',
        title: 'Thông báo mới',
        description: payload?.content,
        duration: 5000,
        onClick: () => router.push(payload.target_url),
      })
    }

    const handleReceiveUpdateStatus = (payload: any) => {
      alert(payload?.message)
      setTimeout(() => {
        signOut()
      }, 100)
    }

    socket.on('notifications:new', handleReceiveNotification)
    socket.on('user:update-status', handleReceiveUpdateStatus)

    return () => {
      socket.off('notifications:new', handleReceiveNotification)
      socket.off('user:update-status', handleReceiveUpdateStatus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, chatDrawer])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
      {/* <Confetti>
        <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
          <h3>Chúc mừng bạn đã trở thành người chiến thắng tại buổi đấu giá vật phẩm</h3>{' '}
        </div>
      </Confetti> */}
    </SocketContext.Provider>
  )
}

export default SocketContext
