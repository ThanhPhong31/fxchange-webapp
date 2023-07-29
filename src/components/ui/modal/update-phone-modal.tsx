import UpdatePhoneForm from '../form/update-phone-form'
import { useApp } from '@/contexts/app-context'
import { Modal } from 'antd'
import React, { useState } from 'react'

const UpdatePhoneModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { notify } = useApp()

  return (
    <Modal
      open={open}
      footer={[]}
      style={{
        padding: 3,
      }}
      onCancel={onClose}
    >
      <UpdatePhoneForm
        onSuccess={() => {
          onClose()
          notify({
            title: 'Thêm số điện thoại thành công.',
            type: 'success',
          })
        }}
      />
    </Modal>
  )
}

export default UpdatePhoneModal
