import ConditionChip from '../../common/condition-chip'
import UserCard from '../../common/user-card'
import StuffMediaGrid from '../stuff-media-grid'
import momentVi from '@/libs/moment'
import { Stuff } from '@/types/model'
import { Rate, Tag } from 'antd'
import { useEffect, useState } from 'react'

type StuffDetailProps = {
  stuff: Stuff
  ratingPoints?: number
}

function MarketStuffDetail({ stuff, ratingPoints }: StuffDetailProps) {
  const [ratedPoints, setRatedPoints] = useState<number>(0)
  useEffect(() => {
    if (ratingPoints) {
      const decimal = ratingPoints - Math.floor(ratingPoints)
      if (decimal < 0.2) {
        setRatedPoints(Math.floor(ratingPoints))
      } else if (decimal > 0.2 && decimal < 0.7) {
        setRatedPoints(Math.floor(ratingPoints) + 0.5)
      } else {
        setRatedPoints(Math.ceil(ratingPoints))
      }
    } else {
      setRatedPoints(0)
    }
  }, [ratingPoints])

  return (
    <div className="relative w-full p-4 overflow-hidden bg-white md:py-0 md:px-4 rounded-xl max-md:rounded-none drop-shadow-sm">
      <div className="w-full gap-2 py-3">
        <UserCard
          avatarWidth={40}
          username={stuff.author.information.full_name}
          avatarUrl={stuff.author.information.avatar_url}
        />
        <div className="">
          <Rate
            className="text-sm"
            allowHalf
            defaultValue={ratedPoints}
            value={ratedPoints}
            disabled={true}
          />
        </div>
      </div>
      <div className="relative w-full pb-8 overflow-hidden rounded-lg ">
        <div className="absolute z-10 mb-3 bg-transparent top-8 left-8 md:top-2 md:left-2">
          <ConditionChip
            size="sm"
            value={stuff?.condition}
          />
        </div>
        <StuffMediaGrid
          media={stuff.media || []}
          alt={stuff.name}
        />
      </div>
      <div className="mb-6 text-zinc-800">
        <div className="flex items-center justify-between pb-4">
          <div>
            <div className="pb-1 text-3xl font-medium">{stuff?.name}</div>
            <div className="flex items-center gap-2 pt-1 text-sm text-gray-800">
              {stuff.category.name && <span className="underline">{stuff.category.name}</span>}
              <span aria-hidden="true">·</span>
              <span>{momentVi(stuff.create_at).startOf('day').fromNow()}</span>
            </div>
          </div>

          <div>
            <span className="block font-sans text-3xl text-slate-800">
              <span className="font-bold">{stuff.price}</span>
              <span>{stuff.price >= 10000 ? 'VNĐ' : 'FPoints'}</span>
            </span>
            {/* <Button
              size="sm"
              variant="plain"
              color="neutral"
              startDecorator={<Share className="text-gray-500" />}
            >
              Chia sẻ
            </Button> */}
          </div>
        </div>

        <p className="max-md:pb-4">{stuff?.description}</p>
        <div>
          {stuff?.tags &&
            stuff.tags.map((t) => (
              <Tag
                className="px-4 py-1 text-base font-medium rounded-full"
                key={t?.id}
              >
                {t?.tag?.name}: {t?.value}
              </Tag>
            ))}
        </div>
      </div>
    </div>
  )
}

export default MarketStuffDetail
