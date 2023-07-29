import React from 'react';

import { Stuff } from '@/types/model';
import { Modal, ModalClose, ModalDialog, ModalOverflow, Typography } from '@mui/joy';

import QuicklyExchangeStuff from '../common/QuicklyExchangeForm';

type Props = {
  isOpen: boolean
  onClose: () => void
  stuff?: Stuff | null
  onFinish: () => void
}

function QuicklyExchangeModal({ isOpen, onClose, stuff, onFinish }: Props) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        zIndex: 90,
      }}
    >
      <ModalOverflow>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          className="!min-w-[600px]"
          layout="center"
        >
          <ModalClose />
          <QuicklyExchangeStuff
            stuff={stuff}
            onFinished={onFinish}
          />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

export default QuicklyExchangeModal
