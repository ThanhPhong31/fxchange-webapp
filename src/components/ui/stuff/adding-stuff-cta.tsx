import { useApp } from '@/contexts/app-context'
import cn from '@/libs/utils'
import { WithClassName } from '@/types/common'
import { Button } from '@mui/joy'
import { ArrowLeftRight, CircleDollarSign, DollarSign, HelpingHand } from 'lucide-react'
import React from 'react'

const AddingStuffCTA = ({ className }: WithClassName) => {
  const { onOpen } = useApp()
  //selectbar
  return (
    <div className={cn('p-6 rounded-xl border shadow-sm bg-white lg:w-[700px] w-full', className)}>
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold mx-md:text-base text-slate-800 ">
          Bạn có vật phẩm cũ cần ra đi?
        </h3>
        <p className="text-sm text-slate-500">
          Make changes to your profile here. Click save when you&apos;re done.
        </p>
      </div>
      <div className="grid grid-cols-2 max-[360px]:grid-cols-1">
        <Button
          className="text-lg max-md:text-base whitespace-nowrap"
          onClick={() => onOpen('exchange')}
          variant="plain"
          color="neutral"
          fullWidth
          size="lg"
          startDecorator={<ArrowLeftRight />}
        >
          Trao đổi
        </Button>
        <Button
          className="text-lg max-md:text-base whitespace-nowrap"
          onClick={() => onOpen('market')}
          variant="plain"
          color="neutral"
          fullWidth
          size="lg"
          startDecorator={<DollarSign />}
        >
          Đăng bán
        </Button>
        <Button
          className="text-lg max-md:text-base whitespace-nowrap"
          onClick={() => onOpen('donate')}
          variant="plain"
          color="neutral"
          fullWidth
          size="lg"
          startDecorator={<HelpingHand />}
        >
          Quyên góp
        </Button>
        <Button
          className="text-lg max-md:text-base whitespace-nowrap"
          onClick={() => onOpen('auction')}
          variant="plain"
          color="neutral"
          fullWidth
          size="lg"
          startDecorator={<CircleDollarSign />}
        >
          Đấu giá
        </Button>
      </div>
    </div>
  )
}

export default AddingStuffCTA
