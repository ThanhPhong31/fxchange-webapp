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

const MarketPage: NextPageWithLayout = ({ stuff }: ComponentHasStuffs) => {
  const [isIncreaseSorted, setIsIncreaseSorted] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<number>(1)
  const [stuffs, setStuffs] = useState<Stuff[]>([])
  const [searchInput, setSearchInput] = useState('')
  const { data: categoriesData } = useQuery<{ categories: StuffCategory[] }>(GetCategoryList)

  const typeSlug = 'market'
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
    let newStuffs: Stuff[] = []
    if (stuffData?.stuffList) {
      newStuffs = stuffData.stuffList
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
    }

    if (isIncreaseSorted) {
      newStuffs.sort((a, b) => {
        if (a.price !== b.price) {
          return a.price - b.price
        } else {
          const dateA = new Date(a.create_at)
          const dateB = new Date(b.create_at)

          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime()
          } else {
            return a.condition - b.condition
          }
        }
      })
    } else {
      newStuffs.sort((a, b) => {
        if (a.price !== b.price) {
          return b.price - a.price
        } else {
          const dateA = new Date(a.create_at)
          const dateB = new Date(b.create_at)

          if (dateA.getTime() !== dateB.getTime()) {
            return dateB.getTime() - dateA.getTime()
          } else {
            return b.condition - a.condition
          }
        }
      })
    }

    setStuffs(newStuffs)
  }, [categoryFilter, searchInput, stuffData?.stuffList, isIncreaseSorted])

  return (
    <>
      <Banner
        title="Mua bán"
        className="text-white bg-gradient-conic from-sky-500 to-sky-800"
        descriptionClassName="text-white"
        detail="Mua bán đồ cũ chưa bao giờ dễ hàng hơn."
      />
      {/* <StuffList stuffs={stuff || []} /> */}
      <StuffFilter
        isMarket={true}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        categories={categoriesData?.categories}
        isIncreaseSorted={isIncreaseSorted}
        setIsIncreaseSorted={setIsIncreaseSorted}
      />
      <StuffList
        stuffs={stuffs || []}
        isIncreaseSorted={isIncreaseSorted}
        isLoading={loading}
        showType={false}
      />
    </>
  )
}

// export async function getStaticProps() {
//   const { data } = await client.query({
//     query: stuffQuery.getByTypeSlug(),
//     variables: {
//       typeSlug: 'market',
//     },
//   })

//   return {
//     props: {
//       stuff: data.stuffList,
//     },
//     revalidate: 10,
//   }
// }

MarketPage.getLayout = getAppLayout
MarketPage.meta = {
  title: 'Chợ vật phẩm | FXchange',
  description: 'Nơi bạn có thể mua vật phẩm cũ với mọi người thay vì bỏ đi.',
}
export default MarketPage
