import AddNewStuff from '../common/AddNewStuffForm'
import { Stuff } from '@/types/model'
import { Button, Modal, ModalClose, ModalDialog, ModalOverflow, Typography } from '@mui/joy'
import { ImageIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

type AddingModalProps = {
  open: boolean
  onClose: () => void
  layout?: 'center' | 'fullscreen'
  stuff?: Stuff | null
  onFinish?: () => void
}

function AddingModal({
  open = false,
  onClose,
  layout = 'center',
  stuff,
  onFinish,
}: AddingModalProps) {
  console.log('🚀 ~ file: update-modal.tsx:23 ~ stuff:', stuff)
  const router = useRouter()
  useEffect(() => {
    const handleUnload = () => {
      if (open) return 'Thông tin của món đồ nhập chưa được lưu. Bạn có chắc chắn muốn thoát?'
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [open])

  const [hasData, setHasData] = useState(false)
  const handleCloseModal = () => {
    const isConfirm = confirm(
      'Bạn có chắc chắn muốn thoát? Thông tin của món đồ nhập chưa được lưu.'
    )
    if (!isConfirm) return
    onClose()
  }

  return (
    <Modal
      open={!!open}
      onClose={() => {
        handleCloseModal()
      }}
      sx={{
        zIndex: 900,
      }}
    >
      <ModalOverflow>
        <ModalDialog
          className="!max-w-[800px] w-full"
          aria-labelledby="layout-modal-title"
          aria-describedby="layout-modal-description"
          layout={layout}
        >
          <ModalClose />
          <AddNewStuff
            setHasData={setHasData}
            onClose={() => {
              handleCloseModal()
            }}
            stuff={stuff}
            mode={stuff ? 'edit' : 'add'}
            onFinished={() => {
              onClose()
              if (onFinish) onFinish()
              // if (router.basePath === '') router.reload()
            }}
          />
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

export default AddingModal
