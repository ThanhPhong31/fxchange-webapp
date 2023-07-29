import NotFoundPage from '../404'
import MemoField from '@/components/ui/common/MemoField'
import CenterContainer from '@/components/ui/common/center-container'
import TransactionStepperExchangeDetail from '@/components/ui/transaction/transaction-detail/steppers/exchange'
import TransactionStepperMarketDetail from '@/components/ui/transaction/transaction-detail/steppers/market'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import transactionQuery, { UserRequestCancelMutation } from '@/graphql/queries/transaction-query'
import { TransactionStatus } from '@/libs/constants'
import { NextPageWithLayout } from '@/pages/_app'
import { TransactionGraphQLResponse } from '@/types/common'
import { User } from '@/types/model'
import { useLazyQuery, useMutation } from '@apollo/client'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import {
  Button,
  CircularProgress,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Textarea,
} from '@mui/joy'
import { fontSize } from '@mui/system'
import { Image, Input, Radio, Space, Spin } from 'antd'
import { Form, Formik, FormikValues } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { text } from 'stream/consumers'
import * as Yup from 'yup'

type Transaction = {
  id: string
  customer: User | null
  author: {
    id: string
    information: {
      full_name: string
      phone: string
    }
  }
  stuff: {
    id: string
    name: string
    price: number
    media: string
    category: string
  }
  pickup_date: string
  status: string
}

type Reason = {
  issue: string
}

type UserRequestCancel = {
  transaction_id: string
  issue: string
}

const TransactionDetailPage: NextPageWithLayout = () => {
  const [loadingPage, setLoadingPage] = useState(false)
  const [
    getTransaction,
    { data: transactionData, loading: loadOnGetTransaction, error: errorOnGetTransaction },
  ] = useLazyQuery<TransactionGraphQLResponse>(transactionQuery.findByID(), {
    fetchPolicy: 'network-only',
  })
  const router = useRouter()
  const [openModal, setOpenModal] = useState(false)
  const { user, isValidating } = useAuth()
  const { notifySuccess, notifyError } = useApp()
  const [
    userRequestCancel,
    {
      data: userRequestCancelResponse,
      loading: loadingUserRequestCancel,
      error: errorUserRequestCancel,
      called,
    },
  ] = useMutation(UserRequestCancelMutation)

  useEffect(() => {
    const transactionId = router.query.transactionId
    if (transactionId)
      getTransaction({
        variables: {
          id: transactionId,
        },
      })
  }, [getTransaction, router.query])

  useEffect(() => {
    if (loadingUserRequestCancel && !userRequestCancelResponse) {
      setOpenModal(false)
      setLoadingPage(true)
    } else if (!loadingUserRequestCancel && userRequestCancelResponse) {
      setTimeout(function () {
        setLoadingPage(false)
        window.location.reload()
      }, 1000)
    }
  }, [loadingUserRequestCancel])

  useEffect(() => {
    if (userRequestCancelResponse && !errorUserRequestCancel && called) {
      notifySuccess('Giao dịch đã được hủy bỏ.')
    } else if (
      userRequestCancelResponse &&
      !errorUserRequestCancel &&
      called &&
      transaction?.status === TransactionStatus.WAIT
    ) {
      notifySuccess(
        'Yêu cầu hủy bỏ giao dịch của bạn đã được gửi đi, chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.'
      )
    } else if (errorUserRequestCancel) {
      notifyError('Hủy giao dịch thất bại, giao dịch không thể hủy bỏ.')
      setLoadingPage(false)
    }
  }, [errorUserRequestCancel, userRequestCancelResponse, called, notifySuccess, notifyError])

  if (loadOnGetTransaction) {
    return (
      <CenterContainer>
        <CircularProgress />
      </CenterContainer>
    )
  }

  const initialValues = {
    issue: '',
    otherIssue: '',
  }

  const validationSchema = Yup.object().shape({
    issue: Yup.string().required('Vui lòng nhập lý do.'),
  })

  const handleSubmit = async (values: FormikValues) => {
    let issueOfReason = ''

    if (values.issue === '1') {
      issueOfReason = 'Tôi muốn thay đổi hình thức giao dịch.'
    } else if (values.issue === '2') {
      issueOfReason = 'Tôi tìm thấy vật phẩm khác phù hợp hơn.'
    } else if (values.issue === '3') {
      issueOfReason = 'Tôi tìm thấy người giao dịch khác tốt hơn.'
    } else if (values.issue === '4') {
      issueOfReason = 'Tôi không cần món đồ này nữa.'
    } else if (values.issue === '5') {
      issueOfReason = values.otherIssue
    } else if (values.issue === '6') {
      issueOfReason = 'Tôi không muốn giao dịch món đồ này nữa.'
    }

    const UserRequestCancel: UserRequestCancel = {
      transaction_id: transaction?.id || '',
      issue: issueOfReason || '',
    }

    try {
      userRequestCancel({
        variables: {
          input: UserRequestCancel,
        },
      })
    } catch (error) {
      setOpenModal(false)
      console.log({ error })
    }
  }

  const transaction = transactionData?.transaction

  if (!transaction || (!user && !isValidating)) return <NotFoundPage />

  return (
    <div>
      <Spin
        spinning={loadingPage}
        delay={500}
        size="large"
      >
        <div className="flex justify-between p-5 border-2 rounded-md">
          <div>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => router.push('/transactions')}
            >
              <ArrowBackIosIcon />
              <span className="uppercase">quay lại</span>
            </Button>
          </div>
          <div className="text-base">
            <span>MÃ GIAO DỊCH: {transaction.id}</span>
            <span className="m-2">|</span>

            {transaction.status === TransactionStatus.WAIT ? (
              <span className="text-purple-500">ĐƠN HÀNG ĐANG TẠM DỪNG</span>
            ) : transaction.status === TransactionStatus.COMPLETED ? (
              <span className="text-green-500">GIAO DỊCH ĐÃ HOÀN THÀNH</span>
            ) : transaction.status === TransactionStatus.ONGOING ? (
              <span className="text-blue-500">GIAO DỊCH ĐANG TIẾN HÀNH</span>
            ) : transaction.status === TransactionStatus.PENDING ? (
              <span className="text-yellow-500">GIAO DỊCH ĐANG ĐƯỢC XỬ LÍ</span>
            ) : (
              <span className="text-red-500">GIAO DỊCH ĐÃ BỊ HỦY</span>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-3/12">
            {/* {transaction.stuff.type?.slug === 'market' ? (
              <TransactionStepperMarketDetail
                status={transaction.status}
                isPickup={transaction.is_pickup}
              />
            ) : transaction.stuff.type?.slug === 'exchange' ? (
              <TransactionStepperExchangeDetail
                status={transaction.status}
                isPickup={transaction.is_pickup}
              />
            ) : (
              <div></div>
            )} */}

            <TransactionStepperMarketDetail
              status={transaction.status}
              isPickup={transaction.is_pickup}
            />
          </div>
          <div className="relative w-9/12 mt-1 ml-1 border-2 rounded-md p-7">
            <span className="text-lg">
              Người đăng bán: {transaction.stuff_owner?.information.full_name || 'Chưa xác định'}
            </span>
            <div className="flex mt-3">
              <div>
                <Image
                  className="object-cover border rounded-2xl"
                  alt={transaction.stuff?.name}
                  width={200}
                  height={200}
                  src={transaction.stuff.media?.[0]}
                />
              </div>
              <div className="mt-4 ml-4">
                <span className="block text-base">{transaction.stuff.name}</span>
                <span className="block mt-2 text-sm text-slate-500">
                  {transaction.stuff.description}
                </span>
                <div className="block mt-2 text-sm text-slate-500">Tags is here</div>
              </div>
            </div>
            <div className="mt-4">
              <hr className="border-1" />
            </div>
            <div className="flex justify-between mx-10 mt-5">
              {transaction.stuff.type?.slug === 'market' ? (
                <>
                  <span className="block text-lg">Tổng: </span>
                  <span className="block text-lg">{transaction.stuff.price}</span>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="absolute bottom-24 right-5">
              {!(transaction.status === TransactionStatus.CANCELED) &&
              !(transaction.status === TransactionStatus.COMPLETED) &&
              !(transaction.status === TransactionStatus.WAIT) ? (
                <Button
                  color="danger"
                  size="md"
                  variant="solid"
                  fullWidth
                  onClick={() => {
                    setOpenModal(true)
                  }}
                >
                  Hủy giao dịch
                </Button>
              ) : (
                <></>
              )}

              <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
              >
                <ModalOverflow>
                  <ModalDialog
                    aria-labelledby="basic-modal-dialog-title"
                    aria-describedby="basic-modal-dialog-description"
                    className="!min-w-[600px]"
                    layout="center"
                  >
                    {/* <ModalClose /> */}
                    <Formik
                      initialValues={initialValues}
                      validationSchema={
                        transaction.status === TransactionStatus.ONGOING ? validationSchema : ''
                      }
                      validateOnBlur={true}
                      validateOnChange={false}
                      onSubmit={handleSubmit}
                    >
                      {({ values, setFieldValue, errors }) => {
                        return (
                          <Form>
                            <div className="p-5">
                              <div className="mb-6">
                                <label
                                  htmlFor="reason"
                                  className="text-xl font-semibold"
                                >
                                  Lý Do Hủy Bỏ Giao Dịch
                                </label>
                              </div>

                              {transaction.status === TransactionStatus.PENDING ? (
                                <div className="p-3 text-sm text-yellow-500 border border-yellow-500 rounded-lg">
                                  <p>
                                    Hủy bỏ giao dịch trong giai đoạn này, bạn sẽ bị trừ 10% số điểm
                                    tương ứng với giá của vật phẩm.
                                  </p>
                                </div>
                              ) : (
                                <div className="p-3 text-sm text-yellow-500 border border-yellow-500 rounded-lg">
                                  <p>
                                    Hủy bỏ giao dịch trong giai đoạn này, bạn sẽ bị trừ điểm tương
                                    ứng với chính sách của hệ thống.
                                  </p>
                                </div>
                              )}

                              <div className="mt-4 mb-10 text-base">
                                {user?.uid === transaction.stuff_owner?.id ? (
                                  <Radio.Group
                                    onChange={(e) => setFieldValue('issue', e.target.value)}
                                    value={values.issue}
                                  >
                                    <Space direction="vertical">
                                      <Radio
                                        style={{ fontSize: '18px', marginBottom: '10px' }}
                                        value={'1'}
                                      >
                                        Tôi muốn thay đổi hình thức giao dịch.
                                      </Radio>
                                      <Radio
                                        style={{ fontSize: '18px', marginBottom: '10px' }}
                                        value={'2'}
                                      >
                                        Tôi không muốn giao dịch món đồ này nữa.
                                      </Radio>

                                      <Radio
                                        value={'5'}
                                        style={{ fontSize: '18px', marginBottom: '10px' }}
                                      >
                                        Lý do khác
                                      </Radio>
                                      <MemoField>
                                        <Textarea
                                          id="reason"
                                          sx={{ width: '520px' }}
                                          disabled={values.issue !== '5'}
                                          name="reason"
                                          minRows={2}
                                          value={values.otherIssue}
                                          onChange={(e) =>
                                            setFieldValue('otherIssue', e.target.value)
                                          }
                                        />
                                      </MemoField>
                                    </Space>
                                  </Radio.Group>
                                ) : (
                                  <Radio.Group
                                    onChange={(e) => setFieldValue('issue', e.target.value)}
                                    value={values.issue}
                                  >
                                    <Space direction="vertical">
                                      <Radio
                                        style={{ fontSize: '18px', marginBottom: '10px' }}
                                        value={'1'}
                                      >
                                        Tôi muốn thay đổi hình thức giao dịch.
                                      </Radio>
                                      <Radio
                                        style={{ fontSize: '18px', marginBottom: '10px' }}
                                        value={'2'}
                                      >
                                        Tôi tìm thấy vật phẩm khác phù hợp hơn.
                                      </Radio>
                                      <Radio
                                        style={{ fontSize: '18px', marginBottom: '10px' }}
                                        value={'3'}
                                      >
                                        Tôi tìm thấy người giao dịch khác tốt hơn.
                                      </Radio>
                                      <Radio
                                        style={{ fontSize: '18px', marginBottom: '10px' }}
                                        value={'4'}
                                      >
                                        Tôi không cần món đồ này nữa.
                                      </Radio>

                                      <Radio
                                        value={'5'}
                                        style={{ fontSize: '18px', marginBottom: '10px' }}
                                      >
                                        Lý do khác
                                      </Radio>
                                      <MemoField>
                                        <Textarea
                                          id="reason"
                                          sx={{ width: '520px' }}
                                          disabled={values.issue !== '5'}
                                          name="reason"
                                          minRows={2}
                                          value={values.otherIssue}
                                          onChange={(e) =>
                                            setFieldValue('otherIssue', e.target.value)
                                          }
                                        />
                                      </MemoField>
                                    </Space>
                                  </Radio.Group>
                                )}
                              </div>

                              <div className="flex justify-around ">
                                <div className="w-6/12 mr-3">
                                  <Button
                                    className="!bg-slate-400 hover:!bg-slate-500"
                                    size="lg"
                                    fullWidth
                                    onClick={() => setOpenModal(false)}
                                  >
                                    THOÁT
                                  </Button>
                                </div>
                                <div className="w-6/12 ml-3">
                                  {values.issue && values.issue !== '5' ? (
                                    <Button
                                      className="!bg-red-500 hover:!bg-red-600"
                                      size="lg"
                                      fullWidth
                                      type="submit"
                                    >
                                      XÁC NHẬN HỦY
                                    </Button>
                                  ) : values.issue === '5' && values.otherIssue ? (
                                    <Button
                                      className="!bg-red-500 hover:!bg-red-600"
                                      size="lg"
                                      fullWidth
                                      type="submit"
                                    >
                                      XÁC NHẬN HỦY
                                    </Button>
                                  ) : (
                                    <Button
                                      className="!bg-red-500 hover:!bg-red-600 opacity-50"
                                      size="lg"
                                      fullWidth
                                      disabled={true}
                                      type="submit"
                                    >
                                      XÁC NHẬN HỦY
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Form>
                        )
                      }}
                    </Formik>
                  </ModalDialog>
                </ModalOverflow>
              </Modal>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default TransactionDetailPage
