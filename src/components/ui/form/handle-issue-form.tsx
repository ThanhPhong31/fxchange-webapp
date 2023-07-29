import MemoField from '../common/MemoField'
import { useApp } from '@/contexts/app-context'
import { HandleIssueMutation, MODCreateIssueMutation } from '@/graphql/queries/transaction-query'
import { Transaction } from '@/types/model'
import { useMutation } from '@apollo/client'
import { Label } from '@mui/icons-material'
import { Button, Textarea } from '@mui/joy'
import { Radio, Space } from 'antd'
import { Form, Formik, FormikValues } from 'formik'
import React, { Dispatch, SetStateAction, useEffect } from 'react'

type HandleIssue = {
  transaction_issue_id: string
  issue_solved: string
}

type Props = {
  transactionIssueId: string
  setLoadingPage: Dispatch<SetStateAction<boolean>>
}

function CreateIssueForm({ transactionIssueId, setLoadingPage }: Props) {
  const { notifySuccess, notifyError } = useApp()

  const [
    handleIssueByMOD,
    { data: handleIssueResponse, loading: loadingHandleIssue, error: errorHandleIssue, called },
  ] = useMutation(HandleIssueMutation)

  const initialValues = {
    issue_solved: '',
  }

  useEffect(() => {
    if (loadingHandleIssue && !handleIssueResponse) {
      setLoadingPage(true)
    } else if (!loadingHandleIssue && handleIssueResponse) {
      setTimeout(function () {
        window.location.reload()
      }, 1000)
    }
  }, [loadingHandleIssue])

  useEffect(() => {
    if (handleIssueResponse && !errorHandleIssue && called) {
      notifySuccess('Giải quyết vấn đề thành công.')
    } else if (errorHandleIssue) {
      notifyError('Giải quyết vấn đề thất bại.')
    }
  }, [errorHandleIssue, handleIssueResponse, called, notifySuccess, notifyError])

  const handleSubmit = (values: FormikValues) => {
    const handledIssue: HandleIssue = {
      transaction_issue_id: transactionIssueId,
      issue_solved: values.issue_solved,
    }

    try {
      handleIssueByMOD({
        variables: {
          input: handledIssue,
        },
      })
    } catch (error) {
      console.log({ error })
    }
  }

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
              <div className="p-5">
                <div className="">
                  <label className="font-semibold text-xl">Giải quyết vấn đề</label>
                </div>

                <div className="mt-4 mb-10 text-base flex flex-col">
                  <div className="mt-4">
                    <div className="font-semibold mb-2 text-base">
                      <label htmlFor="issue">Phương pháp giải quyết:</label>
                    </div>
                    <MemoField>
                      <Textarea
                        id="issue_solved"
                        sx={{ width: '520px' }}
                        name="issue_solved"
                        minRows={2}
                        onChange={(e) => setFieldValue('issue_solved', e.target.value)}
                      />
                    </MemoField>
                  </div>
                </div>
                {!values.issue_solved ? (
                  <Button
                    className="!bg-red-500 hover:!bg-red-600 opacity-50"
                    size="lg"
                    fullWidth
                    disabled={true}
                    type="submit"
                  >
                    XÁC NHẬN GIẢI QUYẾT VẤN ĐỀ
                  </Button>
                ) : (
                  <Button
                    className="!bg-red-500 hover:!bg-red-600"
                    size="lg"
                    fullWidth
                    type="submit"
                  >
                    XÁC NHẬN GIẢI QUYẾT VẤN ĐỀ
                  </Button>
                )}
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default CreateIssueForm
