import cn from '@/libs/utils'
import { WithClassName } from '@/types/common'
import { ColorPaletteProp, IconButton, Input, Textarea } from '@mui/joy'
import { message } from 'antd'
import { Send } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface ChatInputProps extends WithClassName {
  onSubmit?: (value: string) => void
  placeholder?: string
  color?: ColorPaletteProp
}

const defaultPlaceholder = 'Nhập bình luận...'

function ChatInput({
  className,
  onSubmit,
  placeholder = defaultPlaceholder,
  color = 'neutral',
}: ChatInputProps) {
  const [messageApi, contextHolder] = message.useMessage()
  const [content, setContent] = useState('')
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      const inputDom = inputRef.current?.querySelector('textarea')
      inputDom?.focus()
    }
  }, [])

  const handleSubmit = () => {
    const inputDom = inputRef.current?.querySelector('textarea')

    if (!inputDom) return console.error('Input element is not available')
    const value = inputDom.value
    if (value.trim() === '') return
    if (value.trim().length > 400) {
      return messageApi.open({
        key: 'message-key',
        content: 'Tin nhắn quá dài',
      })
    }

    inputDom.value = ''
    inputDom.focus()
    if (!onSubmit) return console.error('onSubmit element is not available')
    onSubmit(value)
  }

  const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // e.preventDefault()
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={cn('fx-chat-input flex items-center p-4', className)}>
      {contextHolder}
      <Textarea
        ref={inputRef}
        color={color}
        className={cn('flex-1 mr-2')}
        placeholder={placeholder}
        onKeyDown={handlePressEnter}
      />
      <IconButton
        onClick={handleSubmit}
        variant="soft"
        color="neutral"
      >
        <Send />
      </IconButton>
    </div>
  )
}

export default ChatInput
