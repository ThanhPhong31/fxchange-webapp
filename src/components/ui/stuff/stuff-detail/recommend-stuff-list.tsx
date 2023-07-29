import StuffList from '@/components/ui/stuff/stuff-list'
import { Stuff } from '@/types/model'
import { Sheet } from '@mui/joy'
import React from 'react'

type Props = {
  stuffs?: Stuff[] | null
}

const RecommendStuffs = ({ stuffs }: Props) => {
  return (
    <div className="h-[700px] overflow-auto">
      <StuffList
        isRecommendList={true}
        stuffs={stuffs || []}
      />
    </div>
  )
}

export default RecommendStuffs
