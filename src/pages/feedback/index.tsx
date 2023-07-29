import { NextPageWithLayout } from '../_app'
import RatingItem from '@/components/ui/rating/rating-item'
import TransactionItem from '@/components/ui/transaction/transaction-item'
import TransactionList from '@/components/ui/transaction/transaction-list'
import { useAuth } from '@/contexts/auth-context'
import transactionQuery from '@/graphql/queries/transaction-query'
import { GetFeedBackList, GetFeedBackedList } from '@/graphql/queries/user-query'
import { TransactionListGraphQLResponse } from '@/types/common'
import { User } from '@/types/model'
import { useQuery } from '@apollo/client'
import { ConfigProvider, Tabs, TabsProps } from 'antd'
import { useRouter } from 'next/router'
import React, { use, useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'

type FeedBack = {
  id: string
  rating: number
  content: string
  transaction_id: string
  create_at: Date
  update_at: Date
}

const RatingAndFeedBack: NextPageWithLayout = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [completedFeedbacks, setCompletedFeedbacks] = useState<FeedBack[]>([])
  const [pendingFeedbacks, setPendingFeedbacks] = useState<FeedBack[]>([])
  const [feedBackedList, setFeedBackedList] = useState<FeedBack[]>([])
  const [isChanged, setIsChanged] = useState<boolean>(false)

  const {
    data: feedBackListData,
    loading: feedBackListLoading,
    error: feedBackListError,
    refetch: feedBackListRefectch,
  } = useQuery<{ feedbackList: FeedBack[] }>(GetFeedBackList)
  const {
    data: feedBackedListData,
    loading: feedBackedListLoading,
    error: feedBackedListError,
  } = useQuery<{ feedBackedList: FeedBack[] }>(GetFeedBackedList)

  const onChangeTab = (key: string) => {
    router.push({
      hash: key,
    })
  }

  useEffect(() => {
    if (isChanged) {
      feedBackListRefectch()
      setIsChanged(false)
    }
    if (feedBackListData) {
      let completedFeedbackList: FeedBack[] = []
      let pendingFeedbackList: FeedBack[] = []
      feedBackListData.feedbackList.forEach((item, index) => {
        if (item.rating) {
          completedFeedbackList.push(item)
        } else {
          pendingFeedbackList.push(item)
        }
      })
      setCompletedFeedbacks(completedFeedbackList.reverse())
      setPendingFeedbacks(pendingFeedbackList.reverse())
    }
    if (feedBackedListData) {
      setFeedBackedList(feedBackedListData.feedBackedList)
    }
  }, [feedBackListData, feedBackedListData, isChanged])

  const items: TabsProps['items'] = [
    {
      key: 'pending',
      label: `Chưa đánh giá`,
      children: (
        <section>
          {pendingFeedbacks.map((item, index) => {
            return (
              <RatingItem
                key={item.id}
                feedback={item}
                completed={false}
                setIsChanged={setIsChanged}
                user={user}
              />
            )
          })}
          {pendingFeedbacks.length === 0 && (
            <div className="text-gray-500 text-base flex justify-center mt-2 select-none">
              Không còn đánh giá nào
            </div>
          )}
        </section>
      ),
    },
    {
      key: 'completed',
      label: `Đã đánh giá`,
      children: (
        <section>
          {completedFeedbacks.map((item, index) => {
            return (
              <RatingItem
                key={item.id}
                feedback={item}
                completed={true}
                user={user}
              />
            )
          })}
          {completedFeedbacks.length === 0 && (
            <div className="text-gray-500 text-base flex justify-center mt-2 select-none">
              Không có đánh giá nào
            </div>
          )}
        </section>
      ),
    },
    {
      key: 'other',
      label: `Được đánh giá`,
      children: (
        <section>
          {feedBackedList.map((item, index) => {
            return (
              <RatingItem
                key={item.id}
                feedback={item}
                isFeedBacked={true}
                completed={true}
                user={user}
              />
            )
          })}
          {feedBackedList.length === 0 && (
            <div className="text-gray-500 text-base flex justify-center mt-2 select-none">
              Không có đánh giá nào
            </div>
          )}
        </section>
      ),
    },
  ]

  return (
    <div>
      <h3 className="text-3xl max-md:text-xl">Đánh giá</h3>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colors.zinc[900],
          },
        }}
      >
        <Tabs
          className="pt-1"
          size="large"
          defaultActiveKey="1"
          items={items}
          onChange={onChangeTab}
        />
      </ConfigProvider>
    </div>
  )
}

export default RatingAndFeedBack
