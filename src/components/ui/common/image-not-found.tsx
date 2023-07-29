import Image from 'next/image';
import React from 'react';

import NotFound from '@/assets/images/image-not-found.jpg';

const ImageNotFound = () => {
  return (
    <Image
      className="w-full h-full object-cover"
      alt="image-not-found"
      src={NotFound}
      quality={40}
    />
  )
}

export default ImageNotFound
