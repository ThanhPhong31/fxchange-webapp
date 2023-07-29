import StartExchangeModal from '../../modal/start-exchange-modal'
import SuggestedStuffList from '../suggested-stuff-list'
import { useApp } from '@/contexts/app-context'
import { useChat } from '@/contexts/chat-context'
import stuffQuery from '@/graphql/queries/stuff-query'
import { SuggestedStuffListGraphQLResponse } from '@/types/common'
import { Stuff, SuggestedStuff } from '@/types/model'
import { useLazyQuery } from '@apollo/client'
import { Modal, Spin } from 'antd'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  stuffId: string
  isOwner?: boolean
  stuffs: SuggestedStuff[]
  loading?: boolean
}

const SuggestExchangeStuffs = ({ stuffId, isOwner, stuffs, loading }: Props) => {
  const waitTime = 10
  const [modal, contextHolder] = Modal.useModal()
  const { onOpenChatDrawer, notify } = useApp()
  const { joinConversation } = useChat()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedStuff, setSelectedStuff] = useState<SuggestedStuff | null>(null)
  const startExchange = useCallback(
    (stuff: SuggestedStuff) => {
      const _selectedStuff = selectedStuff || stuff
      if (!_selectedStuff && !stuff)
        return notify({ type: 'error', title: 'Không thể bắt đầu trao đổi' })
      onOpenChatDrawer()
      joinConversation(
        _selectedStuff.suggest_stuff.author.id,
        'INTRANSACTION',
        _selectedStuff.target_stuff_id,
        _selectedStuff.suggest_stuff.id
      )
      setShowSuccessModal(false)
    },
    [joinConversation, notify, onOpenChatDrawer, selectedStuff]
  )

  const countDown = (stuff: SuggestedStuff) => {
    let isStart = false
    let secondsToGo = 5
    let timer: NodeJS.Timer | null = null
    const instance = modal.success({
      title: 'Bắt đầu trao đổi thành công',
      content: ` Cuộc trao đổi sẽ được bắt đầu sau ${secondsToGo} giây.`,
      okText: 'Bắt đầu ngay',
      onOk: () => {
        isStart = true
        if (timer) clearInterval(timer)
        startExchange(stuff)
        instance.destroy()
      },
    })

    timer = setInterval(() => {
      secondsToGo -= 1
      instance.update({
        content: ` Cuộc trao đổi sẽ được bắt đầu sau ${secondsToGo} giây.`,
      })
    }, 1000)

    setTimeout(() => {
      if (isStart) return
      if (timer) clearInterval(timer)
      startExchange(stuff)
      instance.destroy()
    }, secondsToGo * 1000)
  }

  const handleConfirmExchangeStuff = (stuff: SuggestedStuff) => {
    // TODO: handle confirm...
    // setShowSuccessModal(true)
    setSelectedStuff(stuff)
    countDown(stuff)
  }

  return (
    <div className="h-[700px] bg-white overflow-auto p-3">
      <Spin spinning={loading}>
        {stuffs && stuffs.length > 0 ? (
          <SuggestedStuffList
            isRecommendList={true}
            stuffs={stuffs || []}
            onConfirm={handleConfirmExchangeStuff}
            isOwner={isOwner}
          />
        ) : (
          <div className="flex items-center justify-center h-full">Chưa có đề xuất nào</div>
        )}
      </Spin>
      {/* {true && (
        <StartExchangeModal
          open={true}
          onClose={() => setShowSuccessModal(false)}
          onStart={startExchange}
          onConfirm={() => {}}
          waitTime={waitTime}
        />
      )} */}
      {contextHolder}
    </div>
  )
}

export default SuggestExchangeStuffs
