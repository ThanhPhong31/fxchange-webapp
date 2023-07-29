import ImageNotFound from '../common/image-not-found'
import RatingModal from '../modal/rating-modal'
import transactionQuery from '@/graphql/queries/transaction-query'
import { TransactionGraphQLResponse } from '@/types/common'
import { User } from '@/types/model'
import { ArrowRightOutlined, UserOutlined } from '@ant-design/icons'
import { useLazyQuery } from '@apollo/client'
import { Button } from '@mui/joy'
import { Avatar, Image, Rate } from 'antd'
import moment from 'moment'
import React, { Dispatch, SetStateAction, use, useEffect, useState } from 'react'

type Props = {
  completed: boolean
  feedback: FeedBack
  isFeedBacked?: boolean
  isOtherFeedback?: boolean
  user: User | null
  setIsChanged?: Dispatch<SetStateAction<boolean>>

}

type FeedBack = {
  id: string
  rating: number
  content: string
  transaction_id: string
  create_at: Date
  update_at: Date
}

type Transaction = {
  id: string
  customer: User | null
  author: {
    id: string
    information: {
      full_name: string
      phone: string
    }
  }
  stuff: {
    id: string
    name: string
    price: number
    media: string
    category: string
  }
  pickup_date: string
  status: string
}

function RatingItem({ completed, feedback, user, isOtherFeedback, isFeedBacked, setIsChanged }: Props) {
  const [hasStuffImages, setHasStuffImages] = useState<boolean>(false)
  const [openRatingModal, setOpenRatingModal] = useState<boolean>(false)
  const [
    getTransaction,
    { data: transactionData, loading: loadOnGetTransaction, error: errorOnGetTransaction },
  ] = useLazyQuery<TransactionGraphQLResponse>(transactionQuery.findByID())

  useEffect(() => {
    const transactionId = feedback.transaction_id
    if (transactionId)
      getTransaction({
        variables: {
          id: transactionId,
        },
      })
  }, [getTransaction, feedback.transaction_id])

  useEffect(() => {
    if (transactionData) {
      if (
        transactionData.transaction.stuff?.media &&
        transactionData.transaction.stuff?.media.length > 0
      )
        setHasStuffImages(true)
    }
  }, [transactionData])
  console.log(transactionData?.transaction)
  return (
    <>
      {isFeedBacked ? (
        <div className="border p-4 px-6 rounded-lg mx-10 my-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className='text-xs text-slate-500'>
                <span>Đăng bởi:</span>
              </div>
              <div className="ml-2">
                <Avatar
                  size="small"
                  src={
                    transactionData?.transaction.stuff.type.slug === 'exchange'
                      ? transactionData?.transaction.stuff_owner?.id === user?.uid
                        ? transactionData?.transaction.customer?.information.avatar_url
                        : transactionData?.transaction.stuff_owner?.information.avatar_url
                      : transactionData?.transaction.customer?.information.avatar_url
                  }
                />
                <span className="ml-2 text-gray-500 text-xs">
                  {transactionData?.transaction.stuff.type.slug === 'exchange'
                    ? transactionData?.transaction.stuff_owner?.id === user?.uid
                      ? transactionData?.transaction.customer?.information.full_name
                      : transactionData?.transaction.stuff_owner?.information.full_name
                    : transactionData?.transaction.customer?.information.full_name}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="">
              <span className="text-gray-500">
                {feedback.update_at
                  ? moment(feedback.update_at).format('YYYY-MM-DD HH:MM')
                  : moment(feedback.create_at).format('YYYY-MM-DD HH:MM')}
              </span>
            </div>
          </div>
          <div className="my-4">
            <hr />
          </div>
          <div className="mx-4">
            {/* Rating */}
            <div>
              <span className="text-gray-500">Đánh giá:</span>
              <Rate
                className="ml-2"
                value={feedback.rating}
                disabled={true}
              />
            </div>
            {/* FeedBack */}
            <div className="mt-2">
              <span className="text-gray-500 block">Chi tiết:</span>
              <p className="text-xs block ml-4 mt-1">{feedback.content}</p>
            </div>
          </div>
          <div className="flex mt-4">
            <div>
              {hasStuffImages ? (
                <Image
                  className="rounded-2xl border object-cover"
                  width={75}
                  height={75}
                  src={transactionData?.transaction.stuff?.media?.[0]}
                  alt={transactionData?.transaction.stuff?.name}
                />
              ) : (
                <div className="w-[75px] h-[75px]">
                  <ImageNotFound />
                </div>
              )}
            </div>
            <div className="ml-3 flex flex-col">
              <span className="text-base">{transactionData?.transaction.stuff.name}</span>
              <span className="text-xs text-gray-500">
                {transactionData?.transaction.stuff.type.name}
              </span>
            </div>
          </div>
        </div>
      ) : isOtherFeedback ? (
        <div>
          <div className="p-4 my-2">
            <div className="">
              <div className="ml-2">
                <Avatar
                  size="default"
                  src={transactionData?.transaction.customer?.information.avatar_url}
                />
                <span className="ml-2 text-base">
                  {transactionData?.transaction.customer?.information?.full_name}
                </span>
              </div>
            </div>

            <div className="ml-2">
              {/* Rating */}
              <div className="flex items-center ">
                <div>
                  <Rate
                    className="text-xs"
                    value={feedback.rating}
                    disabled={true}
                  />
                </div>
                <div className="mt-1 ml-2">
                  <span className="text-gray-500 text-xs">
                    {feedback.update_at
                      ? moment(feedback.update_at).format('YYYY-MM-DD HH:MM')
                      : moment(feedback.create_at).format('YYYY-MM-DD HH:MM')}
                  </span>
                </div>
              </div>
              {/* FeedBack */}
              <div className="mt-2">
                <p className="text-sm block mt-1">{feedback.content}</p>
              </div>
            </div>
          </div>

          <RatingModal
            feedback={feedback}
            isOpen={openRatingModal}
            onClose={() => setOpenRatingModal(false)}
          />
        </div>
      ) : (
        <div>
          {completed ? (
            <div className="border p-4 px-6 rounded-lg mx-10 my-2">
              <div className="flex items-center justify-between">
                <div className=" flex">
                  <div className="mr-2">
                    <Avatar
                      size="small"
                      src={user?.avatar_url ? String(user.avatar_url) : null}
                    />
                    <span className="ml-2 text-gray-500 text-xs">{user?.full_name}</span>
                  </div>
                  <ArrowRightOutlined />
                  <div className="ml-2">
                    <Avatar
                      size="small"
                      src={
                        transactionData?.transaction.stuff.type.slug === 'exchange'
                          ? transactionData?.transaction.stuff_owner?.id === user?.uid
                            ? transactionData?.transaction.customer?.information.avatar_url
                            : transactionData?.transaction.stuff_owner?.information.avatar_url
                          : transactionData?.transaction.stuff_owner?.information.avatar_url
                      }
                    />
                    <span className="ml-2 text-gray-500 text-xs">
                      {transactionData?.transaction.stuff.type.slug === 'exchange'
                        ? transactionData?.transaction.stuff_owner?.id === user?.uid
                          ? transactionData?.transaction.customer?.information.full_name
                          : transactionData?.transaction.stuff_owner?.information.full_name
                        : transactionData?.transaction.stuff_owner?.information.full_name}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="">
                  <span className="text-gray-500">
                    {feedback.update_at
                      ? moment(feedback.update_at).format('YYYY-MM-DD HH:MM')
                      : moment(feedback.create_at).format('YYYY-MM-DD HH:MM')}
                  </span>
                </div>
              </div>
              <div className="my-4">
                <hr />
              </div>
              <div className="mx-4">
                {/* Rating */}
                <div>
                  <span className="text-gray-500">Đánh giá:</span>
                  <Rate
                    className="ml-2"
                    value={feedback.rating}
                    disabled={true}
                  />
                </div>
                {/* FeedBack */}
                <div className="mt-2">
                  <span className="text-gray-500 block">Chi tiết:</span>
                  <p className="text-xs block ml-4 mt-1">{feedback.content}</p>
                </div>
              </div>
              <div className="flex mt-4">
                <div>
                  {hasStuffImages ? (
                    <Image
                      className="rounded-2xl border object-cover"
                      width={75}
                      height={75}
                      src={transactionData?.transaction.stuff?.media?.[0]}
                      alt={transactionData?.transaction.stuff?.name}
                    />
                  ) : (
                    <div className="w-[75px] h-[75px]">
                      <ImageNotFound />
                    </div>
                  )}
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-base">{transactionData?.transaction.stuff.name}</span>
                  <span className="text-xs text-gray-500">
                    {transactionData?.transaction.stuff.type.name}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="border p-4 px-6 rounded-lg mx-10 my-2">
              <div className="flex items-center justify-between">
                <div className=" flex">
                  <div className="mr-2">
                    <Avatar
                      size="small"
                      src={user?.avatar_url ? String(user.avatar_url) : null}
                    />
                    <span className="ml-2 text-gray-500 text-xs">{user?.full_name}</span>
                  </div>
                  <ArrowRightOutlined />
                  <div className="ml-2">
                    <Avatar
                      size="small"
                      src={
                        transactionData?.transaction.stuff.type.slug === 'exchange'
                          ? transactionData?.transaction.stuff_owner?.id === user?.uid
                            ? transactionData?.transaction.customer?.information.avatar_url
                            : transactionData?.transaction.stuff_owner?.information.avatar_url
                          : transactionData?.transaction.stuff_owner?.information.avatar_url
                      }
                    />
                    <span className="ml-2 text-gray-500 text-xs">
                      {transactionData?.transaction.stuff.type.slug === 'exchange'
                        ? transactionData?.transaction.stuff_owner?.id === user?.uid
                          ? transactionData?.transaction.customer?.information.full_name
                          : transactionData?.transaction.stuff_owner?.information.full_name
                        : transactionData?.transaction.stuff_owner?.information.full_name}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="mt-2">
                  <span className="text-gray-500">
                    {feedback.update_at
                      ? moment(feedback.update_at).format('YYYY-MM-DD HH:MM')
                      : moment(feedback.create_at).format('YYYY-MM-DD HH:MM')}
                  </span>
                </div>
              </div>
              <div className="my-4">
                <hr />
              </div>
              <div className="flex">
                <div>
                  {hasStuffImages ? (
                    <Image
                      className="rounded-2xl border object-cover"
                      width={75}
                      height={75}
                      src={transactionData?.transaction.stuff?.media?.[0]}
                      alt={transactionData?.transaction.stuff?.name}
                    />
                  ) : (
                    <div className="w-[75px] h-[75px]">
                      <ImageNotFound />
                    </div>
                  )}
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="text-base">{transactionData?.transaction.stuff.name}</span>
                  <span className="text-xs text-gray-500">
                    {transactionData?.transaction.stuff.type.name}
                  </span>
                </div>
              </div>
              <div className="my-4 mx-4">
                <hr />
              </div>
              <div>
                <Button
                  className="bg-red-500"
                  size="sm"
                  onClick={() => setOpenRatingModal(true)}
                >
                  Đánh giá
                </Button>
              </div>
            </div>
          )}
          <RatingModal
            feedback={feedback}
            isOpen={openRatingModal}
            setIsChanged={setIsChanged}
            onClose={() => setOpenRatingModal(false)}
          />
        </div>
      )}
    </>
  )
}

export default RatingItem
