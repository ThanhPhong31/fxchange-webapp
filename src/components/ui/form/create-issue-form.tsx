import { Radio, Space, Spin } from 'antd';
import { Form, Formik, FormikValues } from 'formik';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useApp } from '@/contexts/app-context';
import { MODCreateIssueMutation } from '@/graphql/queries/transaction-query';
import { TransactionStatus } from '@/libs/constants';
import { Transaction } from '@/types/model';
import { useMutation } from '@apollo/client';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { Label } from '@mui/icons-material';
import { Button, ModalClose, Textarea } from '@mui/joy';

import MemoField from '../common/MemoField';

type MODCreateIssue = {
  transaction_id: string
  issue: string
  issue_tag_user: string | undefined
  issue_solved?: boolean
}

type Props = {
  transactionState: Transaction
  isExchange?: boolean
  setLoadingPage: Dispatch<SetStateAction<boolean>>
}

function CreateIssueForm({ transactionState, setLoadingPage, isExchange }: Props) {
  const theme = useTheme()
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'))
  const { notifySuccess, notifyError } = useApp()

  const [
    createIssueByMOD,
    {
      data: MODCreateIssueResponse,
      loading: loadingMODCreateIssue,
      error: errorMODCreateIssue,
      called,
    },
  ] = useMutation(MODCreateIssueMutation)

  const initialValues = {
    issue: '',
    issue_tag_user: '',
    issue_solved: true,
  }

  useEffect(() => {
    if (loadingMODCreateIssue && !MODCreateIssueResponse) {
      setLoadingPage(true)
    } else if (!loadingMODCreateIssue && MODCreateIssueResponse) {
      setTimeout(function () {
        window.location.reload()
      }, 500)
    }
  }, [loadingMODCreateIssue])

  useEffect(() => {
    if (MODCreateIssueResponse && !errorMODCreateIssue && called) {
      notifySuccess('Vấn đề đã được cập nhật.')
    } else if (errorMODCreateIssue) {
      notifyError('Cập nhật vấn đề thất bại. Vui lòng kiểm tra lại.')
    }
  }, [errorMODCreateIssue, MODCreateIssueResponse, called, notifySuccess, notifyError])

  const handleSubmit = (values: FormikValues) => {
    let createdIssue: MODCreateIssue = {
      transaction_id: transactionState.id,
      issue: values.issue,
      issue_tag_user: '',
      issue_solved: values.issue_solved,
    }

    if (!isExchange || (isExchange && transactionState.status === TransactionStatus.PENDING)) {
      if (transactionState.status === TransactionStatus.PENDING) {
        createdIssue.issue_tag_user = transactionState.stuff_owner?.id
      } else if (transactionState.status === TransactionStatus.ONGOING) {
        createdIssue.issue_tag_user = transactionState.customer?.id
      }
    } else {
      createdIssue.issue_tag_user = values.issue_tag_user
    }

    try {
      createIssueByMOD({
        variables: {
          input: createdIssue,
        },
      })
    } catch (error) {
      console.log({ error })
    }
  }
//issue form
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
                <div className="flex items-center justify-between">
                  <div>
                    {isExchange ? (
                      <label className="text-xl font-semibold">Sự cố xảy ra</label>
                    ) : (
                      <label className="text-xl font-semibold">
                        Vấn đề của{' '}
                        {transactionState.status === TransactionStatus.PENDING
                          ? 'người bán'
                          : 'người mua'}
                        :
                      </label>
                    )}
                  </div>
                  <div className="ml-2">
                    <ModalClose
                      sx={{ position: 'static' }}
                      size={isMobile ? 'sm' : 'md'}
                    />
                  </div>
                </div>

                <div className="flex flex-col mt-4 mb-10 text-base">
                  {isExchange && transactionState.status === TransactionStatus.ONGOING ? (
                    <>
                      <div>
                        <div className="mb-2 text-base font-semibold">
                          <span>Nguyên nhân đến từ:</span>
                        </div>
                        <Radio.Group
                          onChange={(e) => setFieldValue('issue_tag_user', e.target.value)}
                          value={values.issue_tag_user}
                        >
                          <Space direction="vertical">
                            <Radio
                              value={transactionState.stuff_owner?.id}
                              style={{ fontSize: '14px', marginBottom: '4px' }}
                            >
                              Người Bán
                            </Radio>
                            <Radio
                              value={transactionState.customer?.id}
                              style={{ fontSize: '14px', marginBottom: '8px' }}
                            >
                              Người Mua
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 text-base font-semibold">
                          <span>Bạn muốn:</span>
                        </div>
                        <Radio.Group
                          onChange={(e) => setFieldValue('issue_solved', e.target.value)}
                          value={values.issue_solved}
                        >
                          <Space direction="vertical">
                            <Radio
                              value={true}
                              style={{ fontSize: '14px', marginBottom: '4px' }}
                            >
                              Hủy phiên giao dịch
                            </Radio>
                            <Radio
                              value={false}
                              style={{ fontSize: '14px', marginBottom: '8px' }}
                            >
                              Gia hạn thời gian giao dịch
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  <div className="mt-4">
                    <div className="mb-2 text-base font-semibold">
                      <label htmlFor="issue">Mô tả</label>
                    </div>
                    <MemoField>
                      <Textarea
                        id="issue"
                        sx={{
                          [theme.breakpoints.up('sm')]: {
                            width: '520px',
                          },
                          padding: '12px',
                        }}
                        name="issue"
                        minRows={2}
                        onChange={(e) => setFieldValue('issue', e.target.value)}
                      />
                    </MemoField>
                  </div>
                </div>
                {(!isExchange && !values.issue) ||
                (isExchange &&
                  transactionState.status === TransactionStatus.ONGOING &&
                  (!values.issue || !values.issue_tag_user)) ? (
                  <Button
                    variant="soft"
                    color="info"
                    size={isMobile ? 'sm' : 'md'}
                    fullWidth
                    disabled={true}
                    type="submit"
                  >
                    XÁC NHẬN
                  </Button>
                ) : (
                  <Button
                    variant="soft"
                    color="info"
                    size={isMobile ? 'sm' : 'md'}
                    fullWidth
                    type="submit"
                  >
                    XÁC NHẬN
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
