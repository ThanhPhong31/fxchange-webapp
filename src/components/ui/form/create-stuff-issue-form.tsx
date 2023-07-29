import UserCard from '../common/user-card'
import { useApp } from '@/contexts/app-context'
import stuffIssueQuery from '@/graphql/queries/stuff-issue-query'
import { Stuff } from '@/types/model'
import { useMutation } from '@apollo/client'
import { FormLabel, IconButton, Textarea } from '@mui/joy'
import { Checkbox, ConfigProvider, Modal, Select, Spin } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import colors from 'tailwindcss/colors'

const CreateStuffIssueForm = ({ stuff, onCancel }: { stuff: Stuff; onCancel: () => void }) => {
  const { notify } = useApp()
  const [showDescription, setShowDescription] = useState(false)
  const reasonRef = useRef('')
  const [createStuffIssue, { data, loading, error }] = useMutation(
    stuffIssueQuery.createStuffIssue()
  )
  const descriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (data) {
      onCancel()
      notify({
        type: 'success',
        title: 'Gửi yêu cầu thành công.',
        duration: 6000,
      })
    }
  }, [data, onCancel])

  const handleSubmit = async () => {
    console.log('handleSubmit')

    if (descriptionRef.current) {
      const textarea = descriptionRef.current.querySelector('textarea')
      if (textarea) {
        reasonRef.current += '\n ' + textarea.value
      }
    }
    console.log({ reason: reasonRef.current })
    const sendData = {
      description: reasonRef.current,
      user_id: stuff.author.id,
      stuff_id: stuff.id,
    }

    await createStuffIssue({
      variables: {
        input: sendData,
      },
    })
  }

  const handleSelectReason = (e: CheckboxChangeEvent) => {
    const name = e.target.name
    if (e.target.checked) {
      if (name == 'other') {
        return setShowDescription(true)
      }

      reasonRef.current += '\n' + e.target.value
    } else {
      if (name == 'other') setShowDescription(false)
    }
  }
// create issue form
  return (
    <Modal
      open={Boolean(stuff)}
      onCancel={onCancel}
      closeIcon={<></>}
      okText="Gửi"
      onOk={handleSubmit}
      cancelText="Hủy"
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colors.zinc[900],
          },
        }}
      >
        <Spin spinning={loading}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Tạo yêu cầu sửa đổi</h3>
            <IconButton
              color="neutral"
              variant="plain"
              size="sm"
              onClick={onCancel}
            >
              <X size={20} />
            </IconButton>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <div>
              <FormLabel>Gửi đến</FormLabel>
              <UserCard
                avatarUrl={stuff?.author.information.avatar_url}
                username={stuff?.author.information.full_name}
              />
            </div>
            <div>
              <FormLabel>Cần chỉnh sửa vật phẩm</FormLabel>
              <UserCard
                avatarUrl={stuff?.media?.[0]}
                username={stuff?.name}
              />
            </div>
            <div>
              <FormLabel>Lí do</FormLabel>
              <div className="flex flex-col">
                <Checkbox
                  onChange={handleSelectReason}
                  value="Tên cần chi tiết hơn"
                >
                  Tên cần chi tiết hơn
                </Checkbox>
                <Checkbox
                  onChange={handleSelectReason}
                  value="Tên không hợp lệ"
                >
                  Tên không hợp lệ
                </Checkbox>
                <Checkbox
                  onChange={handleSelectReason}
                  value="Ảnh vi phạm chính sách cộng đồng"
                >
                  Ảnh vi phạm chính sách cộng đồng
                </Checkbox>
                <Checkbox
                  onChange={handleSelectReason}
                  value="Ảnh mờ"
                >
                  Ảnh mờ
                </Checkbox>
                <Checkbox
                  onChange={handleSelectReason}
                  value="other"
                  name="other"
                >
                  Lý do khác
                </Checkbox>
                {showDescription && (
                  <Textarea
                    className="mt-1 ml-6"
                    minRows={4}
                    placeholder="Lý do vật phẩm này cần sửa đổi"
                    ref={descriptionRef}
                  />
                )}
              </div>
            </div>
          </div>
        </Spin>
      </ConfigProvider>
    </Modal>
  )
}

export default CreateStuffIssueForm
