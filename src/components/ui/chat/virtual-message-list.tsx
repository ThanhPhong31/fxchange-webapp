import FxMessage from './message'
import cn from '@/libs/utils'
import { Message } from '@/types/model'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

interface VirtualMessageListProps {
  messages: Message[]
  hasPin?: boolean
  loading?: boolean
}

const VirtualMessageList = (props: VirtualMessageListProps) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: props.messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  })
  const [height, setHeight] = useState(100)
  // const items = virtualizer.getVirtualItems()
  // const virtualizerRef = useRef<ReturnType<typeof useVirtualizer>>(null)

  useEffect(() => {
    const calculateChatHeight = () => {
      const drawerHeader = document.querySelector('.ant-drawer-header')
      const chatHeader = document.querySelector('.fx-chat-header')
      const chatInput = document.querySelector('.fx-chat-input')
      const chatPin = document.querySelector('.fx-chat-pin')
      const drawerHeaderHeight = drawerHeader?.clientHeight || 0
      const chatHeaderHeight = chatHeader?.clientHeight || 0
      const chatInputHeight = chatInput?.clientHeight || 0
      const chatPinHeight = chatPin?.clientHeight || 0
      setHeight(drawerHeaderHeight + chatHeaderHeight + chatInputHeight + chatPinHeight)
    }
    calculateChatHeight()
    window.addEventListener('resize', calculateChatHeight)
    return () => {
      window.removeEventListener('resize', calculateChatHeight)
    }
  }, [props.messages])

  return (
    <>
      <div
        style={{
          height: document.body.clientHeight - height - 3,
        }}
      >
        <ScrollToBottom
          className={cn('relative w-full pt-3 overflow-y-auto px-3 h-[calc(100%)]')}
          followButtonClassName="hidden"
          // ref={parentRef}
          // style={{
          //   height: document.body.clientHeight - height - 3,
          // }}
        >
          {/* <div
              className={cn('relative w-full overflow-y-auto px-3')}
              style={{
                height: virtualizer.getTotalSize(),
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${items[0].start}px)`,
                }}
              > */}
          {props.messages.map((item) => {
            // const message = props.messages[item.index]
            return (
              <FxMessage
                // data-index={iteme}
                key={item.external_id}
                message={item}
              />
            )
          })}
          {/* </div>
            </div> */}
        </ScrollToBottom>
      </div>
      {/* <For
              each={items}
              ssr={false}
            >
              {(item) => <FxMessage message={props.messages[item.index]} />}
            </For> */}
    </>
  )
}

export default VirtualMessageList
