import MuiDebounceInput from '../form/mui/mui-debounce-input'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import userQuery from '@/graphql/queries/user-query'
import { auth } from '@/libs/firebase'
import { useMutation } from '@apollo/client'
import { Button, FormControl, FormHelperText, FormLabel, Input } from '@mui/joy'
import { Result, Steps } from 'antd'
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { Form, Formik, FormikProps, useFormik, useFormikContext } from 'formik'
import { Check } from 'lucide-react'
import Link from 'next/link'
import React, { Ref, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'

const config = {
  maxStep: 2,
}

type InfoInitialValues = {
  full_name?: string
  auction_nickname?: string
  phone?: string
}

type FormStatus = 'loading' | 'phone-validating' | null

const InitialUser = () => {
  const [updateInfo, { data: updatedInfoResult, loading: updatingInfo, error: errorOnUpdateInfo }] =
    useMutation(userQuery.updateInfo())

  const { user } = useAuth()
  const [otpCode, setOtpCode] = useState('')
  const steps = {
    first: 0,
    second: 1,
    last: 2,
  }
  const { messageApi } = useApp()
  const [current, setCurrent] = useState(0)
  const [confirmOTPResult, setConfirmOTPResult] = useState<ConfirmationResult | null>(null)
  const [status, setStatus] = useState<FormStatus>(null)
  const infoFormik = useFormik({
    validationSchema: Yup.object().shape({
      full_name: Yup.string()
        .min(8, 'Tên cần ít nhất 8 ký tự')
        .max(50, 'Tên không nên dài thế.')
        .matches(/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:'[\]]{8,}$/, 'Tên không hợp lệ'),
      auction_nickname: Yup.string()
        .min(2, 'Biệt hiệu cần có ít nhất 2 ký tự.')
        .max(50, 'Biệt hiệu không nên dài như vậy đâu.'),
      phone: Yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ'),
    }),
    initialValues: {
      full_name: user?.full_name || '',
      auction_nickname: user?.auction_nickname || '',
      phone: user?.phone || '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })

  useEffect(() => {
    document.body.className += 'overflow-hidden'
  }, [])

  const actions = [updateInfo]
  const stepItems = [
    {
      title: 'Thông tin cơ bản',
    },
    {
      title: 'Mã giới thiệu',
    },
    {
      title: 'Hoàn thành',
    },
  ]

  const handleNext = async () => {
    if (current >= config.maxStep || !infoFormik.isValid) return
    const action = actions[current]

    if (current == steps.first && infoFormik.dirty) {
      await action({
        variables: {
          input: {
            information: {
              full_name: infoFormik.values.full_name,
              phone: infoFormik.values.phone,
            },
          },
        },
      })
    }
    console.log({ infoFormik: infoFormik.values })
    setCurrent(current + 1)
  }

  const handlePrevious = () => {
    setCurrent(current - 1)
  }
  const buttonNextLabel = current === config.maxStep ? 'Bắt đầu trao đổi' : 'Tiếp tục'

  const onSignInSubmit = () => {
    setStatus('phone-validating')
    const recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: () => {
          console.log('Recaptca varified')
        },
        defaultCountry: 'VN',
      },
      auth
    )
    const phoneNumber = '+84' + infoFormik.values.phone
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setConfirmOTPResult(confirmationResult)
        messageApi?.success('Đã gửi mã OTP')
      })
      .catch((error) => {
        messageApi?.error('Không thể gửi mã OTP')
      })
  }

  const onSubmitOTP = () => {
    if (!confirmOTPResult) return
    confirmOTPResult
      .confirm(otpCode)
      .then((result) => {
        console.log('🚀 ~ file: index.tsx:134 ~ .then ~ result:', result)
        const user = result.user
        setStatus(null)
        setOtpCode('')
        setConfirmOTPResult(null)
      })
      .catch((error) => {
        messageApi?.error('Mã OTP không hợp lệ')
      })
  }

  const shouldDisableButtons = status === 'phone-validating' || status === 'loading'
  const phoneValidTemporary = otpCode.trim() !== ''

  return (
    <div className="fixed inset-0 py-8 bg-white z-[99999]">
      <div className="container">
        <Steps
          current={current}
          items={stepItems}
        />
        <div className="max-w-md mx-auto mt-8 content">
          {current === steps.first && (
            <form className="flex flex-col gap-3">
              <FormControl>
                <FormLabel>Họ tên</FormLabel>
                <Input
                  placeholder="Nguyễn Văn A"
                  value={infoFormik.values.full_name}
                  onChange={(e) => infoFormik.setFieldValue('full_name', e.target.value)}
                />
                {infoFormik.errors.full_name && (
                  <FormHelperText className="text-xs text-red-500">
                    {infoFormik.errors.full_name}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Biệu hiệu</FormLabel>
                <Input
                  placeholder="David"
                  value={infoFormik.values.auction_nickname}
                  onChange={(e) => infoFormik.setFieldValue('auction_nickname', e.target.value)}
                />
                {infoFormik.errors.auction_nickname ? (
                  <FormHelperText className="text-xs text-red-500">
                    {infoFormik.errors.auction_nickname}
                  </FormHelperText>
                ) : (
                  <FormHelperText>
                    Biệu hiệu sẽ thay cho tên bạn trong các phiên đấu giá.
                  </FormHelperText>
                )}
              </FormControl>
              {!confirmOTPResult && (
                <FormControl>
                  <FormLabel required>Số điện thoại</FormLabel>
                  <div className="flex items-center gap-3">
                    <Input
                      className="flex-1"
                      placeholder="035xxxxxxxx"
                      value={infoFormik.values.phone}
                      type="number"
                      disabled={phoneValidTemporary}
                      endDecorator={phoneValidTemporary && <Check className="text-primary-500" />}
                      onChange={(e) => infoFormik.setFieldValue('phone', e.target.value)}
                    />
                    {!phoneValidTemporary && (
                      <Button
                        id="sign-in-button"
                        variant="soft"
                        color="info"
                        onClick={() => {
                          onSignInSubmit()
                        }}
                      >
                        Gửi mã
                      </Button>
                    )}
                  </div>
                  {infoFormik.errors.phone && (
                    <FormHelperText className="text-xs text-red-500">
                      {infoFormik.errors.phone}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              {confirmOTPResult && (
                <FormControl>
                  <FormLabel required>Mã xác nhận</FormLabel>
                  <div className="flex items-center gap-3">
                    <MuiDebounceInput
                      autoComplete="one-time-code"
                      className="flex-1"
                      placeholder="xxxxxx"
                      defaultValue={otpCode}
                      type="number"
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                    <Button
                      variant="soft"
                      color="info"
                      onClick={() => {
                        onSubmitOTP()
                      }}
                    >
                      Xác nhận
                    </Button>
                  </div>
                  {infoFormik.errors.phone && (
                    <FormHelperText className="text-xs text-red-500">
                      {infoFormik.errors.phone}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            </form>
          )}
          {current === steps.second && (
            <div className="">
              <FormControl>
                <FormLabel>Mã giới thiệu</FormLabel>
                <Input placeholder="XYAxxxxx" />
              </FormControl>
            </div>
          )}

          {current === steps.last && (
            <div className="">
              <Result
                status="success"
                title="Hoàn tất"
                subTitle="Mọi thứ đã ổn định, bạn có thể bắt đầu trao đổi, mua bán và đấu giá ngay bây giờ."
                extra={[
                  <Link
                    key="back-to-home"
                    href="/"
                  >
                    <Button
                      color="neutral"
                      variant="soft"
                    >
                      Về trang chủ
                    </Button>
                  </Link>,
                  <Link
                    key="add-stuff"
                    href="/?mode=add"
                  >
                    <Button
                      type="primary"
                      color="info"
                    >
                      Đăng tin ngay
                    </Button>
                  </Link>,
                ]}
              />
            </div>
          )}
        </div>
        {current !== steps.last && (
          <div className="action">
            <div className="flex items-center justify-end gap-3 py-3">
              {current > steps.first && (
                <Button
                  className="min-w-[150px] max-md:w-full"
                  disabled={shouldDisableButtons}
                  loading={updatingInfo}
                  color="neutral"
                  variant="plain"
                  onClick={handlePrevious}
                >
                  Trở lại
                </Button>
              )}
              <Button
                className="min-w-[150px]  max-md:w-full"
                color="info"
                disabled={shouldDisableButtons}
                type="submit"
                loading={updatingInfo}
                variant="solid"
                onClick={handleNext}
              >
                {buttonNextLabel}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InitialUser
