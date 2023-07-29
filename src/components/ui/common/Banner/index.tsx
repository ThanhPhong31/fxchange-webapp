import cn from '@/libs/utils'
import { WithClassName } from '@/types/common'
import React from 'react'

type Props = {
  title: string
  detail?: string
  descriptionClassName?: string
}

function Banner({ title, detail, className, descriptionClassName }: Props & WithClassName) {
  return (
    <div className={cn('w-full mb-8 bg-white rounded-xl overflow-hidden', className)}>
      <div className="flex flex-col items-start p-11">
        <div className="pb-2 text-5xl font-semibold">{title}</div>
        <div className={cn('text-slate-700', descriptionClassName)}>{detail}</div>
      </div>
    </div>
  )
}

export default Banner
