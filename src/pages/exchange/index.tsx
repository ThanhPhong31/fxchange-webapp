// import StuffDetail from '../../components/ui/common/stuff-detail/index'

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
import { useEffect, useState } from 'react'

const ExchangePage: NextPageWithLayout = ({ stuff }: ComponentHasStuffs) => {
  const [categoryFilter, setCategoryFilter] = useState<number>(1)
  const [stuffs, setStuffs] = useState<Stuff[]>([])
  const [searchInput, setSearchInput] = useState('')
  const { data: categoriesData } = useQuery<{ categories: StuffCategory[] }>(GetCategoryList)

  const typeSlug = 'exchange'
  const {
    data: stuffData,
    loading,
    error,
  } = useQuery<StuffListGraphQLResponse>(stuffQuery.getByTypeSlug(), {
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
        title="Trao đổi"
        detail="Nơi bạn có thể trao đổi vật phẩm cũ với mọi người thay vì bỏ đi."
        descriptionClassName="text-white"
        className=" !text-white bg-gradient-conic from-primary-500 to-primary-800"
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
        isLoading={loading}
      />
    </>
  )
}

// export async function getStaticProps() {
//   const { data } = await client.query({
//     query: stuffQuery.getByTypeSlug(),
//     variables: {
//       typeSlug: 'exchange',
//       revalidate: 10,
//     },
//   })

//   return {
//     props: {
//       stuff: data.stuffList,
//     },
//   }
// }

ExchangePage.getLayout = getAppLayout
ExchangePage.meta = {
  title: 'Trao đổi | FXchange',
  description: 'Nơi bạn có thể trao đổi vật phẩm cũ với mọi người thay vì bỏ đi.',
}

export default ExchangePage
