import NotFoundPage from '../404'
import { NextPageWithLayout } from '../_app'
import TransactionItem from '@/components/ui/transaction/transaction-item'
import TransactionList from '@/components/ui/transaction/transaction-list'
import { useAuth } from '@/contexts/auth-context'
import transactionQuery from '@/graphql/queries/transaction-query'
import { TransactionListGraphQLResponse } from '@/types/common'
import { User } from '@/types/model'
import { useQuery } from '@apollo/client'
import { ConfigProvider, Tabs, TabsProps } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import colors from 'tailwindcss/colors'

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
    type: string
  }
  pickup: boolean
  status: string
}

const TransactionViewList: NextPageWithLayout = () => {
  const router = useRouter()
  const { user, isValidating } = useAuth()
  const {
    data: transactionsData,
    loading: loadOnGetTransactions,
    error: errorOnGetTransactions,
  } = useQuery<TransactionListGraphQLResponse>(transactionQuery.findByUID())

  const onChangeTab = (key: string) => {
    router.push({
      hash: key,
    })
  }

  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: `Tất cả`,
      children: (
        <section>
          {transactionsData?.transactions.map((item, index) => {
            return (
              <TransactionItem
                key={item.id}
                transaction={item}
              />
            )
          })}
        </section>
      ),
    },
    {
      key: 'PENDING',
      label: `Đợi ký gửi`,
      children: (
        <section>
          {transactionsData?.transactions.map((item, index) => {
            if (item.status === 'PENDING') {
              return (
                <TransactionItem
                  key={item.id}
                  transaction={item}
                />
              )
            }
          })}
        </section>
      ),
    },
    {
      key: 'ONGOING',
      label: `Đang bàn giao`,
      children: (
        <section>
          {transactionsData?.transactions.map((item, index) => {
            if (item.status === 'ONGOING') {
              return (
                <TransactionItem
                  key={item.id}
                  transaction={item}
                />
              )
            }
          })}
        </section>
      ),
    },
    {
      key: 'COMPLETED',
      label: `Đã hoàn thành`,
      children: (
        <section>
          {transactionsData?.transactions.map((item, index) => {
            if (item.status === 'COMPLETED') {
              return (
                <TransactionItem
                  key={item.id}
                  transaction={item}
                />
              )
            }
          })}
        </section>
      ),
    },
    {
      key: 'WAIT',
      label: `Đang đợi`,
      children: (
        <section>
          {transactionsData?.transactions.map((item, index) => {
            if (item.status === 'WAIT') {
              return (
                <TransactionItem
                  key={item.id}
                  transaction={item}
                />
              )
            }
          })}
        </section>
      ),
    },
    {
      key: 'CANCELED',
      label: `Đã hủy`,
      children: (
        <section>
          {transactionsData?.transactions.map((item, index) => {
            if (item.status === 'CANCELED') {
              return (
                <TransactionItem
                  key={item.id}
                  transaction={item}
                />
              )
            }
          })}
        </section>
      ),
    },
  ]

  if (!user && !isValidating) return <NotFoundPage />

  return (
    <div>
      <h3 className="text-3xl max-md:text-xl">Lịch sử giao dịch</h3>
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

TransactionViewList.meta = {
  title: 'Danh sách giao dịch | FXchange',
}

export default TransactionViewList
