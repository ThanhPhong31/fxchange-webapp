import { NextPageWithLayout } from '../_app'
import UpdateInfoForm from '@/components/ui/form/update-info'
import { useAuth } from '@/contexts/auth-context'
import { ConfigProvider, Tabs, TabsProps } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import colors from 'tailwindcss/colors'

const MyInfo: NextPageWithLayout = () => {
  const router = useRouter()
  const { user } = useAuth()

  const items: TabsProps['items'] = [
    {
      key: 'info',
      label: `Hồ sơ cá nhân`,
      children: <UpdateInfoForm user={user} />,
    },
  ]

  const onChangeTab = (key: string) => {
    router.push({
      hash: key,
    })
  }
//information form
  return (
    <div>
      <h3 className="text-3xl max-md:text-xl">Tài khoản của tôi</h3>
      <div className="my-4">
        <hr />
      </div>
      <div className="px-8">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: colors.zinc[900],
            },
          }}
        >
          <Tabs
            className="pt-2 w-10/12"
            tabPosition={'left'}
            size="large"
            defaultActiveKey="1"
            items={items}
            onChange={onChangeTab}
          />
        </ConfigProvider>
      </div>
    </div>
  )
}

export default MyInfo
