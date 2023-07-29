import Header from '../ui/common/header'
import ChatDrawer from '../ui/drawer/chat-drawer'
import AddingModal from '../ui/modal/adding-modal'
import { useApp } from '@/contexts/app-context'
import cn from '@/libs/utils'
import { inter } from '@/pages/_app'
import { WithChildren } from '@/types/WithChildren'
import { message } from 'antd'
import type { ReactElement } from 'react'

function ManageStuffLayout({ children }: WithChildren) {
  const { addingModal, onClose, contextHolder, chatDrawer, onCloseChatDrawer } = useApp()

  return (
    <>
      <Header />
      <main className={cn(inter.className, 'bg-gray-50 py-8 min-h-[calc(100vh-72px)]')}>
        {contextHolder}
        <div className="container">{children}</div>
        <ChatDrawer
          open={chatDrawer}
          onClose={onCloseChatDrawer}
        />
        <AddingModal
          onClose={onClose}
          open={addingModal}
        />
      </main>
    </>
  )
}

export function getManageStuffLayout(page: ReactElement) {
  return <ManageStuffLayout>{page}</ManageStuffLayout>
}

export default ManageStuffLayout
