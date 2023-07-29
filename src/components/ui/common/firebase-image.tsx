/* eslint-disable @next/next/no-img-element */
import cn from '@/libs/utils'
import NotFoundPage from '@/pages/404'
import { WithClassName } from '@/types/common'
import React from 'react'

export interface FirebaseImageProps extends WithClassName {
  src?: string
  alt?: string
}

const FirebaseImage = ({ alt, src, className }: FirebaseImageProps) => {
  return (
    <>
      {!!src ? (
        <img
          className={cn('object-cover w-full h-full', className)}
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
        />
      ) : (
        <NotFoundPage />
      )}
    </>
  )
}

export default FirebaseImage
