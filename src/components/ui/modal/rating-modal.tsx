import CreateIssueForm from '../form/create-issue-form'
import { TransactionStatus } from '@/libs/constants'
import { Transaction } from '@/types/model'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'
import { Spin } from 'antd'
import { Dispatch, SetStateAction, useState } from 'react'
import RatingForm from '../form/rating-form'

type FeedBack = {
  id: string
  rating: number
  content: string
  transaction_id: string
  create_at: Date
  update_at: Date
}

type Props = {
  feedback: FeedBack
  x?: FeedBack
  isOpen: boolean
  onClose: () => void
  setIsChanged?: Dispatch<SetStateAction<boolean>>
}

function RatingModal({ isOpen, onClose, feedback, setIsChanged }: Props) {
  const [loadingPage, setLoadingPage] = useState(false)
  console.log(feedback)
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
            <RatingForm
              feedback={feedback}
              setLoadingPage={setLoadingPage}
              setIsChanged={setIsChanged}
              onClose={onClose}
            />
          </Spin>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

export default RatingModal
