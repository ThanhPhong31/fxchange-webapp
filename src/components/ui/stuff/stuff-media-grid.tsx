import ImageNotFound from '../common/image-not-found'
import cn from '@/libs/utils'
import { WithClassName } from '@/types/common'
import { Button } from '@mui/joy'
import { Carousel } from 'antd'
import { Grid } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export interface StuffMediaGridProps extends WithClassName {
  media: string[]
  alt: string
  height?: number
}

const StuffMediaGrid = ({ media, alt, height, className }: StuffMediaGridProps) => {
  return (
    <div className={cn(className)}>
      <Carousel
        rootClassName="w-full"
        className="w-full h-full"
        draggable
      >
        {media.length > 0 ? (
          media.map((img, index) => {
            const className = cn(
              'object-cover object-center rounded-xl max-h-[500px] h-full max-md:max-h-[400px] bg-slate-200 !w-full cursor-pointer'
            )
            return (
              <div
                key={index}
                className="w-full h-full"
                // onClick={() => handlePreviewImage(img, stuff?.name)}
                // className={cn('hover:brightness-75 cursor-pointer transition-all ', className)}
              >
                <Image
                  src={img}
                  alt={alt}
                  className={className}
                  width={800}
                  height={500}
                  referrerPolicy="no-referrer"
                />
              </div>
            )
          })
        ) : (
          <ImageNotFound />
        )}
      </Carousel>
    </div>
  )
}

export default StuffMediaGrid
