import MemoField from '../common/MemoField'
import { useApp } from '@/contexts/app-context'
import { MODCreateIssueMutation } from '@/graphql/queries/transaction-query'
import { UserFeedbackMutation } from '@/graphql/queries/user-query'
import { TransactionStatus } from '@/libs/constants'
import { Transaction } from '@/types/model'
import { useMutation } from '@apollo/client'
import { useTheme, useMediaQuery } from '@material-ui/core'
import { Label } from '@mui/icons-material'
import { Button, Textarea, ModalClose } from '@mui/joy'
import { Radio, Rate, Space, Spin } from 'antd'
import { Form, Formik, FormikValues } from 'formik'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

type UserFeedback = {
  feedback_id: string
  rating: number
  content?: string
}

type FeedBack = {
  id: string
  rating?: number
  content?: string
  transaction_id: string
  create_at?: Date
  update_at?: Date
}

type Props = {
  feedback: FeedBack
  onClose?: () => void
  setIsChanged?: Dispatch<SetStateAction<boolean>>
  setLoadingPage: Dispatch<SetStateAction<boolean>>
}

function RatingForm({ setLoadingPage, feedback, setIsChanged, onClose }: Props) {
  const theme = useTheme()
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'))
  const { notifySuccess, notifyError } = useApp()
  const [rating, setRating] = useState(5)
  const [
    createUserFeedback,
    { data: UserFeedbackResponse, loading: loadingUserFeedback, error: errorUserFeedback, called },
  ] = useMutation(UserFeedbackMutation)
  const desc = ['Tệ', 'Không tốt', 'Ổn', 'Tốt', 'Rất tốt']
  const initialValues = {
    feedback_id: feedback.id,
    content: '',
  }

  useEffect(() => {
    if (UserFeedbackResponse && setIsChanged && onClose) {
      alert()
      setIsChanged(true)
      onClose()
    }
  }, [UserFeedbackResponse, setIsChanged, onClose])

  useEffect(() => {
    if (UserFeedbackResponse && !errorUserFeedback && called) {
      notifySuccess('Đánh giá của bạn đã được gửi đi.')
    } else if (errorUserFeedback) {
      notifyError('Đánh giá của bạn đã không được gửi đi. Vui lòng kiểm tra lại.')
    }
  }, [errorUserFeedback, UserFeedbackResponse, called, notifySuccess, notifyError])

  const handleSubmit = (values: FormikValues) => {
    let newUserFeedback: UserFeedback = {
      feedback_id: values.feedback_id,
      content: values.content,
      rating: rating,
    }

    try {
      createUserFeedback({
        variables: {
          input: newUserFeedback,
        },
      })
    } catch (error) {
      console.log({ error })
    }
  }
//rating form
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
              <div className="p-2">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="font-semibold text-xl">
                      Đánh giá dịch vụ và chất lượng sản phẩm
                    </label>
                  </div>
                  <div className="ml-2">
                    <ModalClose
                      sx={{ position: 'static' }}
                      size={isMobile ? 'sm' : 'md'}
                    />
                  </div>
                </div>
                <div className="mx-4">
                  <div className="mt-4">
                    <span className="text-base">
                      Thái độ người bán:
                      <Rate
                        className="ml-4"
                        tooltips={desc}
                        onChange={setRating}
                        value={rating}
                      />
                      {rating ? <span className="ant-rate-text">{desc[rating - 1]}</span> : ''}
                    </span>
                  </div>
                  <div className="mt-2 mb-10 text-base flex flex-col">
                    <div className="mt-4">
                      <div className="font-semibold mb-2 text-base">
                        <label htmlFor="content">Chi tiết chất lượng sản phẩm:</label>
                      </div>
                      <MemoField>
                        <Textarea
                          id="content"
                          sx={{
                            [theme.breakpoints.up('sm')]: {
                              width: '520px',
                            },
                            padding: '12px',
                          }}
                          name="content"
                          minRows={2}
                          onChange={(e) => setFieldValue('content', e.target.value)}
                        />
                      </MemoField>
                    </div>
                  </div>
                </div>

                <Button
                  className="!bg-red-500 hover:!bg-red-600"
                  size={isMobile ? 'sm' : 'md'}
                  fullWidth
                  loading={loadingUserFeedback}
                  type="submit"
                >
                  XÁC NHẬN
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default RatingForm
