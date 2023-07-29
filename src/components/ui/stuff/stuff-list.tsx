import StuffCard from './stuff-card'
import { Stuff } from '@/types/model'
import { Empty } from 'antd'
import React, { useEffect, useState } from 'react'

interface StuffListProps {
  stuffs?: Stuff[]
  isRecommendList?: boolean
  isLoading?: boolean
  isIncreaseSorted?: boolean
  showType?: boolean
}

const StuffList = ({
  stuffs,
  isRecommendList,
  isLoading,
  isIncreaseSorted,
  showType = true,
}: StuffListProps) => {
  const [isShowed, setIsShowed] = useState(false)
  useEffect(() => {
    if (!isLoading) {
      setIsShowed(false)
      setTimeout(() => {
        setIsShowed(true)
      }, 200)
    }
  }, [stuffs, isIncreaseSorted])
  return (
    <div
      className={`grid w-full ${
        isRecommendList || stuffs?.length === 0
          ? 'max-lg:!grid-cols-2 max-lg:!gap-3'
          : 'grid-cols-4'
      } gap-4 max-md:gap-3 max-lg:grid-cols-2`}
    >
      {isShowed && (
        <>
          {stuffs?.length === 0 ? (
            <div className="flex justify-center">
              <Empty />
            </div>
          ) : (
            <>
              {stuffs &&
                stuffs.map((item, index) => (
                  <StuffCard
                    isRecommend={isRecommendList}
                    data={item}
                    showType={showType}
                    key={item.id}
                  />
                ))}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default StuffList
