import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { NextPageWithLayout } from './_app'
import { ROLES } from '@/components/context/auth-context-container'
/**
 const MyComponent = dynamic(() => import('./components/MyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable server-side rendering for this component
});
 */
import { getAppLayout } from '@/components/layouts/app-layout'
import FxImage from '@/components/ui/common/fx-image'
import AuctionStatusChip from '@/components/ui/stuff/auction-status-chip'
import StuffFilter from '@/components/ui/stuff/stuff-filter'
import StuffList from '@/components/ui/stuff/stuff-list'
import { useAuth } from '@/contexts/auth-context'
import auctionQuery from '@/graphql/queries/auction-query'
import stuffQuery, { GetCategoryList } from '@/graphql/queries/stuff-query'
import { AuctionListGraphQLResponse, StuffListGraphQLResponse } from '@/types/common'
import { Stuff, StuffCategory } from '@/types/model'
import { useQuery } from '@apollo/client'
import moment from 'moment'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export interface ComponentHasStuffs {
  stuff?: Stuff[] | null
}

const Home: NextPageWithLayout = (props: ComponentHasStuffs) => {
  const {
    data: stuffData,
    loading,
    error,
  } = useQuery<StuffListGraphQLResponse>(stuffQuery.getAll(), {
    fetchPolicy: 'network-only',
  })
  const {
    data: auctionsData,
    loading: loadingAuctions,
    error: errorOnLoadAuctions,
  } = useQuery<AuctionListGraphQLResponse>(auctionQuery.getAllApprovedAuctions(), {
    fetchPolicy: 'network-only',
    variables: {
      startedOnly: true,
    },
  })

  const [stuffs, setStuffs] = useState<Stuff[]>([])
  const { user } = useAuth()
  const [searchInput, setSearchInput] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number>(1)
  const { data: categoriesData } = useQuery<{ categories: StuffCategory[] }>(GetCategoryList)

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

  // if (user?.role !== ROLES.MEMBER) return <></>

  return (
    <>
      {/* <div className="w-full mb-8">
        <AddingStuffCTA className="mx-auto" />
      </div> */}
      <NextSeo
        openGraph={{
          url: 'https://www.fxchange.me',
          type: 'website',
          images: [
            {
              url: 'https://www.fxchange.me/backdrop.png',
              height: 600,
              alt: 'FXchange',
              width: 800,
            },
          ],
        }}
      />
      {auctionsData?.auctions && auctionsData?.auctions.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-xl font-bold">Vật phẩm đang đấu giá</h3>
          <Swiper
            pagination={{
              type: 'bullets',
            }}
            navigation={true}
            slidesPerView={3}
            spaceBetween={12}
            breakpoints={{
              '@0.00': {
                slidesPerView: 1,
                spaceBetween: 8,
              },
              '@0.75': {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              '@1.0': {
                slidesPerView: 3,
                spaceBetween: 12,
              },
            }}
            modules={[Navigation]}
            className="mySwiper"
          >
            {auctionsData?.auctions.map((auction) => (
              <SwiperSlide key={auction.stuff_id}>
                <div className="px-4 py-6 bg-white rounded-xl">
                  <Link href={'/auction/' + auction.stuff_id}>
                    <div className="relative w-full overflow-hidden border cursor-pointer group aspect-video bg-slate-200 rounded-xl">
                      <FxImage
                        src={auction.stuff.media?.[0] as string}
                        alt={auction.stuff.name}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center transition-all opacity-0 bg-black/40 group-hover:opacity-100">
                        <button className="px-4 py-2 text-sm transition-all translate-y-4 bg-white rounded-full group-hover:translate-y-0">
                          Xem chi tiết
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <AuctionStatusChip status={auction.status} />
                      </div>
                    </div>
                  </Link>
                  <h4 className="mt-3 text-base font-semibold">{auction.stuff.name}</h4>
                  <div className="flex items-start justify-between w-full mt-3">
                    <div>
                      <div className="text-sm">
                        <span>Giá khởi điểm: </span>
                        <span className="font-semibold">{auction.initial_price}</span>
                      </div>
                      <div className="text-sm">
                        <span>Bước giá: </span>
                        <span className="font-semibold">{auction.step_price}</span>
                      </div>
                    </div>
                    {auction.status === 'STARTED' && (
                      <div>
                        <div className="text-right">
                          <Countdown
                            date={moment(auction.expire_at).toDate()}
                            renderer={(props) => (
                              <div className="text-base font-semibold text-zinc-800">
                                {props.formatted.hours}:{props.formatted.minutes}:
                                {props.formatted.seconds}
                              </div>
                            )}
                            autoStart={true}
                            overtime={false}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
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
      {/* <StuffList stuffs={(data?.stuff && data.stuff) || []} /> */}
    </>
  )
}

Home.getLayout = getAppLayout

export default Home
