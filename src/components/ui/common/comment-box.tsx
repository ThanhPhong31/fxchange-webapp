import UserAvatar from './user-avartar'
import { useAuth } from '@/contexts/auth-context'
import cn from '@/libs/utils'
import { Comment, User } from '@/types/model'
import { Avatar, CircularProgress } from '@mui/joy'
import React from 'react'

export interface CommentBoxProps {
  comments?: Comment[]
}

function CommentBox({ comments = [] }: CommentBoxProps) {
  const { user } = useAuth()
  const commentBoxRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (commentBoxRef.current) commentBoxRef.current.scrollTop = commentBoxRef.current?.scrollHeight
  }, [comments])

  const getNameAuthor = (cmt: Comment) => {
    return user?.uid === cmt.author_id && user?.full_name
      ? user.full_name
      : cmt.author?.information.full_name
  }

  const getAvatarAuthor = (cmt: Comment) => {
    return user?.uid === cmt.author_id && user?.avatar_url
      ? user.avatar_url
      : cmt?.author?.information?.avatar_url
  }

  return (
    <div
      className="p-4 bg-white h-[560px] overflow-auto"
      ref={commentBoxRef}
    >
      {comments.map((cmt, index) => (
        <div
          key={cmt.id}
          className="flex flex-col mb-3"
        >
          <div className="flex items-start w-full mb-2">
            <UserAvatar
              className="mr-3"
              src={getAvatarAuthor(cmt)}
            />
            <div className="w-full">
              <p>{getNameAuthor(cmt)}</p>
              <div
                className={cn('px-3 py-4 rounded-md bg-slate-100 text-slate-900', {
                  // 'bg-slate-50 text-slate-400 flex flex-col gap-2': !cmt.active,
                })}
              >
                {cmt.content}
              </div>
              <button
                className={cn('text-sm text-slate-500', {
                  // 'bg-slate-50 cursor-not-allowed text-slate-300 ': !cmt.active,
                })}
              >
                Trả lời
              </button>
            </div>
            {/* {!cmt.active && (
              <CircularProgress
                className="self-center ml-2"
                size="sm"
                color="neutral"
                thickness={2}
              />
            )} */}
          </div>
          <div className="block ml-6">
            {cmt.children?.map((childComment) => (
              <div
                className="flex items-start mb-3"
                key={cmt.id + '.' + childComment.id}
              >
                <Avatar
                  size="lg"
                  className="mr-3"
                  src="https://source.unsplash.com/random"
                />
                <div className="w-full">
                  <div className="px-3 py-4 rounded-md bg-slate-100 text-slate-900">
                    {childComment.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default React.memo(CommentBox)
