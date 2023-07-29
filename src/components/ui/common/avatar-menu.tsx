import UserAvatar from './user-avartar'
import { isAdminOrModerator, ROLES } from '@/components/context/auth-context-container'
import { useAuth } from '@/contexts/auth-context'
import { User } from '@/types/model'
import { Button, Divider, Menu, MenuItem } from '@mui/joy'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

type AvatarMenuProps = {
  user: User
}

function AvatarMenu({ user }: AvatarMenuProps) {
  const { signOut } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const avatarDropdownMenuItems = [
    {
      label: 'Tài khoản của tôi',
      action: () => {
        router.push('/my-info')
      },
    },
    {
      label: 'Ví FP',
      action: () => {
        router.push('/points-history')
      },
    },
    {
      label: 'Tủ đồ',
      action: () => {
        router.push('/my-stuffs')
      },
    },
    {
      label: 'Lịch sử giao dịch',
      action: () => {
        router.push('/transactions')
      },
    },
    {
      label: 'Đánh giá',
      action: () => {
        router.push('/feedback')
      },
    },
    {
      label: 'Đăng xuất',
      action: signOut,
    },
  ]

  const privateDropdownMenuItems = [
    {
      label: 'Bảng điều khiển',
      action: () => {
        router.push('/dashboard')
      },
    },
  ]

  if (isAdminOrModerator(user.role)) {
    avatarDropdownMenuItems.unshift(...privateDropdownMenuItems)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  // console.log(user)
  return (
    <div className="flex flex-shrink-0 ">
      <button
        className="flex items-center h-10 px-1 py-2 pr-3 border rounded-full max-md:pr-2 max-md:py-1 border-slate-200 text-slate-700 bg-slate-100 hover:bg-slate-200"
        onClick={handleClick}
      >
        <UserAvatar
          size="md"
          width={32}
          src={user.avatar_url || undefined}
          aria-controls={open ? 'dropdown-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        />
        <Divider
          className="!mx-1 max-md:!mx-[3px]"
          orientation="vertical"
        />
        <div className="space-x-1 font-sans text-sm max-md:text-xs font-semibold">
          <span className="font-bold">
            {user.point.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || 0}
          </span>
          <span className="max-md:text-xs">FPoints</span>
        </div>
      </button>
      {user && (
        <Menu
          id="dropdown-menu"
          sx={{
            width: 250,
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          aria-labelledby="dropdown-menu"
          placement="bottom-end"
          autoFocus={false}
          color="neutral"
        >
          <div className="px-3 py-2 ">
            <h4 className="font-sans text-base font-semibold">{user.full_name}</h4>
            <p className="font-sans text-slate-500">
              Biệt hiệu: {user.auction_nickname || 'Chưa có'}
            </p>
          </div>
          <Divider />
          {avatarDropdownMenuItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                item.action()
                handleClose()
              }}
            >
              <span className="font-sans">{item.label}</span>
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  )
}

export default AvatarMenu
