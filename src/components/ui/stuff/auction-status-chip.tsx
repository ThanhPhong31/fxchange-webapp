import { AuctionStatusEnum, AuctionStatusType } from '@/types/model'
import { Block } from '@mui/icons-material'
import { Chip, ColorPaletteProp } from '@mui/joy'
import { Circle, Dot } from 'lucide-react'
import React from 'react'

interface Props {
  status: AuctionStatusType
}
const AuctionStatusChip = ({ status }: Props) => {
  const chipColors: { [key: string]: ColorPaletteProp } = {
    BLOCKED: 'neutral',
    READY: 'info',
    PENDING: 'warning',
    STARTED: 'danger',
    COMPLETED: 'success',
    CANCELED: 'neutral',
  }

  const chipLabel: { [key: string]: any } = {
    BLOCKED: (
      <div>
        <Block /> <p>Đã bị chặn</p>
      </div>
    ),
    READY: 'Sẵn sàng',
    PENDING: 'Đang đợi',
    STARTED: (
      <div className="divider-x-2 gap-2 flex items-center">
        <Circle
          fill="#fff"
          size={10}
        />
        <p className="text-xs">Đang diễn ra</p>
      </div>
    ),
    COMPLETED: 'Đã kết thúc',
    CANCELED: 'Đãy bị hủy',
  }

  return (
    <Chip
      size="sm"
      variant="solid"
      color={chipColors[status]}
    >
      {chipLabel[status]}
    </Chip>
  )
}

export default AuctionStatusChip
