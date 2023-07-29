import { Skeleton } from 'antd'
import React from 'react'

const TableSkeleton = ({ repeat = 6 }: { repeat?: number }) => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: repeat }).map((_, index) => (
        <Skeleton.Button
          key={index}
          style={{ width: '100%' }}
          active
          block={true}
        />
      ))}
    </div>
  )
}

export default TableSkeleton
