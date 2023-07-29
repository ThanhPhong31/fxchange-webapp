import { Input, InputProps } from '@mui/joy'
import React, { memo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface Props<T> {
  defaultValue: string
  onChange: (e: T) => void
}

function DebounceINput<T>({ defaultValue, onChange, ...restProps }: Props<T>) {
  // const debounce = useDebouncedCallback(
  //   (e: React.ChangeEvent<T>) => onChange && onChange(e),
  //   500
  // )

  return (
    <Input
      defaultValue={defaultValue}
      // onChange={debounce}
      {...restProps}
    />
  )
}

export default memo(DebounceINput)
