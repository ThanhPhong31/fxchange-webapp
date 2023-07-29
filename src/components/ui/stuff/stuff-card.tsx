import Badge from '../common/badge'
import FxImage from '../common/fx-image'
import ImageNotFound from '../common/image-not-found'
import UserAvatar from '../common/user-avartar'
import UserCard from '../common/user-card'
import AuctionStatusChip from './auction-status-chip'
import cn from '@/libs/utils'
import { Stuff } from '@/types/model'
import { Button, IconButton } from '@mui/joy'
import { useMediaQuery } from '@mui/material'
import { Tooltip } from 'antd'
import { MoreHorizontal } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'

type Props = {
  data: Stuff
  slug?: string
  showAuthorInfo?: boolean
  showType?: boolean
  showCategory?: boolean
  isRecommend?: boolean
}

function StuffCard({
  data,
  slug,
  showAuthorInfo = true,
  showType = true,
  isRecommend = false,
}: Props) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const badgetVariant: {
    [key: string]: string
  } = {
    exchange: '1',
    market: '2',
    auction: '3',
    donate: '4',
  }

  const _slug = `/${data?.type?.slug}/${data.id}`
  //stuff card for all type

  return (
    <div
      className={cn(
        'overflow-hidden bg-white max-lg:mx-0 flex flex-col items-stretch max-md:p-3 max-lg:p-4 rounded-xl max-md:rounded-none',
        !isRecommend && 'max-md:-mx-3 '
      )}
    >
      <div className="relative w-full overflow-hidden rounded-xl aspect-square lg:rounded-lg ">
        <Link
          href={_slug}
          className="transition-all hover:brightness-75"
        >
          <FxImage
            quality={60}
            className="object-cover w-full h-full"
            media={data.media}
            src=""
            alt="stuff image"
            unoptimized
            referrerPolicy="no-referrer"
          />
        </Link>
        {data.auction && (
          <div className="absolute top-2 left-2">
            <AuctionStatusChip status={data.auction.status} />
          </div>
        )}
        <div className="absolute bottom-2 max-md:bottom-1 left-0 rounded-r-full max-md:pl-1 pl-3 py-1 pr-1 flex items-center">
          <Tooltip title={data.author.information.full_name || 'Ẩn danh'}>
            <UserAvatar
              className="flex-shrink-0"
              // size={isMobile ? 'sm' : 'sm'}
              width={isMobile ? 30 : 40}
              src={data.author.information.avatar_url || 'https://source.unsplash.com/random'}
            />
          </Tooltip>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 pt-5 max-md:py-3">
        {showType && (
          <Badge
            className="mb-2 w-fit"
            variant={badgetVariant[data?.type.slug as keyof { [key: string]: string }]}
          >
            {data?.type.name}
          </Badge>
        )}
        <h3 className="text-xl font-semibold max-lg:text-lg max-md:text-sm line-clamp-1">
          <Link href={`/${data?.type.slug}/${data.id}`}>{data.name}</Link>
        </h3>
        <p className="text-sm max-md:hidden line-clamp-2">{data.description}</p>
        {data?.type?.slug === 'market' && data?.price && (
          <p className="pt-1 mt-auto font-sans text-base text-slate-700">
            <span className="mr-1 font-bold text-slate-900">{data.price}</span>
            <span>
              {(data?.payment_type?.slug && data.payment_type.slug) === 'money' ? 'đ' : 'FPoints'}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default StuffCard
