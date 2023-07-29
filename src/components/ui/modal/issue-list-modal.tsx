import HandleIssueModal from './handle-issue-modal'
import { TransactionIssue } from '@/types/model'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'
import { Spin } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'

type Props = {
  issueList: TransactionIssue[]
  isOpen: boolean
  onClose: () => void
  setLoadingPage: Dispatch<SetStateAction<boolean>>
}

function IssueListModal({ isOpen, issueList, onClose, setLoadingPage }: Props) {
  const [handleIssueModal, setHandleIssueModal] = useState(false)
  const [transactionIssueId, setTransactionIssueId] = useState('')
  const openSubmitIssusHandleModal = (transactionIssueId: string) => {
    onClose()
    setLoadingPage(true)
    setTimeout(function () {
      setLoadingPage(false)
      setHandleIssueModal(true)
      setTransactionIssueId(transactionIssueId)
    }, 1000)
  }

  return (
    <>
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
            <div className="p-5">
              <div className="font-semibold text-xl">
                <span>Danh sách các vấn đề cần giải quyết</span>
              </div>
              <div className="mt-4 mb-4">
                <hr />
              </div>
              <div className="text-base m-2">
                {issueList.map((item, index) => (
                  <div
                    key={item.id}
                    className="m-4"
                  >
                    {item.issue_solved ? (
                      <div className="p-2 px-4 border border-green-500 rounded-md text-green-500 opacity-60">
                        {item.issue} (Đã được giải quyết.)
                      </div>
                    ) : (
                      <div
                        className="p-2 px-4 border border-purple-500 rounded-md text-purple-500 cursor-pointer hover:opacity-70"
                        onClick={() => openSubmitIssusHandleModal(item.id)}
                      >
                        {item.issue} (Chưa được giải quyết.)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ModalDialog>
        </ModalOverflow>
      </Modal>

      <HandleIssueModal
        transactionIssueId={transactionIssueId}
        isOpen={handleIssueModal}
        onClose={() => setHandleIssueModal(false)}
      />
    </>
  )
}

export default IssueListModal
