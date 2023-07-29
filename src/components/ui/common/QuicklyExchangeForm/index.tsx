import MemoField from '../MemoField'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import {
  CreateQuicklyExchangeStuffMutation,
  CreateStuffQuery,
  GetCategoryList,
} from '@/graphql/queries/stuff-query'
import { CONDITIONS } from '@/libs/constants'
import { Stuff, StuffCategory, Tag } from '@/types/model'
import { InboxOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Input, Option, Select, Textarea } from '@mui/joy'
import { message, Upload, UploadFile, UploadProps } from 'antd'
import { ErrorMessage, Form, Formik, FormikValues } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'

type Props = {
  stuff?: Stuff | null
  onFinished: () => void
}

type QuicklyStuffInput = {
  stuff_id: string
  author_id: string
  name: string
  category: string
  condition: number
  media?: File[]
  tags?: Tag[]
}

function QuicklyExchangeStuff({ stuff, onFinished }: Props) {
  const { notifySuccess, notifyError, notify } = useApp()
  const { user } = useAuth()
  const [fileList, setFileList] = useState<File[]>([])
  const [
    createQuicklyExchangeStuff,
    { data: createdQuicklyExchangeStuffData, loading, error, called },
  ] = useMutation(CreateQuicklyExchangeStuffMutation)
  const {
    data: categoriesData,
    loading: categoryListLoading,
    error: categoryListError,
  } = useQuery<{ categories: StuffCategory[] }>(GetCategoryList)
  const isLoading = useMemo(
    () => loading || categoryListLoading || Boolean(categoryListError),
    [categoryListError, categoryListLoading, loading]
  )

  useEffect(() => {
    const isCreateSuccess = createdQuicklyExchangeStuffData && !error && !loading && called
    if (isCreateSuccess) {
      onFinished()
      setFileList([])
      notify({ type: 'success', title: 'Thêm nhanh thành công' })
    }

    if (error) {
      notify({
        type: 'error',
        title: 'Xảy ra lỗi trong quá trình thêm mới. Vui lòng thử lại sau.',
      })
    }
  }, [
    called,
    createdQuicklyExchangeStuffData,
    error,
    loading,
    notify,
    notifyError,
    notifySuccess,
    onFinished,
  ])

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
      console.log({ fileList })
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
    disabled: isLoading,
  }
  const initialValues = {
    stuffId: stuff ? stuff.id : '',
    media: [],
    name: '',
    category: '',
    condition: 0,
    tags: [],
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập tên sản phẩm'),
    category: Yup.string().required('Vui lòng chọn phân loại'),
    condition: Yup.number()
      .min(20, 'Vui lòng chọn tình trạng')
      .required('Vui lòng chọn tình trạng'),
    tags: Yup.array().of(
      Yup.object().shape({
        value: Yup.string().test({
          message: 'Vui lòng chọn kích thước',
          test: function (value) {
            if (!this?.options.context) return false
            if (
              this?.options?.context.category &&
              this?.options?.context.category === 'clothes' &&
              !value
            ) {
              return false
            }

            return true
          },
        }),
      })
    ),
  })

  const conditions = [
    {
      value: 20,
      label: 'Rất cũ',
    },
    { value: 40, label: 'Cũ' },
    { value: 60, label: 'Ổn' },
    { value: 80, label: 'Mới' },
    { value: 100, label: 'Rất mới' },
  ]

  const handleSubmit = useCallback(
    async (values: FormikValues) => {
      if (loading) return
      if (!user?.uid)
        return notify({
          type: 'error',
          title: 'Không thể thêm mới',
          description: 'Bạn cần phải đăng nhập để thực hiện hành động này',
        })

      if (fileList.length > 5)
        return notify({
          type: 'error',
          title: 'Số lượng ảnh vượt quá mức.',
          description: 'Vui lòng thêm tối đa 5 ảnh.',
        })
      const quicklyStuffInput: QuicklyStuffInput = {
        stuff_id: values.stuffId,
        author_id: user?.uid,
        name: values.name,
        media: fileList,
        condition: values.condition,
        category: values.category,
        tags: values.tags,
      }

      if (quicklyStuffInput.media?.length === 0) {
        return notify({
          type: 'warning',
          title: 'Chưa thể đăng tin',
          description: 'Hãy thêm ít nhất một ảnh hoặc video để thu hút mọi người.',
        })
      }

      try {
        createQuicklyExchangeStuff({
          variables: {
            input: quicklyStuffInput,
          },
        })
      } catch (error) {
        console.log({ error })
      }
    },
    [createQuicklyExchangeStuff, fileList, loading, notify, user?.uid]
  )
  /* Quick exchange form */
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors }) => {
          const additionFields = {
            size: false,
            price: false,
            auction: false,
          }
          if (values.category === 'clothes') {
            additionFields.size = true
          }

          return (
            <Form className="font-medium">
              {/* ----- Header Form ----- */}
              <div className="flex justify-between">
                <div className="flex items-center text-base font-semibold text-slate-900">
                  Trao đổi nhanh
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
              {/* ----- Details Input ----- */}
              <div className="mt-6">
                {/* --- Stuff Name --- */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label htmlFor="name">Tên món đồ</label>
                  </div>
                  <div className="mt-2">
                    <Input
                      disabled={isLoading}
                      id="name"
                      value={values.name}
                      name="name"
                      onChange={(e) => {
                        setFieldValue('name', e.target.value)
                      }}
                      placeholder="Vui lòng nhập tên món đồ"
                    />
                  </div>
                </div>
                {errors.name && <div className="mt-1 ml-2 text-sm text-red-600">{errors.name}</div>}
                <div className="flex flex-col flex-1">
                  <div className="">
                    <div className="mb-2">
                      <label htmlFor="category">Phân loại</label>
                    </div>
                    <MemoField>
                      <Select
                        disabled={isLoading}
                        id="category"
                        name="category"
                        value={values.category}
                        onChange={(e, value) => {
                          setFieldValue('category', value)
                          if (value === 'clothes') {
                            setFieldValue('tags.0.tag_slug', 'size')
                            setFieldValue('tags.0.value', '')
                          }
                        }}
                      >
                        <Option
                          value=""
                          disabled
                        >
                          Vui lòng chọn
                        </Option>
                        {((categoriesData && categoriesData.categories) || []).map((cate: any) => (
                          <Option
                            key={cate.id}
                            value={cate.slug}
                          >
                            {cate.name}
                          </Option>
                        ))}
                      </Select>
                    </MemoField>
                  </div>
                  {errors.category && (
                    <div className="mt-1 ml-2 text-sm text-red-600">{errors.category}</div>
                  )}
                </div>
                {additionFields.size && (
                  <div>
                    <div className="mt-4">
                      <label
                        className="mb-3"
                        htmlFor="tags.size"
                      >
                        Kích thước
                      </label>
                      <div className="relative">
                        <MemoField>
                          <Select
                            id="tags.0.size"
                            name="tags.0.size"
                            value={
                              values.tags[0] ? (values.tags[0] as { value?: string }).value : ''
                            }
                            onChange={(e, value) => setFieldValue('tags.0.value', value)}
                            className="w-full p-2 text-sm font-normal border rounded-md appearance-none border-1 text-slate-900"
                          >
                            <Option value="">Vui lòng chọn</Option>
                            <Option value="XXL">XXL</Option>
                            <Option value="XL">XL</Option>
                            <Option value="L">L</Option>
                            <Option value="M">M</Option>
                            <Option value="S">S</Option>
                            <Option value="XS">XS</Option>
                            <Option value="XXS">XXS</Option>
                          </Select>
                        </MemoField>
                        <ErrorMessage
                          name="tags.0.value"
                          component="div"
                          className="mt-1 ml-2 text-sm text-red-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* --- Stuff Conditions --- */}
                <div className="mt-6">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  ></div>
                  <div className="mb-2">
                    <label htmlFor="category">Tình trạng</label>
                  </div>
                  <div className="relative mt-2">
                    <MemoField>
                      <Select
                        disabled={isLoading}
                        id="condition"
                        name="condition"
                        value={values.condition}
                        onChange={(e, value) => setFieldValue('condition', value)}
                        placeholder="Vui lòng chọn"
                      >
                        <Option
                          value="0"
                          disabled
                        >
                          Vui lòng chọn
                        </Option>
                        {CONDITIONS.map((c, index) => (
                          <Option
                            value={c.value}
                            key={index + '.' + c.value}
                          >
                            {c.label}
                          </Option>
                        ))}
                      </Select>
                    </MemoField>
                  </div>
                </div>
                {errors.condition && (
                  <div className="mt-1 ml-2 text-sm text-red-600">{errors.condition}</div>
                )}
              </div>
              {/* -----Submit Button ----- */}
              <div className="mt-16">
                <Button
                  fullWidth
                  color="info"
                  loading={loading}
                  type="submit"
                  disabled={isLoading}
                >
                  Đăng
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default QuicklyExchangeStuff
