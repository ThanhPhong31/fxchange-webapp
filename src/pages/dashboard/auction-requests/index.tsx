import { getDashboardLayout } from '@/components/layouts/dashboard-layout'
import TableSkeleton from '@/components/ui/skeleton/table-skeleton'
import AuctionTable from '@/components/ui/stuff/auction-table'
import { useAuth } from '@/contexts/auth-context'
import auctionQuery from '@/graphql/queries/auction-query'
import { NextPageWithLayout } from '@/pages/_app'
import { AuctionListGraphQLResponse } from '@/types/common'
import { Auction } from '@/types/model'
import { useLazyQuery } from '@apollo/client'
import { Divider } from '@mui/joy'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'

const AuctionRequest: NextPageWithLayout = () => {
  const router = useRouter()
  const [initLoading, setInitLoading] = useState(true)
  const { user, isValidating } = useAuth()
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Auction[]>([])
  const [reached, setReached] = useState(false)
  const limit = 10
  const [
    getAuction,
    {
      data: auctionListResponse,
      loading: onLoadAuctionList,
      error: errorOnLoadAuctionList,
      refetch,
    },
  ] = useLazyQuery<AuctionListGraphQLResponse>(auctionQuery.getAllAuctions())

  const handleLoadMore = useCallback(async () => {
    // if (reached) return
    // const newPage = page + 1
    // const { data: auctionListData } = await getAuction()
    // if (newPage === 1) setInitLoading(false)
    // if (newPage > page && auctionListData && auctionListData.auctions.length > 0) {
    //   setPage(newPage)
    //   const newData = _.cloneDeep(data)
    //   setData(newData.concat(auctionListData.auctions))
    // } else {
    //   setReached(true)
    // }
  }, [data, getAuction, page, reached])

  useEffect(() => {
    if (user && !isValidating && page === 0) {
      if (auctionListResponse) refetch()
      getAuction()
    }
  }, [
    handleLoadMore,
    isValidating,
    page,
    user,
    router,
    data,
    getAuction,
    auctionListResponse,
    refetch,
  ])

  return (
    <>
      <h3 className="pb-5 pt-8 text-2xl font-semibold text-zinc-700">Yêu cầu đấu giá</h3>
      <Divider
        sx={{
          boxShadow: '0 0 0 100vmax ' + colors.gray[200],
          clipPath: 'inset(0px -100vmax)',
          marginBottom: 4,
          backgroundColor: colors.gray[200],
        }}
      />
      <div className=" mx-auto">
        {onLoadAuctionList ? (
          <TableSkeleton />
        ) : (
          <AuctionTable
            dataSource={auctionListResponse?.auctions || []}
            initLoading={initLoading}
            loading={onLoadAuctionList}
            onLoadMore={handleLoadMore}
          />
        )}
      </div>
    </>
  )
}

AuctionRequest.getLayout = getDashboardLayout

export default AuctionRequest
