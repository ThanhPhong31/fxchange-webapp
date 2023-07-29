import FormGroup from '../../form/form-group'
import MuiDebounceInput from '../../form/mui/mui-debounce-input'
import MuiDebounceTextarea from '../../form/mui/mui-debounce-textarea'
import FxImage from '../fx-image'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import {
  CreateStuffQuery,
  GetCategoryList,
  GetTypeList,
  UpdateStuffQuery,
} from '@/graphql/queries/stuff-query'
import { AUCTION_DURATIONS, CONDITIONS } from '@/libs/constants'
import { listDataUrlToFileList } from '@/libs/image.util'
import { isAuction, isIncludePrice } from '@/libs/utils'
import { Stuff, StuffCategory, StuffTag, StuffType } from '@/types/model'
import { PictureFilled, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Input, Option, Select, Textarea } from '@mui/joy'
import { Modal, Spin, Tooltip, Upload, UploadFile, UploadProps } from 'antd'
import { RcFile } from 'antd/es/upload'
import { ErrorMessage, Form, Formik, FormikValues } from 'formik'
import _, { isNumber } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'

type Tag = {
  tag_slug: string
  value: String
}

export interface StuffInput {
  author_id: string
  name: string
  type: string
  description: string
  category: string
  condition: number
  custom_fields: {
    price?: number
    step?: number
    initial_price?: number
    duration?: number | null
  }
  payment_type: string
  media?: File[]
  tags?: Tag[]
}

export interface UpdateStuffInput {
  stuff_id: string | null | undefined
  author_id: string
  name?: string
  type?: string
  description?: string
  category?: string
  condition?: number
  custom_fields?: {
    price?: number
    step?: number
    duration?: number | null
  }
  media?: File[]
  tags?: Tag[]
  delete_media?: string[]
  payment_type?: string
}

export type SelectChangeHandler = (newValue: string | null, name: string) => void

type AddNewStuffHandlerProps = {
  name: string
  userId: string
  category: string
  condition: number
  description: string
  payment_type: string
  media: File[]
  type: string
  tags: Tag[]
  custom_fields: {
    price?: number
    step_price?: number
    duration?: number
  }
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

// validate information: name, price, type...
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Vui lòng nhập tên sản phẩm')
    .min(5, 'Tên vật phẩm cần có ít nhất 5 kí tự')
    .max(100, 'Tên vật phẩm không nên quá dài'),
  description: Yup.string().max(1000, 'Mô tả không nên dài hơn 1000 ký tự'),
  type: Yup.string().required('Vui lòng chọn hình thức'),
  category: Yup.string().required('Vui lòng chọn phân loại'),
  condition: Yup.number().min(20, 'Vui lòng chọn tình trạng').required('Vui lòng chọn tình trạng'),
  tag: Yup.array().of(
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
  custom_fields: Yup.object().shape({
    payment_type: Yup.string()
      .nullable()
      .test({
        test: function (value) {
          const values = this.options.context
          if (['market', 'auction'].includes(values?.type) && !values?.custom_fields.payment_type) {
            return false
          }

          return true
        },
      }),
    price: Yup.string()
      .required('Vui lòng nhập giá')
      .test({
        message: 'Giá cần phải lớn hơn hoặc bằng 10.000 đồng',
        test: function (value) {
          const values = this.options.context

          if (
            values?.custom_fields.price &&
            values?.custom_fields.price < 10000 &&
            values.custom_fields.payment_type === 'money'
          ) {
            return false
          }

          return true
        },
      })
      .test({
        message: 'Vui lòng nhập từ 5-1000 điểm',
        test: function (value) {
          const values = this.options.context

          if (
            values?.custom_fields.price &&
            (values?.custom_fields.price < 5 || values?.custom_fields.price > 1000) &&
            values.custom_fields.payment_type === 'point'
          ) {
            return false
          }

          return true
        },
      })
      .test({
        message: 'Vui lòng nhập giá',
        test: function (value) {
          const values = this.options.context

          if (['market', 'auction'].includes(values?.type) && !values?.custom_fields.price) {
            return false
          }

          return true
        },
      }),
    // auction price step
    step_price: Yup.string()
      .required('Vui lòng nhập bước giá')
      .test({
        message: 'Bước giá cần lớn hơn 0',
        test: function (value) {
          const values = this.options.context
          if (
            values?.custom_fields.price &&
            values?.custom_fields.step_price &&
            values?.custom_fields.step_price < 1 &&
            values.custom_fields.payment_type === 'money'
          ) {
            return false
          }
          return true
        },
      })
      .test({
        message: 'Bước giá cần lớn hơn 0',
        test: function (value) {
          const values = this.options.context

          if (
            values?.custom_fields.price &&
            values?.custom_fields.step_price &&
            values?.custom_fields.step_price < 1 &&
            values.custom_fields.payment_type === 'point'
          ) {
            return false
          }

          return true
        },
      })
      .test({
        message: 'Vui lòng nhập bước giá',
        test: function (value) {
          const values = this.options.context

          if (['auction'].includes(values?.type) && !values?.custom_fields.step_price) {
            return false
          }

          return true
        },
      }),
    duration: Yup.string().test({
      message: 'Vui lòng chọn thời gian đấu giá',
      test: function (value) {
        const values = this.options.context
        const convertedValue = _.toInteger(value)
        if (
          ['auction'].includes(values?.type) &&
          (!values?.custom_fields.duration || !isNumber(convertedValue))
        ) {
          return false
        }

        return true
      },
    }),
  }),
})

function AddNewStuff({
  onFinished,
  isStored,
  stuff,
  mode = 'add',
  setHasData,
  onClose,
}: {
  onFinished?: () => void
  onClose?: () => void
  isStored?: boolean
  stuff?: Stuff | null
  mode?: 'edit' | 'add'
  setHasData: (status: boolean) => void
}) {
  const [createStuff, { data: createdStuff, loading, error, called }] =
    useMutation(CreateStuffQuery)
  const [
    updateStuff,
    {
      data: updatedStuff,
      loading: loadingOnUpdateStuff,
      error: errorOnUpdateStuff,
      called: calledUpdateStuff,
    },
  ] = useMutation(UpdateStuffQuery)
  const {
    data: typesData,
    loading: typeListLoading,
    error: typeListError,
  } = useQuery<{ types: StuffType[] }>(GetTypeList)
  const {
    data: categoriesData,
    loading: categoryListLoading,
    error: categoryListError,
  } = useQuery<{ categories: StuffCategory[] }>(GetCategoryList)

  const router = useRouter()
  const { messageApi, notify } = useApp()
  const { user } = useAuth()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  console.log('🚀 ~ file: index.tsx:271 ~ fileList:', fileList)
  const [initialFileList, setInitialFileList] = useState<UploadFile[]>([])
  const [deleteFile, setDeleteFile] = useState<string[]>()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const handleCancel = () => setPreviewOpen(false)
  const [current, setCurrent] = useState(0)

  const isLoadingEssentialData = useMemo(
    () =>
      loading ||
      typeListLoading ||
      categoryListLoading ||
      Boolean(categoryListError) ||
      Boolean(typeListError),
    [categoryListError, categoryListLoading, loading, typeListError, typeListLoading, loading]
  )
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }

  const handleChangeFiles: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setInitialFileList(newFileList)
  }

  useEffect(() => {
    if (stuff && stuff?.media && stuff?.media.length > 0) {
      const files = listDataUrlToFileList(stuff.media)
      setInitialFileList(files as UploadFile[])
    }
  }, [stuff])

  useEffect(() => {
    if (loadingOnUpdateStuff) {
      messageApi?.loading('Đang xử lí')
    }
  }, [messageApi, loadingOnUpdateStuff])

  useEffect(() => {
    const isCreateNew = mode === 'add' && !loading && createdStuff && called && !error
    const isEdit =
      mode === 'edit' &&
      !loadingOnUpdateStuff &&
      updatedStuff &&
      !errorOnUpdateStuff &&
      calledUpdateStuff
    if (isCreateNew || isEdit) {
      const title = mode === 'edit' ? 'Cập nhật thành công' : 'Đăng thành công'
      const description =
        mode === 'edit'
          ? 'Bạn đã cập nhật tin thành công'
          : 'Tin của bạn sẽ được quản trị viên kiểm duyệt trong thời gian sớm nhất'
      notify({
        type: 'success',
        title: title,
        description: description,
        duration: 5000,
      })
      return onFinished && onFinished()
    }

    if (error || errorOnUpdateStuff) {
      notify({
        type: 'error',
        title: 'Đã xảy ra lỗi',
        description: 'Chưa thể thực hiện hành động này ngay lúc này.',
        duration: 5000,
      })
      return
    }
  }, [
    loading,
    createdStuff,
    error,
    messageApi,
    onFinished,
    called,
    mode,
    loadingOnUpdateStuff,
    updatedStuff,
    errorOnUpdateStuff,
    calledUpdateStuff,
    notify,
  ])

  const handleChange = useCallback((info: any) => {
    const acceptedFiles = info.fileList.filter((file: any) => file.status !== 'error')
    setFileList(acceptedFiles)
  }, [])

  const initUpdateMedia = (initialFileList: UploadFile[]): File[] => {
    const resultFile: File[] = initialFileList
      .filter((file) => !file.hasOwnProperty('url'))
      .map((file) => file.originFileObj as File)

    return resultFile
  }

  const handleRemove = (info: any) => {
    if (info.hasOwnProperty('url')) {
      setDeleteFile((pre = []) => [...pre, info.url])
    }
  }

  const uploadProps: UploadProps = {
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
      if (!messageApi) return console.error('Message API not supported')
      if (!acceptedFormats) {
        messageApi.error('Sai định dạng file, hãy kiểm tra lại!')
      } else if (fileList.length >= 5) {
        messageApi.error('Số lượng file tải lên không vượt quá giới hạn 5 files!')
      } else {
        messageApi.success('Tải file thành công.')
      }
      return acceptedFormats && fileList.length < 5 ? file : Upload.LIST_IGNORE
    },
    onChange: handleChange,
  }

  const handleSubmit = async (values: FormikValues) => {
    const convertedFiles = fileList.map((file: UploadFile) => file.originFileObj as File)

    if (mode === 'add') {
      handleAddNewStuff(
        {
          name: values.name,
          userId: user?.uid as string,
          category: values.category,
          condition: values.condition,
          custom_fields: values.custom_fields,
          description: values.description,
          payment_type: values.custom_fields.payment_type,
          type: values.type,
          media: convertedFiles,
          tags: values.tag,
        },
        () => {
          setFileList([])
        }
      )
    } else {
      if (!stuff)
        return notify({
          type: 'error',
          title: 'Xảy ra lỗi',
          description: 'Không thể cập nhật món đồ này',
        })
      const updateFileList = initUpdateMedia(initialFileList)

      const updatedStuff: UpdateStuffInput = {
        stuff_id: stuff.id,
        author_id: user?.uid as string,
      }

      if (updateFileList.length > 0) updatedStuff.media = updateFileList
      if (deleteFile?.length) updatedStuff.delete_media = deleteFile

      if (values.name !== initialValues.name) updatedStuff.name = values.name

      if (values.description !== initialValues.description)
        updatedStuff.description = values.description

      if (values.type !== initialValues.type) updatedStuff.type = values.type

      if (values.condition !== initialValues.condition) updatedStuff.condition = values.condition

      if (values.category !== initialValues.category) updatedStuff.category = values.category

      if (values.custom_fields.payment_type !== initialValues.custom_fields.payment_type) {
        updatedStuff.payment_type = values.custom_fields.payment_type
      }

      if (values.custom_fields.price !== initialValues.custom_fields.price) {
        if (!updatedStuff.custom_fields) {
          updatedStuff.custom_fields = {}
        }
        updatedStuff.custom_fields.price = _.toNumber(values.custom_fields.price)
      }

      if (values.custom_fields.step_price !== initialValues.custom_fields.step_price) {
        if (!updatedStuff.custom_fields) {
          updatedStuff.custom_fields = {}
        }
        updatedStuff.custom_fields.step = _.toNumber(values.custom_fields.step_price)
      }

      if (
        values.custom_fields.duration !== initialValues.custom_fields.duration &&
        values.custom_fields.duration !== ''
      ) {
        if (!updatedStuff.custom_fields) {
          updatedStuff.custom_fields = {}
        }
        updatedStuff.custom_fields.duration = _.toInteger(values.custom_fields.duration)
      }

      for (let i = 0; i < values.tag.length; i++) {
        if (
          (values.tag[i].value !== '' && initialValues.tag.length == 0) ||
          (values.tag[i].value !== '' && initialValues.tag[i] === values.tag[i].value)
        ) {
          if (!updatedStuff.tags) updatedStuff.tags = []
          const newTag: Tag = {
            tag_slug: values.tag[i].tag_slug,
            value: values.tag[i].value,
          }
          updatedStuff.tags.push(newTag)
        }
      }

      try {
        updateStuff({
          variables: {
            input: updatedStuff,
          },
        })
        setDeleteFile([])
      } catch (error) {
        console.log({ error })
      }
    }
  }

  const handleAddNewStuff = (
    {
      name,
      userId,
      condition,
      category,
      description,
      type,
      media,
      payment_type,
      tags,
      custom_fields,
    }: AddNewStuffHandlerProps,
    callback?: () => void
  ) => {
    const stuffInput: StuffInput = {
      name: name,
      author_id: userId,
      category: category,
      condition: condition,
      custom_fields: {},
      description: description,
      payment_type: payment_type,
      type: type,
      media: media,
      tags: tags,
    }

    if (isIncludePrice(type)) {
      stuffInput.custom_fields.price = _.toNumber(custom_fields?.price)
    }

    if (isAuction(type)) {
      stuffInput.custom_fields.step = _.toNumber(custom_fields?.step_price)
      stuffInput.custom_fields.duration = _.toNumber(custom_fields?.duration)
    }

    if (stuffInput.media?.length === 0) {
      return notify({
        type: 'warning',
        title: 'Chưa thể đăng tin',
        description: 'Hãy thêm ít nhất một ảnh hoặc video để thu hút mọi người.',
      })
    }

    try {
      createStuff({
        variables: {
          input: stuffInput,
        },
      })
      if (callback) callback()
      setFileList([])
    } catch (error) {
      console.log({ error })
    }
  }

  if (isLoadingEssentialData || loadingOnUpdateStuff) {
    return (
      <div className="h-[300px] w-full">
        <Spin spinning></Spin>
      </div>
    )
  }

  const initialValues = {
    media: stuff?.media ? listDataUrlToFileList(stuff.media) : [],
    name: stuff?.name || '',
    description: stuff?.description || '',
    type: stuff?.type?.slug || '',
    category: stuff?.category?.slug || '',
    condition: stuff?.condition || 0,
    tag: stuff?.tags || [],
    custom_fields: {
      price: stuff?.price || 0,
      step_price: stuff?.auction?.step_price || 0,
      duration: stuff?.auction?.duration || 0,
      payment_type: stuff?.payment_type?.slug || null,
      start_automatically: true,
    },
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  //create stuff form
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, handleChange, errors, dirty, isValid }) => {
        console.log('🚀 ~ file: index.tsx:693 ~ values:', values)
        const additionFields = {
          size: false,
          price: false,
          auction: false,
        }

        if (values.category === 'clothes') {
          additionFields.size = true
        }

        if (['market', 'auction'].includes(values.type as string)) {
          additionFields.price = true
        }

        if (values.type === 'auction') {
          additionFields.auction = true
        }

        return (
          <div>
            {current === 0 && (
              <>
                <div className="flex justify-between">
                  <div className="flex items-center text-base font-semibold text-slate-900">
                    {mode === 'add' ? 'Đăng tin' : 'Cập nhật tin'}
                  </div>
                  <div></div>
                </div>
                <div className="flex flex-col justify-between max-w-md gap-3 mx-auto mt-4 items-between">
                  <FormGroup
                    label="Hình thức"
                    error={errors.type}
                    name="type"
                    className="flex flex-col flex-1"
                  >
                    <Select
                      disabled={isLoadingEssentialData || loadingOnUpdateStuff}
                      color="neutral"
                      id="type"
                      name="type"
                      value={values.type}
                      onChange={(e, value) => {
                        setFieldValue('type', value)
                        setFieldValue('custom_fields.price', 0)
                        setFieldValue('custom_fields.payment_type', 'point')
                        setFieldValue('custom_fields.step_price', 0)
                        setFieldValue('custom_fields.duration', '')
                      }}
                    >
                      <Option
                        value=""
                        disabled
                      >
                        Vui lòng chọn
                      </Option>
                      {((typesData && typesData.types) || [])
                        .filter((type) => {
                          if (isStored) return type.slug === 'archived'
                          return true
                        })
                        .map((type) => (
                          <Option
                            key={type.id}
                            value={type.slug}
                          >
                            {type.name}
                          </Option>
                        ))}
                    </Select>
                  </FormGroup>
                  <FormGroup
                    label="Phân loại"
                    error={errors.category}
                    name="category"
                    className="flex flex-col flex-1"
                  >
                    <Select
                      disabled={isLoadingEssentialData || loadingOnUpdateStuff}
                      id="category"
                      name="category"
                      value={values.category}
                      onChange={(e, value) => {
                        setFieldValue('category', value)
                        if (value === 'clothes') {
                          setFieldValue('tag.0.tag_slug', 'size')
                          setFieldValue('tag.0.value', '')
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
                  </FormGroup>
                </div>
                <div className="flex items-center justify-end mt-6 max-md:justify-normal">
                  <Button
                    className="min-w-[150px] max-md:w-full"
                    color="neutral"
                    variant="plain"
                    onClick={onClose}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="min-w-[150px]  max-md:w-full"
                    color="info"
                    disabled={
                      !values.category ||
                      values.category.trim() === '' ||
                      !values.type ||
                      values.type.trim() === ''
                    }
                    onClick={() => setCurrent(1)}
                  >
                    Tiếp tục
                  </Button>
                </div>
              </>
            )}
            {current === 1 && (
              <Form className="font-medium">
                <div className="flex justify-between">
                  <div className="flex items-center text-base font-semibold text-slate-900">
                    {mode === 'add' ? 'Đăng tin' : 'Cập nhật tin'}
                  </div>
                  <div></div>
                </div>
                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-3">
                  <div className="mt-2">
                    {mode == 'add' && (
                      <>
                        {values.type === 'auction' && (
                          <div className="p-3">
                            <ul className="list-disc">
                              <li className="text-sm !font-normal font-sans text-gray-600">
                                Ảnh vật phẩm đấu giá cần chụp chung với{' '}
                                <Tooltip
                                  title="What is Name tag?"
                                  className="font-medium"
                                >
                                  Name Tag
                                </Tooltip>
                                , đầy đủ họ tên và ngày đăng.
                              </li>
                              <li className="text-sm !font-normal font-sans text-gray-600">
                                Nếu thiếu sẽ không được duyệt
                              </li>
                            </ul>
                          </div>
                        )}
                        <Upload.Dragger
                          {...uploadProps}
                          defaultFileList={fileList}
                          height={fileList.length === 0 ? 300 : 150}
                          disabled={isLoadingEssentialData || loadingOnUpdateStuff}
                          maxCount={5}
                        >
                          <p className="mb-2 text-5xl text-gray-300">
                            <PictureFilled />
                          </p>
                          <p className="font-sans text-sm ant-upload-text">Thêm ảnh / video</p>
                          <p className="font-sans text-sm ant-upload-hint">Tối đa 5 file</p>
                        </Upload.Dragger>
                      </>
                    )}
                    {mode == 'edit' && (
                      <>
                        <Upload
                          maxCount={5}
                          listType="picture-card"
                          fileList={initialFileList}
                          onChange={handleChangeFiles}
                          onRemove={handleRemove}
                          onPreview={handlePreview}
                          disabled={loadingOnUpdateStuff}
                        >
                          {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        <Modal
                          zIndex={2000}
                          open={previewOpen}
                          title={previewTitle}
                          footer={null}
                          onCancel={handleCancel}
                        >
                          <FxImage
                            alt="example"
                            className="w-full"
                            src={previewImage}
                          />
                        </Modal>
                      </>
                    )}
                  </div>
                  <div className="mt-2">
                    <FormGroup
                      error={errors.name}
                      name="name"
                      label="Tên món đồ"
                    >
                      <MuiDebounceInput
                        id="name"
                        defaultValue={values.name}
                        name="name"
                        disabled={isLoadingEssentialData || loadingOnUpdateStuff}
                        onChange={(e) => {
                          setFieldValue('name', e.target.value)
                        }}
                        placeholder="Vui lòng nhập tên món đồ"
                      />
                    </FormGroup>
                    <FormGroup
                      error={errors.condition}
                      name="category"
                      label="Tình trạng"
                    >
                      <Select
                        disabled={isLoadingEssentialData || loadingOnUpdateStuff}
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
                    </FormGroup>
                    <FormGroup
                      label="Mô tả"
                      name="description"
                      error={
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="mt-1 ml-2 font-sans text-sm font-normal text-red-600"
                        />
                      }
                    >
                      <MuiDebounceTextarea
                        minRows={4}
                        disabled={isLoadingEssentialData || loadingOnUpdateStuff}
                        id="description"
                        name="description"
                        defaultValue={values.description}
                        onChange={(e) => setFieldValue('description', e.target.value)}
                        placeholder="Một số mô tả về món đồ của bạn"
                      />
                    </FormGroup>
                    <div className="mt-2">
                      {additionFields.size && (
                        <FormGroup
                          error={
                            <ErrorMessage
                              name="tag.0.value"
                              component="div"
                              className="mt-1 ml-2 font-sans text-sm font-normal text-red-600"
                            />
                          }
                          label="Kích thước"
                          name="tag.size"
                        >
                          <Select
                            id="tag.0.size"
                            name="tag.0.size"
                            disabled={isLoadingEssentialData || loadingOnUpdateStuff}
                            value={values.tag[0] ? (values.tag[0] as { value?: string }).value : ''}
                            onChange={(e, value) => {
                              setFieldValue('tag.0.tag_slug', 'size')

                              setFieldValue('tag.0.value', value)
                            }}
                          >
                            <Option value="">Vui lòng chọn</Option>
                            <Option value="XXS">XXS</Option>
                            <Option value="XS">XS</Option>
                            <Option value="S">S</Option>
                            <Option value="M">M</Option>
                            <Option value="L">L</Option>
                            <Option value="XL">XL</Option>
                            <Option value="XXL">XXL</Option>
                          </Select>
                        </FormGroup>
                      )}
                      {additionFields.price && (
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <FormGroup
                              error={
                                <ErrorMessage
                                  name="custom_fields.price"
                                  component="div"
                                  className="mt-1 ml-2 font-sans text-sm font-normal text-red-600"
                                />
                              }
                              label={additionFields.auction ? 'Giá khởi điểm' : 'Giá bán'}
                              name="custom_fields.price"
                              className="w-1/2"
                            >
                              <MuiDebounceInput
                                disabled={isLoadingEssentialData || loadingOnUpdateStuff}
                                id="custom_fields.price"
                                name="custom_fields.price"
                                type="number"
                                defaultValue={values.custom_fields.price}
                                onFocus={(e) => {
                                  e.target.select()
                                }}
                                onChange={(e) =>
                                  setFieldValue('custom_fields.price', e.target.value)
                                }
                                placeholder="Vui lòng nhập giá"
                              />
                            </FormGroup>
                            <FormGroup
                              error={errors.custom_fields?.payment_type}
                              label="Đơn vị"
                              name=""
                              className="w-1/2"
                            >
                              <Select
                                disabled={isLoadingEssentialData || loadingOnUpdateStuff}
                                id="custom_fields.payment_type"
                                name="custom_fields.payment_type"
                                onChange={(e, value) => {
                                  setFieldValue('custom_fields.payment_type', value)
                                }}
                                defaultValue="point"
                                value={values.custom_fields.payment_type}
                              >
                                <Option value="money">Tiền mặt</Option>
                                <Option value="point">Điểm</Option>
                              </Select>
                            </FormGroup>
                          </div>
                        </div>
                      )}
                      {additionFields.auction && (
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <FormGroup
                              label="Bước Giá"
                              name="custom_fields.step_price"
                              error={
                                <ErrorMessage
                                  name="custom_fields.step_price"
                                  component="div"
                                  className="mt-1 ml-2 font-sans text-sm font-normal text-red-600"
                                />
                              }
                              className="w-1/2"
                            >
                              <MuiDebounceInput
                                disabled={
                                  isLoadingEssentialData ||
                                  loadingOnUpdateStuff ||
                                  !values.custom_fields.price
                                }
                                id="custom_fields.step_price"
                                name="custom_fields.step_price"
                                defaultValue={values.custom_fields.step_price}
                                onChange={(e) => {
                                  setFieldValue('custom_fields.step_price', e.target.value)
                                }}
                                onFocus={(e) => {
                                  e.target.select()
                                }}
                                type="number"
                                placeholder="Vui lòng nhập bước giá"
                              />
                            </FormGroup>
                            <FormGroup
                              error={
                                <ErrorMessage
                                  name="custom_fields.duration"
                                  component="div"
                                  className="mt-1 ml-2 font-sans text-sm font-normal text-red-600"
                                />
                              }
                              label="Thời lượng"
                              name="custom_fields.duration"
                              className="w-1/2"
                            >
                              <Select
                                disabled={isLoadingEssentialData || loadingOnUpdateStuff}
                                id="custom_fields.duration"
                                name="custom_fields.duration"
                                value={values.custom_fields.duration}
                                onChange={(e, value) => {
                                  console.log('🚀 ~ file: index.tsx:1021 ~ value:', value)
                                  if (value) setFieldValue('custom_fields.duration', value)
                                }}
                              >
                                <Option
                                  value="0"
                                  disabled
                                >
                                  Chọn thời lượng
                                </Option>
                                {AUCTION_DURATIONS.map((ad, index) => (
                                  <Option
                                    value={ad.value}
                                    key={index + '.' + ad.value}
                                  >
                                    {ad.label}
                                  </Option>
                                ))}
                              </Select>
                            </FormGroup>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-6 max-md:justify-normal">
                  <Button
                    className="min-w-[150px] max-md:w-full"
                    color="neutral"
                    variant="plain"
                    onClick={() => setCurrent(0)}
                  >
                    Trở lại
                  </Button>
                  <Button
                    // disabled={!isValid}
                    className="min-w-[150px]  max-md:w-full"
                    color="info"
                    loading={loading || isLoadingEssentialData || loadingOnUpdateStuff}
                    type="submit"
                  >
                    {mode === 'add' ? 'Đăng ngay' : 'Cập nhật'}
                  </Button>
                </div>
              </Form>
            )}
          </div>
        )
      }}
    </Formik>
  )
}

export default AddNewStuff
