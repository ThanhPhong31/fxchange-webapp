import CreateIssueForm from '../form/create-issue-form'
import { TransactionStatus } from '@/libs/constants'
import { Transaction } from '@/types/model'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'
import { Spin } from 'antd'
import { Dispatch, SetStateAction, useState } from 'react'

type Props = {
  transactionState: Transaction
  isExchange?: boolean
  isOpen: boolean
  onClose: () => void
}

function CreateIssueModal({ isOpen, onClose, transactionState, isExchange }: Props) {
  const [loadingPage, setLoadingPage] = useState(false)
  console.log(isExchange)
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
          className=""
          layout="center"
        >
          <Spin
            spinning={loadingPage}
            delay={500}
            size="large"
          >
            
            <CreateIssueForm
              transactionState={transactionState}
              isExchange={isExchange}
              setLoadingPage={setLoadingPage}
            />
          </Spin>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

export default CreateIssueModal
