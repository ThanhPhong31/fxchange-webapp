import UserAvatar from '../common/user-avartar'
import IsNotOwner from '@/components/auth/is-not-owner'
import IsOwner from '@/components/auth/is-owner'
import cn from '@/libs/utils'
import { WithClassName } from '@/types/common'
import { Conversation, Stuff } from '@/types/model'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { TransferWithinAStation } from '@mui/icons-material'
import { Button, Dropdown, MenuProps, Space } from 'antd'
import React from 'react'

interface ChatPinStuffProps extends WithClassName {
  isDiscussing: boolean
  stuff: Stuff
  exchangeStuff?: Stuff | null
  isOwner?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
  onDetach: () => void
}

const ChatPinStuff = ({
  stuff,
  exchangeStuff,
  className,
  isDiscussing,
  isOwner = false,
  isLoading,
  onConfirm,
  onCancel,
  onDetach,
}: ChatPinStuffProps) => {
  const items = [
    {
      label: 'Chốt giao dịch',
      key: 'confirm',
      icon: <UserOutlined />,
    },
    {
      label: 'Hủy giao dịch',
      key: 'cancel',
      icon: <UserOutlined />,
      danger: true,
    },
  ]

  const menuProps: MenuProps = {
    items,
    onClick: (e) => {
      const key = e.key
      switch (key) {
        case 'confirm': {
          onConfirm()
          break
        }
        case 'cancel': {
          onCancel()
          break
        }
      }
    },
  }

  return (
    <div
      className={cn(
        className,
        'fx-chat-pin flex items-center justify-between border-b px-3 bg-slate-100'
      )}
    >
      <div className="relative flex items-center">
        {stuff && (
          <div className="flex items-center justify-between flex-1 py-2">
            <div className="flex items-center gap-3">
              <UserAvatar src={stuff?.media && stuff?.media[0]} />
              <h4 className="text-base">{stuff.name}</h4>
            </div>
          </div>
        )}
        {exchangeStuff && (
          <div className="flex items-center justify-between flex-1 py-2">
            <div className="flex items-center gap-3">
              <UserAvatar src={exchangeStuff?.media && exchangeStuff?.media[0]} />
              <h4 className="text-base">{exchangeStuff.name}</h4>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <IsOwner authorId={stuff.author.id}>
          {!isDiscussing && (
            <Dropdown menu={menuProps}>
              <Button loading={isLoading}>
                <Space>
                  Hành động
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          )}
        </IsOwner>
        {!isDiscussing && (
          <IsNotOwner authorId={stuff.author.id}>
            <Button
              loading={isLoading}
              danger
              onClick={onCancel}
            >
              Dừng giao dịch
            </Button>
          </IsNotOwner>
        )}
        {isDiscussing && (
          <Button
            loading={isLoading}
            onClick={onDetach}
          >
            Gỡ
          </Button>
        )}
      </div>
    </div>
  )
}

export default ChatPinStuff
