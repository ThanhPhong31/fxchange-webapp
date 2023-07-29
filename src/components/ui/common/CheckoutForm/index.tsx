import SelectAddress from '../../../../pages/market/stored/SelectAddress'
import CenterContainer from '../center-container'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import stuffQuery, { CreateTransactionMutation } from '@/graphql/queries/stuff-query'
import transactionQuery from '@/graphql/queries/transaction-query'
import { StuffStatus } from '@/libs/constants'
import {
  apiGetPublicDistrict,
  apiGetPublicProvinces,
  apiGetPublicWard,
} from '@/services/auth.service'
import { Stuff } from '@/types/model'
import { useLazyQuery, useMutation } from '@apollo/client'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import HandshakeIcon from '@mui/icons-material/Handshake'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { FormLabel, Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'
import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Radio, { radioClasses } from '@mui/joy/Radio'
import RadioGroup from '@mui/joy/RadioGroup'
import Sheet from '@mui/joy/Sheet'
import { Image, Spin } from 'antd'
import { Form, Formik, FormikValues } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'

export interface Province {
  province_id: string
  province_name: string
  province_type: string
}

export interface District {
  district_id: string
  district_name: string
  district_type: string
  province_id: string
  [key: string]: any
}

export interface Ward {
  ward_id: string
  ward_name: string
  ward_type: string
  district_id: string
}

export interface Response<T> {
  data: {
    results: T[]
  }
}

function CheckOut() {
  const [loadingPage, setLoadingPage] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const [stuff, setStuff] = useState<Stuff | null>(null)
  const isLoadStuff = useRef(false)
  const [conditionStuff, setConditionStuff] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const { notifySuccess, notifyError } = useApp()
  const [getStuff, { data: stuffData }] = useLazyQuery(stuffQuery.getByID(), {
    fetchPolicy: 'cache-first',
  })
  const [startTransaction, { data, loading, error, called }] = useMutation(
    transactionQuery.startTransaction()
  )

  useEffect(() => {
    if (stuffData) {
      setStuff(stuffData.stuff)
    }
  }, [stuffData])

  useEffect(() => {
    const stuffId = router.query.stuffId
    if (stuffId) {
      getStuff({
        variables: {
          id: stuffId,
        },
      })
    }
  }, [getStuff, router, stuffData])

  useEffect(() => {
    if (data && !error && called) {
      notifySuccess('Yêu cầu mua vật phẩm của bạn đã được gửi đi.')
    } else if (error) {
      notifyError('Yêu cầu mua vật phẩm của bạn đã không được gửi đi. Vui lòng kiểm tra lại.')
      setLoadingPage(false)
    }
  }, [error, data, called, notifySuccess, notifyError])

  useEffect(() => {
    if (loading && !data) {
      setCheckoutOpen(false)
      setLoadingPage(true)
    } else if (!loading && data) {
      setTimeout(function () {
        setLoadingPage(false)
        window.location.href = '/transactions'
      }, 1000)
    }
  }, [data, loading])

  const initialValues = {
    customer_id: user?.uid || '',
    stuff_id: stuff?.id || '',
    author_id: stuff?.author.id || '',
    is_pickup: 'pickup',
  }

  const setCondition = (stuff: Stuff) => {
    if (stuff.condition === 100) setConditionStuff('Rất mới')
    else if (stuff.condition === 80) setConditionStuff('Mới')
    else if (stuff.condition === 60) setConditionStuff('Ổn')
    else if (stuff.condition === 40) setConditionStuff('Cũ')
    else if (stuff.condition === 20) setConditionStuff('Rất cũ')
  }

  const handleSubmit = () => {
    setCheckoutOpen(true)
  }

  const handleSuccess = async (values: FormikValues) => {
    const is_pickupTranslated = values.is_pickup === 'pickup' ? true : false
    const newTransaction = {
      stuff_id: stuff?.id,
      is_pickup: is_pickupTranslated,
    }
    try {
      const response = await startTransaction({
        variables: {
          stuff_id: stuff?.id,
          is_pickup: is_pickupTranslated,
          customer_id: user?.uid,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (stuff?.status === StuffStatus.SOLD)
    return (
      <CenterContainer>
        <h3>Ôi!! Sản phẩm này đã được bán.</h3>
      </CenterContainer>
    )
  //check out form
  return (
    <>
      <Spin
        spinning={loadingPage}
        delay={500}
        size="large"
      >
        <div className="flex justify-around">
          <div className="w-7/12">
            <Formik
              initialValues={initialValues}
              validateOnBlur={true}
              validateOnChange={false}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, errors }) => {
                return (
                  <Form>
                    <div className="p-5">
                      <span className="block text-3xl font-semibold text-center text-slate-900">
                        Thông tin vận chuyển
                      </span>

                      {/* Customer Name */}
                      <div className="flex items-center mt-6">
                        <div className="w-3/12 font-medium">
                          <label htmlFor="customerName">Tên của bạn:</label>
                        </div>
                        <div className="w-9/12">
                          <Input
                            id="name"
                            name="name"
                            value={user?.full_name || ''}
                            disabled
                          ></Input>
                        </div>
                      </div>

                      {/* Phương thức nhận hàng */}
                      <div className="mt-4 mb-14">
                        <div className="mb-2 font-medium">
                          <label>Phương thức nhận hàng</label>
                        </div>
                        <div className="mt-3">
                          <RadioGroup
                            aria-label="is_pickup"
                            defaultValue="pickup"
                            overlay
                            name="is_pickup"
                            sx={{
                              justifyContent: 'center',
                              flexDirection: 'column',
                              gap: 2,
                              [`& .${radioClasses.checked}`]: {
                                [`& .${radioClasses.action}`]: {
                                  inset: -1,
                                  border: '3px solid',
                                  borderColor: 'primary.500',
                                },
                              },
                              [`& .${radioClasses.radio}`]: {
                                display: 'contents',
                                '& > svg': {
                                  zIndex: 2,
                                  position: 'absolute',
                                  top: '-8px',
                                  right: '-8px',
                                  bgcolor: 'background.body',
                                  borderRadius: '50%',
                                },
                              },
                            }}
                            onChange={(e) => {
                              setFieldValue('is_pickup', e.target.value)
                            }}
                          >
                            <Sheet
                              id="pickup"
                              variant="outlined"
                              sx={{
                                borderRadius: 'md',
                                bgcolor: 'background.level1',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                minWidth: 300,
                                border: 'solid 2px #e2e8f0',
                                ':hover': {
                                  border: 'solid 2px rgb(0, 175, 185)',
                                },
                              }}
                            >
                              {/* Pick up at FxChange*/}
                              <Radio
                                id="pickup"
                                value="pickup"
                                checkedIcon={<CheckCircleRoundedIcon />}
                              />
                              <div className="p-2 mr-4 rounded bg-slate-200">
                                <HandshakeIcon />
                              </div>
                              <FormLabel htmlFor="pickup">Nhận tại quầy giao dịch</FormLabel>
                            </Sheet>
                            {/* <Sheet
                              id="ship"
                              variant="outlined"
                              sx={{
                                borderRadius: 'md',
                                bgcolor: 'background.level1',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                minWidth: 300,
                                border: 'solid 2px #e2e8f0',
                                // ':hover': {
                                //   border: 'solid 2px rgb(0, 175, 185)',
                                // },
                              }}
                            > */}
                              {/* Delivery by stuff owner*/}
                              {/* <Radio
                                id="ship"
                                value="ship"
                                disabled={true}
                                checkedIcon={<CheckCircleRoundedIcon />}
                              />
                              <div className="p-2 mr-4 rounded bg-slate-200">
                                <LocalShippingIcon />
                              </div>
                              <FormLabel htmlFor="ship">Giao hàng tận nơi</FormLabel>
                            </Sheet> */}
                          </RadioGroup>
                        </div>
                      </div>

                      <Button
                        className="bg-[#008c94] w-full"
                        type="submit"
                      >
                        Lên đơn
                      </Button>

                      <Modal
                        open={checkoutOpen}
                        onClose={() => setCheckoutOpen(false)}
                        className="max-md:!mx-3"
                      >
                        {/* transaction confirm */}
                        <ModalOverflow>
                          <ModalDialog
                            aria-labelledby="basic-modal-dialog-title"
                            aria-describedby="basic-modal-dialog-description"
                            className="!max-w-[500px] w-full !p-0 overflow-hidden"
                            layout="center"
                          >
                            <div className="p-3">
                              <div className="flex items-center justify-between">
                                <span className="block text-lg font-medium">
                                  Xác nhận giao dịch
                                </span>
                                <ModalClose />
                              </div>
                              <div className="flex mt-3">
                                <p className="block">Bạn chắc chắn muốn mua vật phẩm này ?</p>
                              </div>
                            </div>
                            <div className="flex justify-end w-full p-3 mt-6 border-t bg-gray-50">
                              <Button
                                className="max-md:flex-1"
                                variant="plain"
                                color="neutral"
                                onClick={() => {
                                  setCheckoutOpen(false)
                                }}
                              >
                                Hủy
                              </Button>
                              <Button
                                color="primary"
                                className="max-md:flex-1"
                                onClick={() => handleSuccess(values)}
                              >
                                Xác nhận
                              </Button>
                            </div>
                          </ModalDialog>
                        </ModalOverflow>
                      </Modal>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
          <div className="object-fill w-4/12 p-6 overflow-hidden bg-white border border-slate-300 rounded-2xl h-fit">
            <div className="flex">
              <div className="mr-4 rounded-lg">
                {stuff?.media && stuff?.media.length > 0 ? (
                  <Image
                    className="rounded-lg"
                    width={160}
                    src={stuff?.media[0]}
                    alt=""
                  />
                ) : (
                  <Image
                    className="rounded-lg"
                    width={160}
                    src="error"
                    alt=""
                    fallback="data:image/png;base64,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"
                  />
                )}
              </div>

              <div>
                <span className="block text-sm text-slate-500">
                  Tác giả: {stuff?.author.information.full_name}
                </span>
                <span className="block mt-1 text-base font-medium">{stuff?.name}</span>
                <span className="block mt-1 text-slate-500">Mô tả: </span>
                <span className="block text-sm">{stuff?.description}</span>
              </div>
            </div>
            <hr className="mt-6 mb-6" />
            <div>
              <span className="text-xl font-semibold">Chi tiết sản phẩm</span>
              <div className="flex justify-between mx-4 my-2">
                <span className="block font-medium">Tình trạng: </span>
                <span className="block">{conditionStuff}</span>
              </div>
              {stuff?.tags &&
                stuff.tags.map((item, index) => {
                  return (
                    <div
                      className="flex justify-between mx-4 my-2"
                      key={item.id}
                    >
                      <span className="block font-medium">{item.tag.name}:</span>
                      <span className="block">{item.value}</span>
                    </div>
                  )
                })}
            </div>
            <hr className="mt-6 mb-6" />
            <div className="flex justify-between text-base font-bold">
              <span className="block">Tổng:</span>
              <span className="block mr-4">{stuff?.price}</span>
            </div>
          </div>
        </div>
      </Spin>
    </>
  )
}

export default CheckOut
