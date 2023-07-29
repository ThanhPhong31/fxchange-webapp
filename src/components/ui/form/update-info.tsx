import ConfirmOTPModal from '../modal/confirm-otp-modal'
import { useApp } from '@/contexts/app-context'
import userQuery from '@/graphql/queries/user-query'
import { auth } from '@/libs/firebase'
import { User } from '@/types/model'
import { useMutation } from '@apollo/client'
import { Button, FormControl, FormLabel, Input } from '@mui/joy'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'
import { locale } from 'dayjs'
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { ErrorMessage, Form, Formik, FormikValues } from 'formik'
import { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import * as Yup from 'yup'

type Props = {
  user: User | null
}

const UpdateInfoForm = ({ user }: Props) => {
  const [isDeletedOtp, setIsDeletedOtp] = useState(false)
  const [confirmOTPResult, setConfirmOTPResult] = useState<ConfirmationResult | null>(null)
  const { messageApi } = useApp()
  const [
    updateInfo,
    { data: updatedInfoResult, loading: updatingInfo, error: errorOnUpdateInfo, called },
  ] = useMutation(userQuery.updateInfo())
  const { notifySuccess, notifyError } = useApp()
  const [currentInitialValues, setCurrentInitialValues] = useState({
    full_name: '',
    phone: '',
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [otp, setOtp] = useState('')
  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required('Tên không được để trống'),
    phone: Yup.string().test({
      message: 'Số điện thoại không hợp lệ',
      test: function (value) {
        const phoneNumberRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g

        if (value && !phoneNumberRegex.test(value)) {
          return false
        }

        return true
      },
    }),
  })

  const handleUpdatePhone = (inputedPhone: string) => {
    if (confirmOTPResult) {
      setIsOpen(true)
      return
    }

    const phoneNumberRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g
    if (inputedPhone && !phoneNumberRegex.test(inputedPhone)) {
      messageApi?.error('Số điện thoại không hợp lệ')
      return
    }

    const updatedPhone = inputedPhone.slice(1)

    const recaptchaVerifier = new RecaptchaVerifier(
      'get-otp',
      {
        size: 'invisible',
        callback: () => {
          console.log('Recaptca verified')
        },
        defaultCountry: 'VN',
      },
      auth
    )

    const phoneNumber = '+84' + updatedPhone
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        messageApi?.success('Đã gửi mã OTP')
        setConfirmOTPResult(confirmationResult)
        setTimeout(() => {
          setIsOpen(true)
        }, 1000)
      })
      .catch((error) => {
        console.log(error)
        if (error.code === 'auth/too-many-requests') {
          messageApi?.error('Bạn đã gửi só điện thoại này quá nhiều yêu cầu trong ngày')
        } else {
          messageApi?.error('Số điện thoại không tồn tại, vui lòng thử lại')
        }
      })
  }

  const onSubmitOTP = () => {
    if (!confirmOTPResult) return
    confirmOTPResult
      .confirm(otp)
      .then((result) => {
        console.log('🚀 ~ file: index.tsx:134 ~ .then ~ result:', result)
        setConfirmOTPResult(null)
      })
      .then(async () => {
        try {
          const response = await updateInfo({
            variables: {
              input: {
                information: {
                  phone: currentInitialValues.phone,
                },
              },
            },
          })
          if (response.data) {
            console.log(updatedInfoResult)
            setIsOpen(false)
          }
        } catch (error) {
          console.log({ error })
        }
      })
      .catch((error) => {
        messageApi?.error('Mã OTP không hợp lệ')
      })
  }

  useEffect(() => {
    if (isOpen === false) {
      setIsDeletedOtp(false)
      setOtp('')
    }
  }, [isOpen])

  useEffect(() => {
    if (user) {
      setCurrentInitialValues({
        full_name: user.full_name || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (updatedInfoResult && !errorOnUpdateInfo && called) {
      notifySuccess('Cập nhật thông tin thành công.')
    } else if (errorOnUpdateInfo) {
      notifyError('Cập nhật thông tin thất bại.')
    }
  }, [errorOnUpdateInfo, updatedInfoResult, called, notifySuccess, notifyError])

  const handleSubmit = async (values: FormikValues) => {
    console.log(values)
    try {
      const response = await updateInfo({
        variables: {
          input: {
            information: {
              full_name: 'Nhật Nam',
            },
          },
        },
      })
      if (response.data) {
        console.log(updatedInfoResult)
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const otpInputStyle = {
    borderBottom: `2px solid #dad7d7`,
    height: 40,
    width: 40,
    fontSize: 24,
    outline: 'none',
    textAlign: 'center' as const,
  }

  const otpCurrentInputStyle = {
    ...otpInputStyle,
    borderBottom: `2px solid #72b0eb`,
  }

  return (
    <Formik
      initialValues={currentInitialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors }) => (
        <>
          {/* <div className="mb-2">Hồ sơ cá nhân</div> */}
          <div className="p-4 border rounded-2xl">
            <div className="px-10 py-4">
              <Form>
                <FormControl>
                  <div className="flex items-center">
                    <div className="w-2/12 mr-1">
                      <FormLabel required>Tên</FormLabel>
                    </div>
                    <div className="w-10/12">
                      <Input
                        value={values.full_name}
                        type="text"
                        onChange={(e) => setFieldValue('full_name', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2/12 mr-1"></div>
                    <div className="w-10/12">
                      <ErrorMessage
                        name="full_name"
                        component="div"
                        className="mt-1 text-red-500"
                      />
                    </div>
                  </div>
                </FormControl>
                <div className="flex">
                  <div className="w-2/12"></div>
                  <div className="w-10/12">
                    {values.full_name && values.phone ? (
                      <Button
                        type="submit"
                        sx={{ marginTop: 2 }}
                        loading={updatingInfo}
                      >
                        Cập nhật
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        sx={{ marginTop: 2 }}
                        loading={updatingInfo}
                        disabled={true}
                      >
                        Cập nhật
                      </Button>
                    )}
                  </div>
                </div>
                <FormControl sx={{ marginTop: 2 }}>
                  <div className="flex items-center">
                    <div className="w-2/12 mr-1">
                      <FormLabel>Số điện thoại</FormLabel>
                    </div>
                    <div className="w-10/12">
                      <Input
                        value={values.phone}
                        type="text"
                        onChange={(e) => setFieldValue('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2/12 mr-1"></div>
                    <div className="w-10/12"></div>
                  </div>
                </FormControl>
                <div className="flex">
                  <div className="w-2/12"></div>
                  <div className="w-10/12">
                    {values.phone ? (
                      <Button
                        id="get-otp"
                        type="button"
                        sx={{ marginTop: 2 }}
                        onClick={() => {
                          handleUpdatePhone(values.phone)
                        }}
                        loading={isOpen}
                      >
                        Gửi mã OTP
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        sx={{ marginTop: 2 }}
                        disabled={true}
                      >
                        Gửi mã OTP
                      </Button>
                    )}
                  </div>
                </div>
              </Form>

              <Modal
                open={isOpen}
                onClose={() => setIsOpen(false)}
                sx={{
                  zIndex: 90,
                }}
              >
                <ModalOverflow>
                  <ModalDialog
                    aria-labelledby="basic-modal-dialog-title"
                    aria-describedby="basic-modal-dialog-description"
                    className="!min-w-[500px]"
                    layout="center"
                  >
                    <ModalClose />
                    <div>
                      <div>
                        <div className="text-xl font-semibold">Nhập mã xác minh</div>
                        <div className="my-1">
                          Vui lòng nhập mã xác minh gồm 6 kí tự vừa được gửi đến điện thoại của bạn
                        </div>
                      </div>
                      <div className="flex justify-center my-2">
                        <OtpInput
                          value={otp}
                          onChange={(newOtp) => {
                            setOtp(newOtp.substring(0, 6))
                            if (newOtp.length === 6) {
                              setIsDeletedOtp(true)
                            } else if (newOtp.length === 0) {
                              setIsDeletedOtp(false)
                            }
                          }}
                          numInputs={6}
                          renderSeparator={<div className="mx-2"></div>}
                          renderInput={(props, index) => (
                            <>
                              {!isDeletedOtp ? (
                                <input
                                  {...props}
                                  style={
                                    index === otp.length ? otpCurrentInputStyle : otpInputStyle
                                  }
                                />
                              ) : (
                                <input
                                  {...props}
                                  style={
                                    index === otp.length - 1 ? otpCurrentInputStyle : otpInputStyle
                                  }
                                />
                              )}
                            </>
                          )}
                          placeholder="000000"
                          shouldAutoFocus
                        />
                      </div>
                      <div>
                        <Button
                          id="get-otp"
                          type="button"
                          sx={{ marginTop: 2, width: '100%' }}
                          onClick={onSubmitOTP}
                        >
                          Xác minh
                        </Button>
                      </div>
                      <div></div>
                    </div>
                  </ModalDialog>
                </ModalOverflow>
              </Modal>
            </div>
          </div>
        </>
      )}
    </Formik>
  )
}

export default UpdateInfoForm
