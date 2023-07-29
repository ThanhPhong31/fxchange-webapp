import { Modal, Spin } from 'antd';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import { getDashboardLayout } from '@/components/layouts/dashboard-layout';
import CenterContainer from '@/components/ui/common/center-container';
import FirebaseImage from '@/components/ui/common/firebase-image';
import ImageNotFound from '@/components/ui/common/image-not-found';
import UserCard from '@/components/ui/common/user-card';
import { AuctionBadge } from '@/components/ui/stuff/auction-rowdata';
import { useApp } from '@/contexts/app-context';
import { useAuth } from '@/contexts/auth-context';
import auctionQuery from '@/graphql/queries/auction-query';
import { TransactionStatus } from '@/libs/constants';
import cn, { getStuffSlug } from '@/libs/utils';
import NotFoundPage from '@/pages/404';
import { NextPageWithLayout } from '@/pages/_app';
import { AuctionGraphQLResponse, WithClassName } from '@/types/common';
import { Auction } from '@/types/model';
import { WithChildren } from '@/types/WithChildren';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, CircularProgress, IconButton } from '@mui/joy';

const transactionSupportStatus = [TransactionStatus.PENDING, TransactionStatus.ONGOING]

const TransactionDetail: NextPageWithLayout = () => {
  const [modal, contextHolder] = Modal.useModal()
  const { user, isValidating } = useAuth()
  const { notify, messageApi } = useApp()
  const [auctionState, setAuctionState] = useState<Auction | null>(null)
  const [loadingPage, setLoadingPage] = useState(false)
  const router = useRouter()
  const [
    getAuctionByStuffId,
    {
      data: auctionResponse,
      loading: isLoadAuction,
      error: hasErrorOnAuction,
      refetch: refetchAuction,
    },
  ] = useLazyQuery<AuctionGraphQLResponse>(auctionQuery.getByStuffId())
  const [approveAuction, { data: updatedAuction, loading: onUpdating, error: hasErrorOnUpdating }] =
    useMutation<AuctionGraphQLResponse>(auctionQuery.approve())

  const loadTransactionDetails = useCallback(
    async (stuffId: string) => {
      if (stuffId) {
        getAuctionByStuffId({
          variables: {
            stuffId: stuffId,
          },
        })
      }
    },
    [getAuctionByStuffId]
  )

  useEffect(() => {
    if (router.query.stuffId) loadTransactionDetails(router.query.stuffId as string)
  }, [loadTransactionDetails, router])

  useEffect(() => {
    if (updatedAuction) {
      setAuctionState(updatedAuction.auction)
      return
    }

    if (hasErrorOnUpdating) {
      notify({
        title: 'Đã xảy ra lỗi',
        description: 'Không thể cập nhật trạng thái của đấu giá. Vui lòng thử lại sau',
        type: 'error',
      })
    }

    if (isLoadAuction) {
      messageApi?.open({
        type: 'loading',
        content: 'Đang tải',
        duration: 0,
        key: 'loading-transaction',
      })
    }

    if (hasErrorOnAuction && !auctionResponse) {
      notify({
        title: 'Đã xảy ra lỗi',
        description: 'Không thể tải thông tin đấu giá. Vui lòng tải lại trang',
        type: 'error',
      })
    }

    setAuctionState(auctionResponse?.auction || null)
    messageApi?.destroy('loading-transaction')
  }, [
    hasErrorOnAuction,
    isLoadAuction,
    messageApi,
    notify,
    auctionResponse,
    updatedAuction,
    hasErrorOnUpdating,
  ])

  if (isLoadAuction || isValidating) {
    return (
      <CenterContainer fixed>
        <CircularProgress />
      </CenterContainer>
    )
  }

  if (
    hasErrorOnAuction ||
    (!isLoadAuction && !auctionResponse) ||
    (!isValidating && !user) ||
    !auctionState
  ) {
    return <NotFoundPage />
  }

  const handleApprove = () => {
    approveAuction({
      variables: {
        stuffId: router.query.stuffId,
      },
    })
  }

  const handleOnConfirm = () => {
    modal.confirm({
      title: 'Xác nhận',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn chắc chắn muốn cho phép buổi đấu giá này diễn ra?',
      okText: 'Chấp nhận',
      cancelText: 'Không',
      onOk: handleApprove,
    })
  }

  return (
    <div>
      {contextHolder}
      <Spin
        spinning={loadingPage || onUpdating}
        delay={500}
        size="large"
      >
        <div className="flex items-start w-full gap-1 mt-6 transaction-header max-md:flex-col">
          <div className="relative border aspect-[16/11] max-md:max-w-full max-md:mr-0 max-w-[404px] rounded-lg overflow-hidden mr-4">
            <div className="relative md:min-w-[350px] w-full h-full transition-all hover:brightness-110 ">
              <Link href={getStuffSlug(auctionState?.stuff?.id, auctionState?.stuff?.type?.slug)}>
                {auctionState?.stuff?.media && auctionState?.stuff?.media.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <FirebaseImage
                    src={auctionState?.stuff.media[0]}
                    alt={auctionState.stuff.name}
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
                component={<h3>{auctionState.stuff.name}</h3>}
              />
              <div className="flex items-center justify-end gap-3">
                {/* <IconButton
                  color="neutral"
                  variant="outlined"
                >
                  <MoreVertical />
                </IconButton> */}
                {auctionState.is_approved ? (
                  <>
                    {/* <Button
                      className="min-w-[200px]"
                      variant="solid"
                      color="danger"
                    >
                      Hủy bỏ
                    </Button> */}
                  </>
                ) : (
                  <Button
                    className="min-w-[200px] bg-blue-600"
                    variant="solid"
                    color="info"
                    onClick={handleOnConfirm}
                  >
                    Chấp nhận
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col flex-wrap items-stretch flex-1">
              <div className="flex flex-wrap items-stretch justify-start flex-1 w-full">
                <DescriptionRowData
                  title="Trạng thái"
                  component={<AuctionBadge status={auctionState.status} />}
                />
                <DescriptionRowData
                  title="Phân loại"
                  component={
                    <p className="text-sm font-semibold whitespace-nowrap">
                      {auctionState.stuff.category.name}
                    </p>
                  }
                />
                <DescriptionRowData
                  title="Yêu cầu bởi"
                  component={
                    <UserCard
                      avatarSize="sm"
                      avatarUrl={auctionState.stuff.author.information.avatar_url}
                      username={auctionState.stuff.author.information.full_name}
                    />
                  }
                />
              </div>
              <div className="flex flex-wrap items-stretch justify-start flex-1 w-full p-2 drop-shadow-md bg-slate-50 rounded-xl">
                <DescriptionRowData
                  title="Giá khởi điểm"
                  component={<p className="font-bold">{auctionState.initial_price} FP</p>}
                />
                <DescriptionRowData
                  title="Bước giá"
                  component={<p className="font-bold">{auctionState.step_price} FP</p>}
                />
                <DescriptionRowData
                  title="Giá chốt"
                  component={
                    <p className="font-bold">
                      {auctionState.final_price
                        ? auctionState.final_price + ' FP'
                        : 'Chưa khả dụng'}
                    </p>
                  }
                />
                <DescriptionRowData
                  title="Người thắng cuộc"
                  component={
                    <p className="font-bold">
                      {auctionState.winner?.auction_nickname || 'Chưa có'}
                    </p>
                  }
                />
              </div>
            </div>
          </div>
        </div>
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
