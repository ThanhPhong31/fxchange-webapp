import { useApp } from '@/contexts/app-context'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const MessagesPage = () => {
  const router = useRouter()
  const { onOpenChatDrawer } = useApp()

  useEffect(() => {
    if (router.query.id) {
      onOpenChatDrawer(router.query.id as string)
      router.back()
    }
  }, [onOpenChatDrawer, router, router.query.id])

  return <div></div>
}

export default MessagesPage
