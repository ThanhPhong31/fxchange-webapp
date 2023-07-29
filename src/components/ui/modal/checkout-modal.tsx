import { Stuff } from '@/types/model'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'
import React from 'react'
import CheckOut from '../common/CheckoutForm'
type Props = {
    isOpen: boolean
    onClose: () => void
    stuff?: Stuff | null
  }
function CheckoutModal({ isOpen, onClose, stuff }: Props) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      // sx={{
      //   zIndex: 900,
      // }}
    >
      <ModalOverflow>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          className="!min-w-[600px]"
          layout="center"
        >
          <ModalClose />
          <CheckOut/>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

export default CheckoutModal