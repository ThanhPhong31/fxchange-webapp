import { Skeleton } from 'antd';
import React from 'react';

import cn from '@/libs/utils';
import { inter } from '@/pages/_app';

import Logo from '../common/logo';

const HeaderSkeleton = () => {
  return (
    <header className={cn('bg-white border-b', inter.className)}>
      <div className="max-w-full px-4 mx-auto relative flex items-center justify-between py-2">
        <div className="flex items-center max-lg:gap-4">
          <div className="hidden max-lg:block">
            <Skeleton.Avatar
              shape="square"
              active
              className="w-[30px] aspect-square rounded-lg"
            />
          </div>
          <Logo className="cursor-pointer" />
        </div>
        <div className="flex-1 h-full max-md:hidden">
          <Skeleton.Input
            active
            className="absolute flex items-center p-1 ml-2 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 max-lg:hidden max-w-[400px] !w-full !rounded-full max-md:hidden"
          />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton.Avatar
            active
            size={40}
          />
          <Skeleton.Avatar
            active
            size={40}
          />
        </div>
      </div>
    </header>
  )
}

export default HeaderSkeleton
