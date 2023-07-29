import { List, Modal as AntModal, Rate, Spin, Tooltip } from 'antd';
import { ErrorMessage, Form, Formik, FormikValues } from 'formik';
import _ from 'lodash';
import { History, Play } from 'lucide-react';
import moment from 'moment';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Countdown from 'react-countdown';
import * as Yup from 'yup';

import NotFoundImage from '@/assets/images/image-not-found.jpg';
import IsAuthenticated from '@/components/auth/is-authenticated';
import IsNot from '@/components/auth/is-not';
import IsNotOwner from '@/components/auth/is-not-owner';
import IsOwner from '@/components/auth/is-owner';
import { ROLES } from '@/components/context/auth-context-container';
import { getAppLayout } from '@/components/layouts/app-layout';
import LoginButton from '@/components/ui/common/Button/login-button';
import CenterContainer from '@/components/ui/common/center-container';
import NavBottom from '@/components/ui/common/nav-bottom';
import SectionContainer from '@/components/ui/common/section-container';
import UserCard from '@/components/ui/common/user-card';
import Modal from '@/components/ui/modal/modal';
import OtherFeedbackModal from '@/components/ui/modal/other-feedback-modal';
import AuctionStatusChip from '@/components/ui/stuff/auction-status-chip';
import StuffMediaGrid from '@/components/ui/stuff/stuff-media-grid';
import { useApp } from '@/contexts/app-context';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/contexts/socket-context';
import auctionQuery from '@/graphql/queries/auction-query';
import stuffQuery, {
    GET_OTHER_FEEDBACK_BY_ID, GET_OTHER_RATING_BY_ID
} from '@/graphql/queries/stuff-query';
import { AuctionStatus } from '@/libs/constants';
import cn, { getBasicEvents } from '@/libs/utils';
import { AuctionGraphQLResponse, BiddingHistoryListGraphQLResponse } from '@/types/common';
import { Auction, AuctionStatusType, BiddingHistory, Stuff } from '@/types/model';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { Button, IconButton, Input } from '@mui/joy';
import { useMediaQuery } from '@mui/material';

import NotFoundPage from '../404';
import { NextPageWithLayout } from '../_app';

const auctionEvents = {
  ...getBasicEvents('auction'),
  hasWin: 'auction:has-win',

  stopped: 'auction:stopped',
  paused: 'auction:paused',
}
export type ModalMessageType = 'success' | 'danger' | null

export type ModalMessage = {
  message: string
  type: ModalMessageType
  payload?: any | null
}

type FeedBack = {
  id: string
  rating: number
  content: string
  transaction_id: string
  create_at: Date
  update_at: Date
}

const StuffDetail: NextPageWithLayout = () => {
  const router = useRouter()
  const { user, redirectToLogin } = useAuth()
  const { notify } = useApp()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isShowHistory, setIsShowHistory] = useState(false)
  const [modal, contextHolder] = AntModal.useModal()
  const [openModal, setOpenModal] = useState<boolean>(false)

  const [pageLoading, setPageLoading] = useState(true)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [modalMessage, setModalMessage] = useState<ModalMessage>({
    message: '',
    type: null,
    payload: null,
  })

  const [stuff, setStuff] = useState<Stuff | null>(null)
  const [biddingHistory, setBiddingHistory] = useState<BiddingHistory[]>([])
  const [getOtherRatingById, { data: ratingData, loading: ratingLoading, error: ratingError }] =
    useLazyQuery<{ rating: number }>(GET_OTHER_RATING_BY_ID)
  const [
    getOtherFeedbackById,
    { data: feedbackData, loading: feedbackLoading, error: feedbackError },
  ] = useLazyQuery<{ feedbackList: FeedBack[] }>(GET_OTHER_FEEDBACK_BY_ID)

  const [getStuff, { data: stuffData, loading: isLoadStuffData, error: errorOnLoadStuff }] =
    useLazyQuery(stuffQuery.getAuctionByID(), {
      fetchPolicy: 'network-only',
    })
  const [
    getBiddingHistory,
    { data: biddingHistoryResponse, loading: isLoadHistory, error: errorOnLoadHistory },
  ] = useLazyQuery<BiddingHistoryListGraphQLResponse>(auctionQuery.getBiddingHistory(), {
    fetchPolicy: 'network-only',
  })
  const [
    placeABidNow,
    { data: newBiddingHistory, loading: isPlacingABid, error: errorOnPlacingABid },
  ] = useMutation(auctionQuery.placeABid())
  const [
    startNow,
    { data: startedAuction, loading: isStartingAuction, error: errorOnStartingAuction },
  ] = useMutation<AuctionGraphQLResponse>(auctionQuery.start())
  const [ratedPoints, setRatedPoints] = useState<number>(0)

  const { socket } = useSocket()
  const bidInputRef = useRef<HTMLDivElement>(null)

  const pushBiddingHistory = useCallback(
    (newBiddingHistory: BiddingHistory) => {
      const isExistHistory = _.findIndex(biddingHistory, newBiddingHistory) !== -1
      if (!isExistHistory) {
        const newBiddingHistories = _.clone(biddingHistory)
        newBiddingHistories.unshift(newBiddingHistory)
        setBiddingHistory(newBiddingHistories)
      }
    },
    [biddingHistory]
  )

  useEffect(() => {
    if (stuff) {
      getOtherRatingById({
        variables: {
          id: stuff?.author?.id,
        },
      })
      getOtherFeedbackById({
        variables: {
          id: stuff?.author?.id,
        },
      })
    }
  }, [getOtherRatingById, getOtherFeedbackById, stuff])

  useEffect(() => {
    if (ratingData?.rating) {
      const decimal = ratingData?.rating - Math.floor(ratingData?.rating)
      if (decimal < 0.2) {
        setRatedPoints(Math.floor(ratingData?.rating))
      } else if (decimal > 0.2 && decimal < 0.7) {
        setRatedPoints(Math.floor(ratingData?.rating) + 0.5)
      } else {
        setRatedPoints(Math.ceil(ratingData?.rating))
      }
    } else {
      setRatedPoints(0)
    }
  }, [ratingData?.rating])

  useEffect(() => {
    if (bidInputRef.current) {
      bidInputRef.current.querySelector('input')?.focus()
    }
  }, [])

  useEffect(() => {
    const stuffId = router.query.stuffId

    return () => {
      socket?.emit(auctionEvents.leave, {
        stuffId: stuffId,
      })
    }
  }, [router.query.stuffId, socket])

  useEffect(() => {
    const stuffId = router.query.stuffId
    if (!stuffId || !socket) return
    const handleStopAuctionEvent = (data: ModalMessage) => {
      console.log('🚀 ~ file: [stuffId].tsx:183 ~ handleStopAuctionEvent ~ data:', data)
      setModalMessage(data)
      setShowMessageModal(true)

      if (!stuff || !data?.payload?.status) return

      const updatedStuff: Stuff = {
        ...stuff,
        auction: {
          ...(stuff.auction as Auction),
          status: data?.payload?.status as string,
        },
      }
      setStuff(updatedStuff)
    }

    const handleHasWinAuctionEvent = (payload: any) => {
      if (payload.winner_id === user?.uid) {
        console.log('you are winner')
      }
    }

    socket?.emit(auctionEvents.join, {
      stuffId: stuffId,
    })
    socket?.on('auction:place-a-bid', (payload) => {
      pushBiddingHistory(payload)
    })

    socket?.on(auctionEvents.stopped, handleStopAuctionEvent)
    socket?.on(auctionEvents.hasWin, handleHasWinAuctionEvent)

    return () => {
      socket?.off('auction:place-a-bid', pushBiddingHistory)
      socket?.off(auctionEvents.stopped, handleStopAuctionEvent)
      socket?.off(auctionEvents.hasWin, handleHasWinAuctionEvent)
    }
  }, [pushBiddingHistory, router.query.stuffId, socket, user?.uid])

  useEffect(() => {
    const stuffId = router.query.stuffId
    if (stuffId) {
      getStuff({
        variables: {
          id: stuffId,
        },
      })

      getBiddingHistory({
        variables: {
          id: stuffId,
        },
      })
    }
  }, [getBiddingHistory, getStuff, router])

  useEffect(() => {
    if (stuffData) {
      setStuff(stuffData.stuff)
    }

    if (biddingHistoryResponse) {
      setBiddingHistory(biddingHistoryResponse.biddingHistories)
    }

    if (stuffData && biddingHistoryResponse && !isLoadHistory && !isLoadStuffData) {
      setPageLoading(false)
    }
    const errors = errorOnLoadHistory || errorOnLoadStuff || errorOnPlacingABid
    if (errors) {
      notify({
        type: 'error',
        title: 'Đã xảy ra lỗi',
        // description: ErrorMessages[errors?.graphQLErrors[0]?.extensions as string]
      })
    }
  }, [
    biddingHistoryResponse,
    errorOnLoadHistory,
    errorOnLoadStuff,
    errorOnPlacingABid,
    isLoadHistory,
    isLoadStuffData,
    notify,
    stuffData,
  ])

  if (pageLoading) {
    return (
      <Spin spinning>
        <CenterContainer fixed />
      </Spin>
    )
  }
  const auction = stuff?.auction

  if (!auction || !stuff || _.isEmpty(stuff) || _.isEmpty(auction)) return <NotFoundPage />

  const currentPrice =
    biddingHistory && biddingHistory.length > 0
      ? biddingHistory[0].bid_price
      : biddingHistory[0]?.bid_price || auction.initial_price
  const stepPrice = auction?.step_price || 0
  const nextLimitPrice = biddingHistory[0]?.bid_price || auction.initial_price + stepPrice
  const initialValues = {
    bidding_price: '',
  }
  const auctionValidateSchema = Yup.object().shape({
    bidding_price: Yup.number().min(nextLimitPrice, 'Giá không hợp lệ').required('Vui lòng ra giá'),
  })
// handle price
  const handlePlaceABid = async (values: FormikValues) => {
    console.log({ bidInputRef })

    const biddingPrice = Number.parseInt(values.bidding_price)
    if (!user) redirectToLogin()
    if (!user?.point || biddingPrice > user?.point) {
      return notify({
        title: 'Số dư không đủ để trả giá',
        type: 'warning',
        description: 'Bạn có thể kiếm thêm điểm bằng cách mời bạn bè hoặc điểm danh hằng ngày.',
      })
    }
    const stuffId = router.query.stuffId
    const response = await placeABidNow({
      variables: {
        stuffId: stuffId as string,
        biddingPrice: biddingPrice,
      },
    })

    if (response.data && !response.errors && response.data.biddingHistory) {
      notify({
        title: 'Trả giá thành công',
        type: 'success',
        duration: 3,
      })
      pushBiddingHistory(response.data.biddingHistory)
      console.log({ bidInputRef })
      if (bidInputRef.current) {
        const input = bidInputRef.current.querySelector('input')
        console.log('🚀 ~ file: [stuffId].tsx:324 ~ handlePlaceABid ~ input:', input)
        if (input) input.value = ''
      }
    }
  }

  const handleStartAuction = () => {
    const stuffId = router.query.stuffId
    startNow({
      variables: {
        stuffId: stuffId,
      },
    })
    setIsShowHistory(true)
  }
//handle auction start
  const handleConfirmStart = () => {
    modal.confirm({
      title: 'Xác nhận bắt đầu',
      icon: <ExclamationCircleOutlined />,
      content: 'Sau khi bắt đầu sẽ không thể dừng lại. Bạn chắc chắn muốn tiếp tục chứ? ',
      okText: 'Bắt đầu',
      cancelText: 'Hủy',
      onOk: handleStartAuction,
    })
  }

  const titleMessageModals = {
    success: 'Phiên đấu giá đã kết thúc',
    danger: 'Phiên đấu giá đã bị hoãn lại',
  }
  // auction form
  return (
    <>
      <NextSeo
        title={stuff.name + ' | FXchange'}
        description={
          stuff.description + ' - Đăng bởi ' + (stuff.author.information.full_name || 'Ẩn danh')
        }
        openGraph={{
          images: [
            {
              url: stuff.media && stuff.media?.length > 0 ? stuff.media[0] : NotFoundImage.src,
              height: 600,
              alt: stuff.name,
              width: 800,
            },
          ],
        }}
      />
      <Spin spinning={isStartingAuction}>
        <SectionContainer className="flex p-6 mx-auto bg-white max-md:p-3">
          {contextHolder}
          <div
            className={cn(
              'w-full flex-1',
              user?.uid === stuff.author?.id && 'flex max-md:flex-wrap items-stretch gap-6',
              user?.uid !== stuff.author?.id && !isShowHistory && 'max-w-4xl mx-auto'
            )}
          >
            <div
              className={
                user?.uid !== stuff.author?.id
                  ? 'w-full'
                  : isShowHistory
                  ? 'w-[70%] max-lg:w-[50%]'
                  : 'w-full'
              }
            >
              <div className="relative w-full">
                <StuffMediaGrid
                  className="w-[100%]"
                  height={isMobile ? 300 : 0}
                  media={stuff.media || []}
                  alt={stuff.name}
                />
                <div className="absolute top-6 max-md:top-3 max-md:left-3 left-6">
                  <AuctionStatusChip status={auction.status as AuctionStatusType} />
                </div>
                <div className="absolute max-md:w-full max-md:py-2 max-md:px-4 justify-center cursor-pointer bottom-0 flex items-center divide-zinc-400 divide-x-[1px] bg-white rounded-full min-w-[150px] px-8 py-4 left-1/2 translate-y-1/2 drop-shadow-lg border -translate-x-1/2 z-[10]">
                  <div className="flex-1 mr-3">
                    <span className="uppercase text-[10px] font-medium text-gray-400 block  whitespace-nowrap">
                      Giá khởi điểm
                    </span>
                    <div className="text-base font-semibold whitespace-nowrap">
                      {stuff?.auction?.initial_price} FP
                    </div>
                  </div>
                  <div className="flex-1 pl-3 mr-3">
                    <span className="uppercase text-[10px] font-medium text-gray-400 block  whitespace-nowrap">
                      Bước giá
                    </span>
                    <div className="text-base font-semibold whitespace-nowrap">
                      {stuff?.auction?.step_price} FP
                    </div>
                  </div>
                  <div className="flex-1 pl-3">
                    <span className="uppercase text-[10px] font-medium text-gray-400 block whitespace-nowrap">
                      Giá hiện tại
                    </span>
                    <div className="text-base font-semibold whitespace-nowrap">
                      {currentPrice} FP
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="mt-8 text-2xl font-semibold max-md:text-xl max-md:mt-12">
                {stuff?.name}
              </h1>
              <div className="flex items-stretch justify-between py-3 mt-4 max-md:mt-3 max-md:py-1 max-md:flex-col-reverse max-md:gap-3">
                <div className="flex-1">
                  <span className="block mb-2 font-sans text-xs font-medium text-gray-400 uppercase">
                    Người đăng
                  </span>
                  <div className="gap-3">
                    <UserCard
                      userNameClassName="whitespace-normal max-md:text-sm text-base font-semibold"
                      avatarSize={isMobile ? 'sm' : 'md'}
                      username={stuff.author.information.full_name}
                      avatarUrl={stuff.author.information.avatar_url}
                    />
                    <div className="">
                      <Rate
                        className="text-sm"
                        allowHalf
                        defaultValue={ratedPoints}
                        value={ratedPoints}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                {stuff?.auction?.status !== AuctionStatus.COMPLETED && (
                  <div className="flex flex-col items-end flex-1 max-md:items-center max-md:py-4">
                    <span className="block mb-2 font-sans text-xs font-medium text-gray-400 uppercase">
                      Kết thúc trong
                    </span>
                    <div className="flex items-center gap-3">
                      {auction.expire_at ? (
                        <Countdown
                          date={moment(auction.expire_at).toDate()}
                          renderer={(props) => (
                            <div className="text-2xl font-semibold text-zinc-800">
                              {props.formatted.hours}:{props.formatted.minutes}:
                              {props.formatted.seconds}
                            </div>
                          )}
                          autoStart={true}
                          overtime={false}
                        />
                      ) : (
                        <div>Chưa bắt đầu</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-stretch mt-4">
                <div className="flex-1">
                  <span className="block mb-2 text-xs font-medium text-gray-400 uppercase">
                    Mô tả
                  </span>
                  <p>{stuff.description}</p>
                </div>
                <div className="flex-1">
                  <IsAuthenticated
                    alternativeComponent={<LoginButton title="Đăng nhập để đấu giá" />}
                  >
                    <IsNot roles={[ROLES.MODERATOR]}>
                      {stuff?.auction && stuff.auction?.status === AuctionStatus.STARTED && (
                        <IsNotOwner
                          authorId={stuff.author.id}
                          user={user}
                        >
                          <NavBottom
                            mount={!isMobile}
                            containerClassName="max-md:max-w-4xl md:justify-end md:!px-0"
                          >
                            <Formik
                              initialValues={initialValues}
                              onSubmit={handlePlaceABid}
                              validationSchema={auctionValidateSchema}
                              validateOnBlur={true}
                            >
                              {({ values, setFieldValue }) => (
                                <Form className="flex flex-col items-end max-md:items-center w-full gap-3 md:max-w-[250px] ">
                                  <div className="w-full max-md:flex-1">
                                    <Input
                                      fullWidth
                                      disabled={isPlacingABid}
                                      placeholder={'Trả giá'}
                                      id="bidding_price"
                                      name="bidding_price"
                                      defaultValue={values.bidding_price}
                                      onFocus={(e) => e.target.select()}
                                      onChange={(e) => {
                                        setFieldValue('bidding_price', e.target.value)
                                      }}
                                      ref={bidInputRef}
                                    />
                                    <ErrorMessage
                                      name="bidding_price"
                                      component="div"
                                      className="mt-1 ml-2 text-sm text-red-600"
                                    />
                                  </div>
                                  <Button
                                    fullWidth
                                    type="submit"
                                    loading={isPlacingABid}
                                    className="max-md:flex-1"
                                  >
                                    Place a bid
                                  </Button>
                                  {!user && (
                                    <p className="text-sm text-gray-400">
                                      Bạn cần đăng nhập để ra giá
                                    </p>
                                  )}
                                </Form>
                              )}
                            </Formik>
                          </NavBottom>
                        </IsNotOwner>
                      )}
                    </IsNot>
                  </IsAuthenticated>
                </div>
              </div>
            </div>
            <IsOwner
              user={user}
              authorId={stuff.author.id}
            >
              <div
                className={cn(
                  'max-md:w-full flex-shrink-0',
                  isShowHistory && 'w-[340px] flex-shrink-0'
                )}
              >
                <div className="flex items-center gap-3">
                  <Tooltip title="Lịch sử đấu giá">
                    <IconButton
                      variant="outlined"
                      color="neutral"
                      onClick={() => {
                        setIsShowHistory(!isShowHistory)
                      }}
                    >
                      <History />
                    </IconButton>
                  </Tooltip>
                  {isShowHistory && <h3 className="text-base">Lịch sử đấu giá</h3>}
                </div>
                {isShowHistory && (
                  <List
                    className="max-h-[600px] overflow-y-auto"
                    dataSource={biddingHistory}
                    renderItem={(h) => (
                      <List.Item>
                        <div className="flex flex-row-reverse items-center justify-between w-full">
                          <div className="flex flex-col items-end">
                            <span className="font-sans">
                              <span className="font-medium">{h.author.auction_nickname}</span>
                            </span>
                            <p className="font-sans text-gray-400">
                              {moment(h.create_at).fromNow()}
                            </p>
                          </div>
                          <div>
                            <span className="font-sans text-lg font-semibold">
                              {h.bid_price} FP
                            </span>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  ></List>
                )}
              </div>
            </IsOwner>
          </div>
          {stuff?.auction &&
            (stuff.auction?.status === AuctionStatus.READY ||
              stuff.auction?.status === AuctionStatus.PENDING) && (
              <NavBottom containerClassName="flex items-center !justify-center w-full">
                <IsOwner
                  user={user}
                  authorId={stuff.author.id}
                >
                  <Button
                    disabled={stuff.auction?.status !== AuctionStatus.READY}
                    loading={isStartingAuction}
                    className="mx-auto max-md:w-full"
                    startDecorator={<Play />}
                    color="info"
                    onClick={handleConfirmStart}
                  >
                    Bắt đầu ngay
                  </Button>
                </IsOwner>
                <IsNotOwner authorId={stuff.author.id}>
                  <Button
                    color="neutral"
                    disabled
                    variant="soft"
                  >
                    Buổi đấu giá vẫn chưa bắt đầu
                  </Button>
                </IsNotOwner>
              </NavBottom>
            )}
        </SectionContainer>
      </Spin>
      <Modal
        open={showMessageModal}
        onClose={() => {
          setShowMessageModal(false)
        }}
        onConfirm={() => {}}
        body={modalMessage.message}
        variant={modalMessage.type || 'info'}
        title={titleMessageModals[modalMessage.type || 'danger']}
      />
      <Button
        size="lg"
        color={'info'}
        sx={{ position: 'fixed', bottom: '90px', right: '30px' }}
        onClick={() => setOpenModal(true)}
      >
        <FeedbackIcon className="my-1 text-3xl" />
      </Button>
      <OtherFeedbackModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        feedbackList={feedbackData?.feedbackList}
        ratingPoints={ratingData?.rating}
      />
    </>
  )
}

StuffDetail.getLayout = getAppLayout

export default StuffDetail
