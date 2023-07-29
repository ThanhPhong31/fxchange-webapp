import { Comment, CommentSocketResponse } from '@/types/model'
import _ from 'lodash'
import React from 'react'
import { Socket } from 'socket.io-client'

type UseCommentHookArgs = {
  socket?: Socket | null
  initialComments?: Comment[]
}
export default function useComment({ socket, initialComments = [] }: UseCommentHookArgs) {
  const [comments, setComments] = React.useState(initialComments)
  const isEventListenerRegistered = React.useRef(false)

  React.useEffect(() => {
    if (socket && !isEventListenerRegistered.current) {
      socket.on('comment:created', (payload: CommentSocketResponse) => {
        const existComment = comments.find(
          (cmt) => cmt.id === payload.temp_id || cmt.id === payload.comment.id
        )
        if (!existComment) {
          return addComment({ ...payload.comment, active: true })
        }

        comments.forEach((cmt) => {
          if (cmt.id === payload.temp_id) {
            cmt.active = true
            cmt.author_id = payload.comment.author_id
            cmt.children = payload.comment.children
            cmt.content = payload.comment.content
            cmt.create_at = payload.comment.create_at
            cmt.update_at = payload.comment.update_at
            cmt.stuff_id = payload.comment.stuff_id
            cmt.author = payload.comment.author
            cmt.id = payload.comment.id
          }
        })
        setComments(_.cloneDeep(comments))
        isEventListenerRegistered.current = true
      })
    }
  }, [comments, socket])

  function addComment(newComment: Comment) {
    setComments((prevComments) => {
      prevComments.push(newComment)
      return _.cloneDeep(prevComments)
    })
  }

  function clearComments() {
    setComments([])
  }

  function reSubscribeSocket() {
    // isEventListenerRegistered.current = false
  }

  function removeComment(commentId: string) {
    setComments([...comments.filter((cmt) => cmt.id != commentId)])
  }

  return { comments, addComment, clearComments, reSubscribeSocket, removeComment }
}
