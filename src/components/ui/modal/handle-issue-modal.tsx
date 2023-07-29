import HandleIssueForm from '../form/handle-issue-form'
import { Transaction } from '@/types/model'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'
import { Spin } from 'antd'
import { Dispatch, SetStateAction, useState } from 'react'

type Props = {
  transactionIssueId: string
  isOpen: boolean
  onClose: () => void
}

function HandleIssueModal({ isOpen, transactionIssueId, onClose }: Props) {
  const [loadingPage, setLoadingPage] = useState(false)

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
          <ModalClose disabled={loadingPage} />
          <Spin
            spinning={loadingPage}
            delay={500}
            size="large"
          >
            <HandleIssueForm
              transactionIssueId={transactionIssueId}
              setLoadingPage={setLoadingPage}
            />
          </Spin>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

export default HandleIssueModal
