import { Menu, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import IsAuthenticated from '@/components/auth/is-authenticated';
import IsNot from '@/components/auth/is-not';
import { ROLES } from '@/components/context/auth-context-container';
import useLimit from '@/components/hooks/useLimit';
import { AppContext, useApp } from '@/contexts/app-context';
import { useAuth } from '@/contexts/auth-context';
import { resourceUrls } from '@/libs/resource-urls';
import cn from '@/libs/utils';
import { User } from '@/types/model';
import { Button, IconButton } from '@mui/joy';
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

function Header() {
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
    router.push(resourceUrls.login)
  }

  const navigateToHome = () => {
    router.push(resourceUrls.homepage)
  }

  if (isValidating && !user) return <HeaderSkeleton />

  return (
    <header className={cn('bg-white drop-shadow-sm')}>
      <div className="relative flex items-center justify-between max-w-full px-4 py-3 mx-auto max-md:py-2">
        <div className="flex items-center max-lg:gap-4 max-md:gap-3">
          <div className="items-center justify-center hidden max-lg:flex">
            <IconButton
              color="neutral"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={() => {
                setOpenMobileMenu(true)
              }}
              id="mb-menu"
              size={isMobile ? 'sm' : 'md'}
            >
              <Menu size={isMobile ? 25 : 30} />
            </IconButton>
            <MenuDrawer
              open={openMobileMenu}
              onClose={() => setOpenMobileMenu(false)}
              menuItems={menuItems}
            />
          </div>
          <Link href="/">
            <Logo className="cursor-pointer" />
          </Link>
        </div>
        <div className="flex-1">
          <ul className="absolute flex items-center p-1 ml-2 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-slate-100 max-lg:hidden w-fit">
            {menuItems.map((item, index) => (
              <Link
                key={item.id}
                id="menu-link"
                href={item.slug}
              >
                <li
                  id="menu-item"
                  className={cn(
                    'text-center text-slate-700 min-w-[120px] py-2 px-4 rounded-full text-sm cursor-pointer',
                    {
                      'bg-white font-semibold': active === item.id,
                    }
                  )}
                  onClick={() => setActive(item.id)}
                >
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>
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
            <IsNot roles={[ROLES.MODERATOR]}>
              <Button
                variant="solid"
                size="md"
                color="info"
                className="max-md:hidden"
                startDecorator={<Plus />}
                onClick={() => onOpen()}
              >
                Đăng tin
              </Button>
            </IsNot>
            <IconButton
              variant="solid"
              size="md"
              className="!hidden max-md:flex"
              color="info"
              onClick={() => onOpen()}
            >
              <Plus />
            </IconButton>
            <ChatButton />
            <NotificationButton />
            <AvatarMenu user={user as User} />
          </IsAuthenticated>
        </div>
      </div>
    </header>
  )
}

export default Header
