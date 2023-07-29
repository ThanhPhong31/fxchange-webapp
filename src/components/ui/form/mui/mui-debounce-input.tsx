import { Input, InputProps } from '@mui/joy'
import React, { memo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

const MuiDebounceInput = ({ defaultValue, onChange, ...restProps }: InputProps) => {
  const debounce = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e),
    500
  )

  return (
    <Input
      defaultValue={defaultValue}
      onChange={debounce}
      {...restProps}
    />
  )
}

export default memo(MuiDebounceInput)
