import { ConfigProvider, Tabs, TabsProps } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import colors from 'tailwindcss/colors';

import { ROLES } from '@/components/context/auth-context-container';
import { useAuth } from '@/contexts/auth-context';
import { inter } from '@/pages/_app';

const moderatorMenuItems: TabsProps['items'] = [
  {
    key: 'deposit-requests',
    label: `Yêu cầu kí gửi`,
  },
  {
    key: 'auction-requests',
    label: `Yêu cầu đấu giá`,
  },
  {
    key: 'stuff-inventory',
    label: `Kho đồ`,
  },
  {
    key: 'stuff-issues',
    label: `Yêu cầu sửa đổi`,
  },
]

const adminMenuItems: TabsProps['items'] = [
  {
    key: 'dashboard',
    label: `Bảng điều khiển`,
  },
  {
    key: 'users',
    label: `Người dùng`,
  },

  {
    key: 'stuff-inventory',
    label: `Kho đồ`,
  },
  {
    key: 'stuff-issues',
    label: `Yêu cầu sửa đổi`,
  },
]

const NavTabs = () => {
  const router = useRouter()
  const [activeKey, setActiveKey] = useState('active')
  const { user } = useAuth()

  useEffect(() => {
    const currentPath = router.asPath.replace('/dashboard/', '')
    if (currentPath.trim() === '/dashboard') return setActiveKey('dashboard')
    setActiveKey(currentPath)
  }, [router])

  const onChange = (key: string) => {
    if (key !== 'dashboard') return router.push('/dashboard/' + key)
    router.push('/dashboard')
    setActiveKey(activeKey)
  }

  if (user?.role === ROLES.MEMBER) return <></>

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.zinc[900],
        },
      }}
    >
      <Tabs
        className={inter.className}
        activeKey={activeKey}
        items={user?.role === ROLES.ADMIN ? adminMenuItems : moderatorMenuItems}
        onChange={onChange}
      />
    </ConfigProvider>
  )
}

export default NavTabs
