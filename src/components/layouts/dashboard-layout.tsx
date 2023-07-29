import { isAdminOrModerator, ROLES } from '../context/auth-context-container'
import CenterContainer from '../ui/common/center-container'
import DashboardHeader from '../ui/common/dashboard-header'
import Header from '../ui/common/header'
import NavTabs from '../ui/dashboard/nav-tabs'
import ChatDrawer from '../ui/drawer/chat-drawer'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import { resourceUrls } from '@/libs/resource-urls'
import cn from '@/libs/utils'
import NotFoundPage from '@/pages/404'
import { inter } from '@/pages/_app'
import { WithChildren } from '@/types/WithChildren'
import { Button, CircularProgress } from '@mui/joy'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'

function DashboardLayout({ children }: WithChildren) {
  const {
    addingModal,
    onClose,
    contextHolder,
    chatDrawer,
    onCloseChatDrawer,
    notificationContextHolder,
  } = useApp()
  const { user, isValidating } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isValidating) setIsLoading(false)
  }, [isValidating, router, user])

  if (isLoading)
    return (
      <CenterContainer>
        <CircularProgress color="primary" />
      </CenterContainer>
    )
  if ((!isValidating && user && !isAdminOrModerator(user.role)) || !user) return <NotFoundPage />
  const inDetailPage = router.pathname.includes('[') && router.pathname.includes(']')
  return (
    <>
      <DashboardHeader />
      <main className={cn(inter.className, 'bg-white w-full container min-h-[100%-72px] pb-10"')}>
        {!inDetailPage ? (
          <NavTabs />
        ) : (
          <div className="w-full py-4">
            <Button
              href="/dashboard/deposit-requests"
              color="neutral"
              variant="soft"
              onClick={() => router.back()}
            >
              <ChevronLeft /> Trở lại
            </Button>
          </div>
        )}
        <div className="pb-10">{children}</div>
        <ChatDrawer
          open={chatDrawer}
          onClose={onCloseChatDrawer}
        />
        {/* <AddingModal
            onClose={onClose}
            open={addingModal}
          /> */}
      </main>
      {contextHolder}
      {notificationContextHolder}
    </>
  )
}

export function getDashboardLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default DashboardLayout
