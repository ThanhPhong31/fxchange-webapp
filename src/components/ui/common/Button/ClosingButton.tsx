import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/joy/Button'
import React from 'react'

type Props = {
  cusBg?: string
}

function ClosingButton({ cusBg }: Props) {
  const closingHandle = () => {
    alert('Closing clicked')
  }
  return (
    <Button
      onClick={closingHandle}
      sx={{
        background: cusBg ? cusBg : '#E2E8F0',
        color: 'black !important',
        border: 'solid #E2E8F0 1px',
        borderRadius: '50%',
        '&:hover': {
          background: '#E2E8F0',
        },
        padding: '6px',
      }}
    >
      <CloseIcon />
    </Button>
  )
}

export default ClosingButton
