import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import { Stuff } from '@/types/model'
import { InboxOutlined } from '@ant-design/icons'
import { Button } from '@mui/joy'
import { Upload, UploadFile, UploadProps } from 'antd'
import { Form, Formik, FormikValues } from 'formik'
import { useCallback, useState } from 'react'

export type TransactionEvidenceInput = {
  media?: File[]
}

type Props = {
  stuff?: Stuff | null
  onFinished: () => void
  onSubmit: (values: TransactionEvidenceInput) => void
}

function SubmitEvidenceForm({ onSubmit }: Props) {
  const { notifySuccess, notifyError, notify } = useApp()
  const { user } = useAuth()
  const [fileList, setFileList] = useState<File[]>([])

  const handleChange = useCallback((info: any) => {
    const acceptedFiles = info.fileList.filter((file: any) => file.status !== 'error')
    const convertedFiles = acceptedFiles.map((file: UploadFile) => file.originFileObj)
    setFileList(convertedFiles)
  }, [])

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture',
    accept: '.png,.jpg,.jpeg,.mp4',
    progress: {
      size: 'small',
      style: { top: 10 },
    },
    customRequest: (options) => {
      const { file, onProgress } = options

      const isImage = (file as File).type?.startsWith('image')
      const isVideo = (file as File).type?.startsWith('video')
      const acceptedFormats = isImage || isVideo

      if (acceptedFormats && onProgress) {
        let progress = 0
        const timer = setInterval(() => {
          progress += 10
          onProgress({ percent: progress })

          if (progress >= 100 && options.onSuccess) {
            clearInterval(timer)
            options.onSuccess('ok')
          }
        }, 100)
      } else if (acceptedFormats && options.onError) {
        options.onError(new Error('Invalid file format'))
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image')
      const isVideo = file.type.startsWith('video')
      const acceptedFormats = isImage || isVideo
      if (!acceptedFormats) {
        notify({ type: 'error', title: 'Sai định dạng file, hãy kiểm tra lại!' })
      } else if (fileList.length >= 5) {
        notify({ type: 'error', title: 'Số lượng file tải lên không vượt quá giới hạn 5 files!' })
      } else {
        notify({ type: 'success', title: 'Thêm file thành công.' })
      }
      return acceptedFormats && fileList.length < 5 ? file : Upload.LIST_IGNORE
    },
    onChange: handleChange,
    onDrop(e) {},
    // disabled: isLoading,
  }

  const initialValues = {
    media: [],
  }
  const handleSubmit = useCallback(
    async (values: FormikValues) => {
      if (!user?.uid) {
        return notify({
          type: 'error',
          title: 'Không thể thêm mới',
          description: 'Bạn cần phải đăng nhập để thực hiện hành động này',
        })
      }

      const input: TransactionEvidenceInput = {
        media: fileList,
      }

      if (input.media?.length === 0) {
        return notify({
          type: 'warning',
          title: 'Chưa thể đăng tin',
          description: 'Hãy thêm ít nhất một ảnh hoặc video để thu hút mọi người.',
        })
      }

      onSubmit(input)
    },
    [fileList, notify, onSubmit, user?.uid]
  )

  return (
    <>
      <Formik
        initialValues={initialValues}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form className="font-medium">
              {/* ----- Header Form ----- */}
              <div className="flex justify-between">
                <div className="flex items-center text-base font-semibold text-slate-900">
                  Cập nhật minh chứng
                </div>
                <div></div>
              </div>
              {/* ----- Upload File ----- */}
              <div className="mt-6">
                <Upload.Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Nhấn hoặc kéo file vào khu vực để tải file lên.</p>
                  <p className="ant-upload-hint">
                    Chỉ hỗ trợ các file dạng video hoặc hình ảnh, kiểm tra trước khi tải lên.
                  </p>
                </Upload.Dragger>
              </div>
              {/* -----Submit Button ----- */}
              <div className="mt-16">
                <Button
                  fullWidth
                  color="info"
                  // loading={loading}
                  type="submit"
                  // disabled={isLoading}
                >
                  Gửi
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default SubmitEvidenceForm
