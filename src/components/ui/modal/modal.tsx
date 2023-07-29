import { ModalProps } from '@/types/props'
import { Check, Dangerous, Info, Warning } from '@mui/icons-material'
import { Box, Button, Divider, Modal as MuiModal, ModalDialog, Typography } from '@mui/joy'
import React from 'react'

type ModalVariant = 'success' | 'info' | 'warning' | 'danger'

interface Props extends ModalProps {
  variant?: ModalVariant | null
  body?: React.ReactNode
}

const Modal = ({ onClose, open, onConfirm, title, description, variant, body }: Props) => {
  const icons: { [key: string]: React.ReactNode } = {
    success: <Check />,
    info: <Info />,
    warning: <Warning />,
    danger: <Dangerous />,
  }

  return (
    <MuiModal
      open={open}
      onClose={() => onClose()}
      sx={{
        zIndex: 100,
      }}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
      >
        {title && (
          <Typography
            id="alert-dialog-modal-title"
            component="h2"
            startDecorator={variant ? icons[variant] : null}
          >
            {title}
          </Typography>
        )}
        <Divider />
        {description && (
          <Typography
            id="alert-dialog-modal-description"
            textColor="text.tertiary"
          >
            {description}
          </Typography>
        )}
        {body && body}
      </ModalDialog>
    </MuiModal>
  )
}

export default Modal
