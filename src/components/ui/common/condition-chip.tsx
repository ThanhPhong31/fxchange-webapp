import { WithClassName } from '@/types/common'
import { Chip, ChipProps } from '@mui/joy'
import { useMediaQuery } from '@mui/material'
import React from 'react'
import colors from 'tailwindcss/colors'

interface ConditionChipProps extends WithClassName, ChipProps {
  value?: number
}

const ConditionChip = ({ value = 0, className, ...props }: ConditionChipProps) => {
  const isMobile = useMediaQuery('(max-width:768px)')
  const labels = {
    unknown: 'Chưa cập nhập',
    old: 'Có thể sửa chữa',
    medium: 'Còn sử dụng tốt',
    nearlyNew: 'Hàng sưu tầm',
    new: 'Hàng hiếm',
  }

  const bgColors: { [key: string]: string } = {
    unknown: colors.gray[200],
    old: colors.amber[800],
    nearlyOld: colors.yellow[600],
    medium: colors.blue[600],
    nearlyNew: colors.lime[600],
    new: colors.emerald[600],
  }

  let label = labels.unknown
  let bgColor = bgColors.unknown
  if (value > 0 && value <= 20) {
    label = labels.old
    bgColor = bgColors.old
  } else if (value > 20 && value <= 40) {
    label = labels.medium
    bgColor = bgColors.medium
  } else if (value > 40 && value <= 60) {
    label = labels.medium
    bgColor = bgColors.medium
  } else if (value > 60 && value <= 80) {
    label = labels.nearlyNew
    bgColor = bgColors.nearlyNew
  } else if (value > 80) {
    label = labels.new
    bgColor = bgColors.new
  }

  return (
    <Chip
      size={isMobile ? 'sm' : 'md'}
      className={className}
      style={{
        backgroundColor: bgColor,
      }}
      {...props}
    >
      {label}
    </Chip>
  )
}

export default ConditionChip
