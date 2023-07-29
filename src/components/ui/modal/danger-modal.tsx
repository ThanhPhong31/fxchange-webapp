import type { ModalProps } from '@/types/props'
import { Box, Button, Divider, Modal, ModalDialog, Typography } from '@mui/joy'
import { AlertCircle } from 'lucide-react'
import React from 'react'

const DangerModal = ({
  open,
  onClose,
  title,
  description,
  onConfirm,
  isLoading,
}: ModalProps & { isLoading?: boolean }) => {
  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      sx={{
        zIndex: 1005,
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
            startDecorator={<AlertCircle />}
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
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button
            variant="plain"
            color="neutral"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            loading={isLoading}
            variant="solid"
            color="danger"
            onClick={onConfirm}
          >
            Xác nhận
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

export default DangerModal
