import ImageNotFound from './image-not-found'
import NotFound from '@/assets/images/image-not-found.jpg'
import clsx from 'clsx'
import Image, { ImageProps } from 'next/image'
import React from 'react'

type SafeNumber = number | `${number}`

type Props = {
  className?: string
  media?: string[]
}

function FxImage({
  className,
  src,
  alt,
  height,
  width,
  sizes,
  media,
  referrerPolicy,
  ...props
}: Props & ImageProps) {
  if (media && media.length === 0 && !src) {
    return <ImageNotFound />
  }

  return (
    <Image
      width={width ?? '0'}
      height={height ?? '0'}
      sizes={sizes ?? '100vw'}
      className={clsx('w-full bg-slate-100', className)}
      alt={alt}
      // priority={true}
      src={media && media.length > 0 ? (media[0] as string) : src}
      referrerPolicy="no-referrer"
      onError={() => <ImageNotFound />}
      {...props}
    />
  )
}

export default FxImage
