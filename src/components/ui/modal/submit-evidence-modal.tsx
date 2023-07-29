import SubmitEvidenceForm, { TransactionEvidenceInput } from '../form/submit-evidence-form'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: TransactionEvidenceInput) => void
}

function SubmitEvidenceModal({ isOpen, onClose, onSubmit }: Props) {
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
          <SubmitEvidenceForm
            onFinished={() => onClose()}
            onSubmit={onSubmit}
          />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

export default SubmitEvidenceModal
