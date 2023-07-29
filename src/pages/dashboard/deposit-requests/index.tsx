import { getDashboardLayout } from '@/components/layouts/dashboard-layout'
import { columns } from '@/components/ui/dashboard/transaction-table/columns'
import { DataTable } from '@/components/ui/dashboard/transaction-table/component'
import TableSkeleton from '@/components/ui/skeleton/table-skeleton'
import TransactionTable from '@/components/ui/transaction/transaction-table'
import { useAuth } from '@/contexts/auth-context'
import transactionQuery from '@/graphql/queries/transaction-query'
import { SAMPLE_TRANSACTIONS } from '@/libs/constants'
import { NextPageWithLayout } from '@/pages/_app'
import { TransactionListGraphQLResponse } from '@/types/common'
import { Transaction } from '@/types/model'
import { useLazyQuery } from '@apollo/client'
import { Divider } from '@mui/joy'
import { useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'

const DepositRequest: NextPageWithLayout = () => {
  const { user } = useAuth()
  const [
    getTransactions,
    { data: transactionsResponse, loading: isLoadTransactions, error: hasErrorOnTransactions },
  ] = useLazyQuery<TransactionListGraphQLResponse>(transactionQuery.getPickupTransactions())

  useEffect(() => {
    if (user) {
      getTransactions()
    }
  }, [getTransactions, user])

  return (
    <>
      <h3 className="pb-5 pt-8 text-2xl font-semibold text-zinc-700">Yêu cầu ký gửi</h3>
      <Divider
        sx={{
          boxShadow: '0 0 0 100vmax ' + colors.gray[200],
          clipPath: 'inset(0px -100vmax)',
          marginBottom: 4,
          backgroundColor: colors.gray[200],
        }}
      />
      {isLoadTransactions ? (
        <TableSkeleton repeat={7} />
      ) : (
        <TransactionTable transactions={transactionsResponse?.transactions || []} />
      )}
    </>
  )
}

DepositRequest.getLayout = getDashboardLayout

export default DepositRequest
