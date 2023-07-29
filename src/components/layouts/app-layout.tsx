import BottomNavigation from '../ui/common/bottom-navigation'
import Header from '../ui/common/header'
import ChatDrawer from '../ui/drawer/chat-drawer'
import AddingModal from '../ui/modal/adding-modal'
import { useApp } from '@/contexts/app-context'
import cn from '@/libs/utils'
import { inter } from '@/pages/_app'
import { WithChildren } from '@/types/WithChildren'
import Link from 'next/link'
import type { ReactElement } from 'react'

function AppLayout({ children }: WithChildren) {
  const {
    addingModal,
    onClose,
    contextHolder,
    chatDrawer,
    onCloseChatDrawer,
    notificationContextHolder,
  } = useApp()

  return (
    <>
      <Header />
      {/* <main className={cn(inter.className, 'bg-white py-8 max-md:py-4 min-h-[calc(100vh-72px)] ')}> */}
      <main className={cn('bg-white py-8 max-md:py-4 min-h-[calc(100vh-72px)] ')}>
        {contextHolder}
        {notificationContextHolder}
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
      <footer className="py-6 font-medium text-gray-500 bg-gray-100">
        <div className="container flex items-center justify-between">
          <div>&copy; 2023 FXchange Team.</div>
          <div className="flex items-center gap-3">
            <Link href="/about-us">Về chúng tôi</Link>
            <Link href="/policies">Chính sách</Link>
          </div>
        </div>
      </footer>
      <div className="hidden max-md:block">
        <BottomNavigation />
      </div>
    </>
  )
}

export function getAppLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>
}

export default AppLayout
