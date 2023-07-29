import { Input, FormLabel, FormControl } from '@mui/joy'
import React, { memo } from 'react'

type Props = {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function NotMoneyDeviceCase({ handleInputChange }: Props) {
  return <div></div>
}

export default memo(NotMoneyDeviceCase)
