import { Input as MuiInput } from '@mui/joy'
import React from 'react'

function Input({ ...props }) {
  return (
    <MuiInput
      className="min-h-[50px] border-slate-200 placeholder:text-slate-400"
      {...props}
    />
  )
}

export default Input
