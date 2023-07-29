import type { ModalProps } from '@/types/props'
import { AlertCircle } from 'lucide-react';
import React from 'react';

import { Warning } from '@mui/icons-material';
import { Box, Button, Divider, Modal, ModalDialog, Typography } from '@mui/joy';

const AlertModal = ({ open, onClose, title, description, onConfirm }: ModalProps) => {
  return (
    <Modal
      open={open}
      onClose={() => onClose()}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: '16px',
          overflow: 'hidden',
        }}
      >
        <div>
          {title && (
            <Typography
              id="alert-dialog-modal-title"
              component="h2"
            >
              {title}
            </Typography>
          )}
          {description && (
            <Typography
              id="alert-dialog-modal-description"
              textColor="text.tertiary"
            >
              {description}
            </Typography>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 mt-3">
          <Button
            variant="plain"
            size="md"
            color="neutral"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            variant="solid"
            color="info"
            size="md"
            onClick={onConfirm}
          >
            Xác nhận
          </Button>
        </div>
      </ModalDialog>
    </Modal>
  )
}

export default AlertModal
