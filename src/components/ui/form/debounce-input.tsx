import { Input, InputProps, InputTypeMap } from '@mui/joy'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface DebounceInputProps extends InputProps {}

const DebounceInput = ({ onChange, ...props }: DebounceInputProps) => {
  const debounced = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e)
  }, 500)

  return (
    <Input
      {...props}
      onChange={debounced}
    />
  )
}

export default DebounceInput
