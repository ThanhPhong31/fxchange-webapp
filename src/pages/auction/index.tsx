import { ComponentHasStuffs } from '../'
import { NextPageWithLayout } from '../_app'
import { getAppLayout } from '@/components/layouts/app-layout'
import Banner from '@/components/ui/common/Banner'
import StuffFilter from '@/components/ui/stuff/stuff-filter'
import StuffList from '@/components/ui/stuff/stuff-list'
import client from '@/graphql'
import stuffQuery, { GetCategoryList } from '@/graphql/queries/stuff-query'
import { StuffListGraphQLResponse } from '@/types/common'
import { Stuff, StuffCategory } from '@/types/model'
import { useLazyQuery, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'

const AuctionPage: NextPageWithLayout = ({ stuff }: ComponentHasStuffs) => {
  const [categoryFilter, setCategoryFilter] = useState<number>(1)
  const [stuffs, setStuffs] = useState<Stuff[]>([])
  const [searchInput, setSearchInput] = useState('')
  const { data: categoriesData } = useQuery<{ categories: StuffCategory[] }>(GetCategoryList)

  const typeSlug = 'auction'
  const {
    data: stuffData,
    loading,
    error,
  } = useQuery<StuffListGraphQLResponse>(stuffQuery.getAuctionStuffs(), {
    variables: { typeSlug },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (stuffData) {
      setStuffs(stuffData.stuffList)
    }
  }, [stuffData])

  useEffect(() => {
    if (!stuffData?.stuffList) return
    setStuffs([])
    let newStuffs = stuffData.stuffList
    if (categoryFilter !== 1 && searchInput) {
      newStuffs = newStuffs.filter(
        (stuffItem) =>
          stuffItem.category.id === categoryFilter &&
          stuffItem.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    } else if (categoryFilter !== 1) {
      newStuffs = newStuffs.filter((stuffItem) => stuffItem.category.id === categoryFilter)
    } else if (searchInput) {
      newStuffs = newStuffs.filter((stuffItem) =>
        stuffItem.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    }
    setStuffs(newStuffs)
  }, [categoryFilter, searchInput, stuffData?.stuffList])

  return (
    <>
      <Banner
        title="Đấu giá"
        className=" text-white bg-gradient-conic from-amber-500 to-amber-800"
        descriptionClassName="text-white"
        detail="Sàn đấu giá đồ cũ bằng điểm duy nhất tại Đại học FPT"
      />
      {/* <StuffList stuffs={stuff || []} /> */}
      <StuffFilter
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        categories={categoriesData?.categories}
      />
      <StuffList
        stuffs={stuffs || []}
        showType={false}
        isLoading={loading}
      />
    </>
  )
}

// export async function getStaticProps() {
//   const { data } = await client.query({
//     query: stuffQuery.getByTypeSlug(),
//     variables: {
//       typeSlug: 'auction',
//     },
//   })

//   return {
//     props: {
//       stuff: data.stuffList,
//     },
//     revalidate: 10,
//   }
// }

AuctionPage.getLayout = getAppLayout
AuctionPage.meta = {
  title: 'Đấu giá | FXchange',
  description: 'Nơi bạn có thể đấu giá đồ cũ với mọi người thay vì bỏ đi.',
}

export default AuctionPage
