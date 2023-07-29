import SubmitEvidenceForm, { TransactionEvidenceInput } from '../form/submit-evidence-form'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'

type Props = {
  isOpen: boolean
  onClose: () => void
}

function ConfirmOTPModal({ isOpen, onClose }: Props) {
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
          
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

export default ConfirmOTPModal
