import { useAuth } from '@/contexts/auth-context'
import commentQuery from '@/graphql/queries/comment-query'
import { Comment, CommentInput, CommentSocketResponse } from '@/types/model'
import { useQuery } from '@apollo/client'
import { message } from 'antd'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import ShortUniqueId from 'short-unique-id'
import { Socket } from 'socket.io-client'

interface UseMessageProps {
  socket?: Socket
}

function useMessage({ socket }: UseMessageProps) {
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()
  const [commentValue, setCommentValue] = useState('')
  const { redirectToLogin, user } = useAuth()
  const [comments, setComments] = React.useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data, loading, error } = useQuery(commentQuery.getByStuffId(), {
    variables: {
      stuffId: router.query.stuffId,
    },
  })
  useEffect(() => {
    if (!loading) {
      setComments(data?.comments || [])
    }
  }, [data, loading])

  const updateComment = useCallback(
    (targetId: string, newComment: Comment) => {
      const _comments = [...comments]
      _comments.forEach((cmt) => {
        if (cmt.id === targetId) {
          cmt = { ...newComment }
        }
      })
      setComments(_.cloneDeep(_comments))
    },
    [comments]
  )

  const addComment = useCallback(
    (newComment: Comment) => {
      const _comments = [...comments]
      let existComment = _comments.find((cmt: Comment) => cmt.id === newComment.id)

      if (!existComment) {
        _comments.push(newComment)
      } else {
        existComment = { ...newComment }
      }
      setComments(_.cloneDeep(_comments))
    },
    [comments]
  )

  React.useEffect(() => {
    if (!socket) return
    socket.connect()
    const stuffId = router.query.stuffId
    socket.emit('stuff:view', { stuff_id: stuffId })

    return () => {
      socket.disconnect()
    }
  }, [socket, router.query.stuffId])

  React.useEffect(() => {
    function createdCommentHandler(payload: CommentSocketResponse) {
      addComment(payload.comment)
    }

    function updateOwnComment(payload: CommentSocketResponse) {
      updateComment(payload.temp_id, payload.comment)
    }

    if (!socket) return
    socket.on('comment:created', createdCommentHandler)
    return () => {
      socket.off('comment:created', createdCommentHandler)
    }
  }, [socket, addComment, updateComment])

  const handleSubmitComment = () => {
    if (commentValue === '') {
      return messageApi.warning('Chưa nhập bình luận.')
    }

    try {
      if (!user || !user.uid) {
        messageApi.warning('Cần đăng nhập trước khi bình luận.')
        return redirectToLogin()
      }

      const generator = new ShortUniqueId()
      const newComment: CommentInput = {
        active: true,
        author_id: user.uid,
        stuff_id: router.query.stuffId as string,
        content: commentValue,
        id: generator.randomUUID(9),
      }

      addComment(newComment)
      setCommentValue('')
      if (!socket?.connected || !socket) {
        throw new Error('Lỗi kết nối. Không thể bình luận ngay lúc này. Vui lòng thử lại sau')
      }

      setIsLoading(true)

      socket.timeout(300).emit('comment:create', newComment, () => {
        setIsLoading(false)
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export default useMessage
