import NotFoundPage from '../404'
import { NextPageWithLayout } from '../_app'
import { getAppLayout } from '@/components/layouts/app-layout'
import StuffIssueList from '@/components/ui/stuff/stuff-issue-list'
import { useAuth } from '@/contexts/auth-context'
import stuffIssueQuery from '@/graphql/queries/stuff-issue-query'
import { StuffIssueListGraphQLResponse } from '@/types/common'
import { useLazyQuery, useQuery } from '@apollo/client'
import { Spin } from 'antd'
import React, { useEffect } from 'react'

const ViewListIssues: NextPageWithLayout = () => {
  const { isValidating, user } = useAuth()
  const [getStuffIssues, { data, loading, error }] = useLazyQuery<StuffIssueListGraphQLResponse>(
    stuffIssueQuery.getMyIssues()
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
    <Spin spinning={loading || isValidating}>
      <div>{data?.stuffIssues && <StuffIssueList data={data?.stuffIssues} />}</div>
    </Spin>
  )
}

ViewListIssues.getLayout = getAppLayout

export default ViewListIssues
