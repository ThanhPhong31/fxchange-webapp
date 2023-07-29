import ConditionChip from '../../common/condition-chip'
import UserCard from '../../common/user-card'
import StuffMediaGrid from '../stuff-media-grid'
import momentVi from '@/libs/moment'
import { Stuff } from '@/types/model'
import { Button } from '@mui/joy'
import { Rate, Tag } from 'antd'
import { Share } from 'lucide-react'
import { memo, useEffect, useState } from 'react'

type StuffDetailProps = {
  stuff: Stuff
  ratingPoints?: number
}

const ExchangeStuffDetail = ({ stuff, ratingPoints }: StuffDetailProps) => {
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
    <div className="relative w-full p-4 bg-white md:py-0 md:px-4">
      <div className="w-full gap-2 py-3">
        <UserCard
          avatarWidth={40}
          avatarUrl={stuff.author.information.avatar_url}
          username={stuff.author.information.full_name}
        />
        <div className=''>
          <Rate
          className='text-sm'
            allowHalf
            defaultValue={ratedPoints}
            value={ratedPoints}
            disabled={true}
          />
        </div>
      </div>
      <div className="relative w-full pb-6 max-md:pb-4">
        <div className="absolute z-10 bg-transparent top-8 left-8 max-md:top-2 max-md:left-2">
          <ConditionChip value={stuff?.condition} />
        </div>
        <StuffMediaGrid
          media={stuff?.media || []}
          alt={stuff.name}
        />
      </div>
      <div className="text-zinc-800">
        <div className="pb-4 max-md:pb-2">
          <div className="flex items-start justify-between ">
            <div className="pb-1 text-3xl font-medium max-md:text-xl">{stuff?.name}</div>{' '}
            <Button
              size="sm"
              variant="plain"
              color="neutral"
              startDecorator={
                <Share
                  width={20}
                  className="text-gray-500"
                />
              }
            >
              Chia sẻ
            </Button>
          </div>
          <div className="flex items-center gap-2 pt-1 text-sm text-gray-800">
            {stuff.category.name && <span className="underline">{stuff.category.name}</span>}
            <span aria-hidden="true">·</span>
            <span>{momentVi(stuff.create_at).startOf('day').fromNow()}</span>
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

export default memo(ExchangeStuffDetail)
