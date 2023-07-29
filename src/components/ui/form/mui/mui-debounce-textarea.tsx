import { Textarea, TextareaProps } from '@mui/joy'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'

const MuiDebounceTextarea = ({ defaultValue, onChange, ...restProps }: TextareaProps) => {
  const debounce = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange && onChange(e),
    500
  )

  return (
    <Textarea
      defaultValue={defaultValue}
      onChange={debounce}
      {...restProps}
    />
  )
}

export default MuiDebounceTextarea
