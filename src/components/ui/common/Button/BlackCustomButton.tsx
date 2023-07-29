import Button from '@mui/joy/Button'
import { styled } from '@mui/system'
import React, { FormEvent } from 'react'

const BlackButton = styled(Button)`
  width: 100%;
  color: #fff;
  background-color: black !important;
  &:hover {
    opacity: 0.7 !important;
  }
`

type Props = {
  onClick?: (() => void) | ((event: React.FormEvent<Element>) => Promise<void>)
  // onClick1?: () => void;
  content: string
  type?: 'button' | 'submit' | 'reset'
}

const BlackCustomButton = ({ onClick, content, type = 'button' }: Props) => {
  return (
    <BlackButton
      onClick={onClick}
      type={type ? type : 'button'}
    >
      {content}
    </BlackButton>
  )
}

export default BlackCustomButton
