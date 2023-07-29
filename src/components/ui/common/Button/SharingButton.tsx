import { Share } from '@mui/icons-material'
import Button from '@mui/joy/Button'
import React from 'react'

type Props = {
  onclick: () => void
}

function SharingButton({ onclick }: Props) {
  return (
    <Button
      onClick={onclick}
      sx={{
        bgcolor: '#334155 !important',
        borderRadius: '50%',
        '&:hover': {
          opacity: 0.7,
        },
      }}
    >
      <Share />
    </Button>
  )
}

export default SharingButton
