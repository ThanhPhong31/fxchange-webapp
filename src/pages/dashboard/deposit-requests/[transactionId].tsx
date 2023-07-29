import { Spin, Tooltip } from 'antd';
import { ArrowLeftRight, Flag, List, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import colors from 'tailwindcss/colors';

import { getDashboardLayout } from '@/components/layouts/dashboard-layout';
import CenterContainer from '@/components/ui/common/center-container';
import FirebaseImage from '@/components/ui/common/firebase-image';
import ImageNotFound from '@/components/ui/common/image-not-found';
import UserAvatar from '@/components/ui/common/user-avartar';
import { TransactionEvidenceInput } from '@/components/ui/form/submit-evidence-form';
import CreateIssueModal from '@/components/ui/modal/create-issue-modal';
import IssueListModal from '@/components/ui/modal/issue-list-modal';
import SubmitEvidenceModal from '@/components/ui/modal/submit-evidence-modal';
import { TransactionBadge } from '@/components/ui/transaction/transaction-rowdata';
import { useApp } from '@/contexts/app-context';
import { useAuth } from '@/contexts/auth-context';
import transactionQuery from '@/graphql/queries/transaction-query';
import { TransactionStatus } from '@/libs/constants';
import cn, { getStuffSlug } from '@/libs/utils';
import NotFoundPage from '@/pages/404';
import { NextPageWithLayout } from '@/pages/_app';
import { TransactionGraphQLResponse, WithClassName } from '@/types/common';
import { Transaction } from '@/types/model';
import { WithChildren } from '@/types/WithChildren';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, CircularProgress, Divider, IconButton } from '@mui/joy';

const transactionSupportStatus = [TransactionStatus.PENDING, TransactionStatus.ONGOING]

const TransactionDetail: NextPageWithLayout = () => {
  const [
    getTransaction,
    {
      data: transactionResponse,
      loading: isLoadTransaction,
      error: hasErrorOnTransaction,
      refetch: refetchTransaction,
    },
  ] = useLazyQuery<TransactionGraphQLResponse>(transactionQuery.findByID())
  const [
    getIssueByTransactionId,
    { data: issueListData, loading: issueListLoading, error: issueListError },
  ] = useLazyQuery<TransactionGraphQLResponse>(transactionQuery.getIssueByTransactionId())
  const [
    confirmReceivedStuff,
    {
      data: confirmReceivedResponse,
      loading: isLoadingConfirmReceived,
      error: hasErrorOnConfirmReceived,
      called: calledConfirmReceived,
    },
  ] = useMutation<TransactionGraphQLResponse>(transactionQuery.confirmReceivedStuff())
  const [
    confirmPickupStuff,
    {
      data: confirmPickupResponse,
      loading: isLoadingConfirmPickup,
      error: hasErrorOnConfirmPickup,
      called: calledConfirmPickup,
    },
  ] = useMutation<TransactionGraphQLResponse>(transactionQuery.confirmPickupStuff())

  const { user, isValidating } = useAuth()
  const { notify, messageApi } = useApp()
  const [showEvidenceModal, setShowEvidenceModal] = useState(false)
  const [createIssueModal, setCreateIssueModal] = useState(false)
  const [issueListModal, setIssueListModal] = useState(false)
  const [transactionState, setTransactionState] = useState<Transaction | null>(null)
  const [loadingPage, setLoadingPage] = useState(false)
  const router = useRouter()

  const handleRefetchTransaction = useCallback(async () => {
    // setTransactionState(null)
    refetchTransaction()
  }, [refetchTransaction])

  const loadTransactionDetails = useCallback(
    async (transactionId: string) => {
      if (transactionId) {
        getTransaction({
          variables: {
            id: transactionId,
          },
        })
        getIssueByTransactionId({
          variables: {
            transaction_id: transactionId,
          },
        })
      }
    },
    [getIssueByTransactionId, getTransaction]
  )

  useEffect(() => {
    if (router.query.transactionId) loadTransactionDetails(router.query.transactionId as string)
  }, [getTransaction, loadTransactionDetails, router])

  useEffect(() => {
    if (isLoadTransaction) {
      messageApi?.open({
        type: 'loading',
        content: 'Đang tải',
        duration: 0,
        key: 'loading-transaction',
      })
    }

    if (hasErrorOnTransaction && !transactionResponse) {
      notify({
        title: 'Đã xảy ra lỗi',
        description: 'Không thể tải thông tin giao dịch. Vui lòng tải lại trang',
        type: 'error',
      })
    }

    setTransactionState(transactionResponse?.transaction || null)
    messageApi?.destroy('loading-transaction')
  }, [hasErrorOnTransaction, isLoadTransaction, messageApi, notify, transactionResponse])

  useEffect(() => {
    if (
      (calledConfirmReceived && confirmReceivedResponse) ||
      (calledConfirmPickup && confirmPickupResponse)
    ) {
      setShowEvidenceModal(false)
      notify({
        type: 'success',
        duration: 5000,
        title: 'Gửi thành công',
        description: 'Đã cập nhật minh chứng cho giao dịch này thành công',
      })
      handleRefetchTransaction()
    }
  }, [
    calledConfirmPickup,
    calledConfirmReceived,
    confirmPickupResponse,
    confirmReceivedResponse,
    handleRefetchTransaction,
    messageApi,
    notify,
  ])

  useEffect(() => {
    if (hasErrorOnConfirmReceived || hasErrorOnConfirmPickup) {
      notify({
        title: 'Không thể gửi minh chứng',
        type: 'error',
        description: 'Đã xảy ra lỗi trong quá trình gửi minh chứng, vui lòng thử lại sau.',
      })
      messageApi?.destroy('status')
    }
  }, [hasErrorOnConfirmPickup, hasErrorOnConfirmReceived, messageApi, notify])

  const handleSubmitEvidence = useCallback(
    (input: TransactionEvidenceInput) => {
      if (!transactionResponse) return
      const transactionId = transactionResponse?.transaction?.id
      if (!transactionId) {
        return notify({
          type: 'error',
          title: 'Không thể gửi minh chứng',
          description: 'Đã xảy ra lỗi trong quá trình gửi đi. Vui lòng thử lại sau.',
        })
      }
      const submitAction =
        transactionResponse.transaction.status === TransactionStatus.PENDING
          ? confirmReceivedStuff
          : confirmPickupStuff

      submitAction({
        variables: {
          input: {
            media: input.media,
            transaction_id: transactionId as string,
          },
        },
      })
    },
    [confirmPickupStuff, confirmReceivedStuff, notify, transactionResponse]
  )

  if (isLoadTransaction || isValidating || isLoadingConfirmPickup || isLoadingConfirmReceived) {
    return (
      <CenterContainer fixed>
        <CircularProgress />
      </CenterContainer>
    )
  }

  if (
    hasErrorOnTransaction ||
    (!isLoadTransaction && !transactionResponse) ||
    (!isValidating && !user) ||
    !transactionState
  ) {
    return <NotFoundPage />
  }

  const actionButtons: {
    [key: string]: React.ReactElement
  } = {
    [TransactionStatus.PENDING]: (
      <Button onClick={() => setShowEvidenceModal(true)}>Đã ký gửi</Button>
    ),
    [TransactionStatus.ONGOING]: (
      <Button onClick={() => setShowEvidenceModal(true)}>Đã bàn giao</Button>
    ),
    default: <></>,
  }
  const typeOfButton = transactionSupportStatus.includes(transactionState.status)
    ? transactionState.status
    : 'default'
  const actionButton = actionButtons[typeOfButton]

  return (
    <div>
      <Spin
        spinning={loadingPage}
        delay={500}
        size="large"
      >
        <div className="flex items-stretch w-full gap-1 mt-6 transaction-header max-md:flex-col">
          <div className="relative border aspect-[16/11] max-md:max-w-full max-md:mr-0 max-w-[404px] rounded-lg overflow-hidden mr-4">
            <div className="relative w-full h-full transition-all hover:brightness-110 ">
              <Link
                href={getStuffSlug(
                  transactionState?.stuff?.id,
                  transactionState?.stuff?.type?.slug
                )}
              >
                {transactionState?.stuff?.media && transactionState?.stuff?.media.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <FirebaseImage
                    src={transactionState?.stuff.media[0]}
                    alt={transactionState.stuff.name}
                  />
                ) : (
                  <ImageNotFound />
                )}
              </Link>
            </div>
          </div>
          <div className="flex flex-col flex-1 w-full h-full">
            <div className="flex flex-wrap items-stretch flex-1">
              <DescriptionRowData
                title="tên sản phẩm"
                component={<h3>{transactionState.stuff.name}</h3>}
              />
              <div className="flex items-center justify-end gap-3">
                {!(transactionState.status === TransactionStatus.CANCELED) &&
                  !(transactionState.status === TransactionStatus.COMPLETED) &&
                  !(transactionState.status === TransactionStatus.WAIT) && (
                    <Button
                      variant="soft"
                      color="neutral"
                      onClick={() => setCreateIssueModal(true)}
                      startDecorator={<Flag />}
                    >
                      Báo cáo vấn đề
                    </Button>
                  )}

                {!(transactionState.status === TransactionStatus.CANCELED) &&
                  !(transactionState.status === TransactionStatus.COMPLETED) && (
                    <Button
                      className="ml-4"
                      variant="soft"
                      color="neutral"
                      startDecorator={<List />}
                      onClick={() => setIssueListModal(true)}
                    >
                      Danh sách vấn đề
                    </Button>
                  )}
                {/* <IconButton
                  color="neutral"
                  variant="outlined"
                >
                  <MoreVertical />
                </IconButton> */}
                {actionButton}
              </div>
            </div>
            <div className="flex flex-col flex-wrap items-stretch flex-1">
              <div className="flex flex-wrap items-stretch justify-start flex-1 w-full">
                <DescriptionRowData
                  title="Trạng thái"
                  component={<TransactionBadge status={transactionState.status} />}
                />
                <DescriptionRowData
                  title="Hình thức"
                  component={
                    <p className="text-sm font-semibold whitespace-nowrap">
                      {transactionState.stuff.type.name}
                    </p>
                  }
                />
                <DescriptionRowData
                  title="Phân loại"
                  component={
                    <p className="text-sm font-semibold whitespace-nowrap">
                      {transactionState.stuff.category.name}
                    </p>
                  }
                />
              </div>
              <div className="flex flex-wrap items-stretch justify-start flex-1 w-full">
                <DescriptionRowData
                  title="Diễn ra giữa"
                  component={
                    <p className="space-x-1 text-sm font-semibold whitespace-nowrap">
                      <span className="font-bold cursor-pointer hover:underline">
                        {transactionState.stuff_owner?.information.full_name}
                      </span>
                      <span>và</span>
                      <span className="font-bold cursor-pointer hover:underline">
                        {transactionState.customer?.information.full_name}
                      </span>
                    </p>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {transactionState.exchange_stuff && (
          <>
            <Divider
              className="py-8 max-md:py-4"
              style={{
                color: colors.gray[100],
              }}
            >
              <Tooltip
                title={transactionState.stuff_owner?.information.full_name + ' - Chủ sở hữu'}
              >
                <UserAvatar
                  className="bg-white border bottom-3 left-3"
                  size="md"
                  src={transactionState.stuff_owner?.information.avatar_url}
                  alt={transactionState.stuff_owner?.information.full_name}
                />
              </Tooltip>
              <IconButton
                className="rounded-full"
                variant="plain"
                color="neutral"
              >
                <Tooltip title="Trao đổi">
                  <ArrowLeftRight />
                </Tooltip>
              </IconButton>
              <Tooltip title={transactionState.customer?.information.full_name + ' - Người mua'}>
                <UserAvatar
                  className="bg-white border bottom-3 right-3"
                  size="md"
                  src={transactionState.customer?.information.avatar_url}
                  alt={transactionState.customer?.information.full_name}
                />
              </Tooltip>
            </Divider>
            <div className="flex flex-row-reverse items-start w-full gap-1 transaction-header max-md:flex-col">
              <div className="relative border aspect-[16/11] max-md:max-w-full max-md:ml-0 w-full max-w-[404px] rounded-lg overflow-hidden ml-4">
                <div className="w-full h-full transition-all hover:brightness-110 ">
                  <Link
                    href={getStuffSlug(
                      transactionState.exchange_stuff.id,
                      transactionState.exchange_stuff.type.slug
                    )}
                  >
                    {transactionState?.exchange_stuff?.media &&
                    transactionState?.exchange_stuff?.media.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <FirebaseImage
                        src={transactionState?.exchange_stuff.media[0]}
                        alt={transactionState.exchange_stuff.name}
                      />
                    ) : (
                      <ImageNotFound />
                    )}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col flex-1 w-full">
                <div className="flex flex-wrap items-stretch flex-1">
                  <DescriptionRowData
                    title="tên sản phẩm"
                    component={<h3>{transactionState.exchange_stuff.name}</h3>}
                  />
                  <div className="flex items-center justify-end gap-3">
                    <IconButton
                      color="neutral"
                      variant="outlined"
                    >
                      <MoreVertical />
                    </IconButton>
                  </div>
                </div>
                <div className="flex flex-wrap items-stretch flex-1">
                  <div className="flex flex-wrap items-stretch justify-start flex-1 w-full">
                    <DescriptionRowData
                      title="Phân loại"
                      component={
                        <p className="text-sm font-semibold whitespace-nowrap">
                          {transactionState.exchange_stuff.category.name}
                        </p>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal */}
        <SubmitEvidenceModal
          isOpen={showEvidenceModal}
          onClose={() => setShowEvidenceModal(false)}
          onSubmit={handleSubmitEvidence}
        />
        <CreateIssueModal
          transactionState={transactionState}
          isExchange={transactionState.stuff.type.slug === 'exchange' ? true : false}
          isOpen={createIssueModal}
          onClose={() => setCreateIssueModal(false)}
        />
        <IssueListModal
          setLoadingPage={setLoadingPage}
          issueList={issueListData?.transactionIssueList || []}
          isOpen={issueListModal}
          onClose={() => setIssueListModal(false)}
        />
      </Spin>
    </div>
  )
}

TransactionDetail.getLayout = getDashboardLayout

export interface DescriptionRowDataProps extends WithChildren, WithClassName {
  title: string
  component: React.ReactNode
}

export const DescriptionRowData = ({ title, component, className }: DescriptionRowDataProps) => {
  return (
    <div
      className={cn('flex-1 p-3 flex flex-col items-start justify-start min-w-[100px]', className)}
    >
      <h4 className="mb-2 text-xs font-medium text-gray-500 uppercase">{title}</h4>
      {component}
    </div>
  )
}

export default TransactionDetail
