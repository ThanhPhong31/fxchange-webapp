import { Drawer } from 'antd';
import { Menu, MessageCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import IsAuthenticated from '@/components/auth/is-authenticated';
import useLimit from '@/components/hooks/useLimit';
import { AppContext, useApp } from '@/contexts/app-context';
import { useAuth } from '@/contexts/auth-context';
import { resourceUrls } from '@/libs/resource-urls';
import cn from '@/libs/utils';
import { inter } from '@/pages/_app';
import { User } from '@/types/model';
import { Button, IconButton, Menu as JoyMenu, MenuItem } from '@mui/joy';
import { useMediaQuery } from '@mui/material';

import ChatButton from '../../chat/chat-button';
import MenuDrawer from '../../drawer/menu-drawer';
import NotificationButton from '../../notification/notification-button';
import HeaderSkeleton from '../../skeleton/header-skeleton';
import AvatarMenu from '../avatar-menu';
import Logo from '../logo';

export type MenuItem = {
  id: number
  title: string
  slug: string
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: 'Trang chủ',
    slug: resourceUrls.homepage,
  },
  {
    id: 2,
    title: 'Trao đổi',
    slug: resourceUrls.exchange,
  },
  {
    id: 3,
    title: 'Mua bán',
    slug: resourceUrls.market,
  },
  {
    id: 4,
    title: 'Đấu giá',
    slug: resourceUrls.auction,
  },
]

function DashboardHeader() {
  const router = useRouter()
  const { onOpenChatDrawer } = useApp()
  const { user, isValidating } = useAuth()
  const isLimitRender = useLimit('abc')
  const { onOpen } = React.useContext(AppContext)
  const [active, setActive] = React.useState<number>(1)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const isMobile = useMediaQuery('max-width:768px')
  const [openMobileMenu, setOpenMobileMenu] = useState(false)

  useEffect(() => {
    const menuItem = menuItems.find((item) => item.slug === router.asPath)
    if (!menuItem) return setActive(1)
    setActive(menuItem?.id)
  }, [router])

  if (isLimitRender) return null

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (slug?: string) => {
    setAnchorEl(null)
    // if (slug) router.push(slug)
  }

  const navigateToLogin = () => {
    router.push(resourceUrls.dashboard.login)
  }

  const navigateToHome = () => {
    router.push(resourceUrls.dashboard.base)
  }

  if (isValidating && !user) return <HeaderSkeleton />

  return (
    <header className={cn('bg-white drop-shadow-sm', inter.className)}>
      <div className="relative flex items-center justify-between max-w-full px-4 py-3 max-md:py-2">
        <div className="flex items-center max-lg:gap-4 max-md:gap-0">
          <Link href="/dashboard">
            <Logo className="cursor-pointer" />
          </Link>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <IsAuthenticated
            alternativeComponent={
              <Button
                variant="solid"
                onClick={navigateToLogin}
              >
                Đăng nhập
              </Button>
            }
          >
            <ChatButton />
            <NotificationButton />
            <AvatarMenu user={user as User} />
          </IsAuthenticated>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
