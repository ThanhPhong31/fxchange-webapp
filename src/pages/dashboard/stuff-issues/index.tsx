import { getDashboardLayout } from '@/components/layouts/dashboard-layout'
import TableSkeleton from '@/components/ui/skeleton/table-skeleton'
import StuffIssueList from '@/components/ui/stuff/stuff-issue-list'
import { useAuth } from '@/contexts/auth-context'
import stuffIssueQuery from '@/graphql/queries/stuff-issue-query'
import NotFoundPage from '@/pages/404'
import { NextPageWithLayout } from '@/pages/_app'
import { StuffIssueListGraphQLResponse } from '@/types/common'
import { useLazyQuery } from '@apollo/client'
import { Spin } from 'antd'
import React, { useEffect } from 'react'

const StuffIssuesPage: NextPageWithLayout = () => {
  const { isValidating, user } = useAuth()
  const [getStuffIssues, { data, loading, error }] = useLazyQuery<StuffIssueListGraphQLResponse>(
    stuffIssueQuery.getAllIssues()
  )

  useEffect(() => {
    if (!isValidating && user) {
      getStuffIssues()
    }
  }, [getStuffIssues, isValidating, user])

  if (error || (!isValidating && !user)) {
    return <NotFoundPage />
  }

  return (
    <>
      <h3 className="pb-5 pt-8 text-2xl font-semibold text-zinc-700">Yêu cầu sửa đổi</h3>
      {loading || isValidating ? (
        <TableSkeleton />
      ) : (
        <div>{data?.stuffIssues && <StuffIssueList data={data?.stuffIssues} />}</div>
      )}
    </>
  )
}

StuffIssuesPage.getLayout = getDashboardLayout

export default StuffIssuesPage
