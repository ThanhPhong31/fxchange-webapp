import AddNewStuff from '../common/AddNewStuffForm'
import { Stuff } from '@/types/model'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'
import { Spin } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type AddingModalProps = {
  open: boolean
  onClose: () => void
  isStored?: boolean
  layout?: 'center' | 'fullscreen'
  stuff?: Stuff | null
  onFinish?: () => void
}

function AddingModal({
  open = false,
  onClose,
  isStored,
  layout = 'center',
  stuff,
  onFinish,
}: AddingModalProps) {
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
        zIndex: 100,
      }}
    >
      <ModalOverflow>
        <ModalDialog
          className="!max-w-[800px] w-full"
          aria-labelledby="layout-modal-title"
          aria-describedby="layout-modal-description"
          layout={layout}
        >
          <ModalClose sx={{ zIndex: 50 }} />
          <AddNewStuff
            isStored={isStored}
            setHasData={setHasData}
            stuff={stuff}
            mode={stuff ? 'edit' : 'add'}
            onClose={() => {
              handleCloseModal()
            }}
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
