import NotFoundPage from '../404'
import { NextPageWithLayout } from '../_app'
import NotFoundImage from '@/assets/images/image-not-found.jpg'
import IsAuthenticated from '@/components/auth/is-authenticated'
import IsAvailable from '@/components/auth/is-available'
import IsNot from '@/components/auth/is-not'
import IsNotOwner from '@/components/auth/is-not-owner'
import { ROLES } from '@/components/context/auth-context-container'
import useStuffDetail from '@/components/hooks/useStuffDetail'
import LoginButton from '@/components/ui/common/Button/login-button'
import CenterContainer from '@/components/ui/common/center-container'
import NavBottom from '@/components/ui/common/nav-bottom'
import SectionContainer from '@/components/ui/common/section-container'
import SelectStuffDrawer from '@/components/ui/drawer/select-stuff-drawer'
import OtherFeedbackModal from '@/components/ui/modal/other-feedback-modal'
import QuicklyExchangeModal from '@/components/ui/modal/quickly-exchange-modal'
import ExchangeStuffDetail from '@/components/ui/stuff/stuff-detail/exchange'
import RecommendStuffs from '@/components/ui/stuff/stuff-detail/recommend-stuff-list'
import SuggestExchangeStuffs from '@/components/ui/stuff/stuff-detail/suggest-exchange-stuff-list'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import { useChat } from '@/contexts/chat-context'
import stuffQuery, {
  GET_OTHER_FEEDBACK_BY_ID,
  GET_OTHER_RATING_BY_ID,
} from '@/graphql/queries/stuff-query'
import { SuggestedStuffGraphQLResponse, SuggestedStuffListGraphQLResponse } from '@/types/common'
import { Stuff } from '@/types/model'
import { useLazyQuery, useMutation } from '@apollo/client'
import FeedbackIcon from '@mui/icons-material/Feedback'
import { Button, CircularProgress } from '@mui/joy'
import { useMediaQuery } from '@mui/material'
import { ConfigProvider, Tabs, TabsProps } from 'antd'
import _ from 'lodash'
import { MessageCircle } from 'lucide-react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import colors from 'tailwindcss/colors'

type FeedBack = {
  id: string
  rating: number
  content: string
  transaction_id: string
  create_at: Date
  update_at: Date
}

const StuffDetailPage: NextPageWithLayout = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const isMobile = useMediaQuery('(max-width:768px)')
  const router = useRouter()
  const [quicklyChangeOpen, setQuicklyChangeOpen] = useState(false)
  const { joinConversation, onChangeConversation, setIsDiscussion } = useChat()
  const { stuff, loadingStuff, recommendStuffs, errorRecommendStuff, errorStuff } = useStuffDetail({
    id: (router.query.stuffId as string) || null,
  })
  const [
    addSuggestStuff,
    { data: newSuggestedStuffResponse, loading: suggesting, error: errorSuggestStuff, called },
  ] = useMutation<SuggestedStuffGraphQLResponse>(stuffQuery.suggestStuff())
  const [
    getSuggestedStuff,
    {
      data: suggestedStuffListResponse,
      refetch: refetchSuggest,
      subscribeToMore,
      loading: loadingSuggestedStuffList,
    },
  ] = useLazyQuery<SuggestedStuffListGraphQLResponse>(stuffQuery.getExchangeSuggestStuff(), {
    fetchPolicy: 'network-only',
  })
  const [getOtherRatingById, { data: ratingData, loading: ratingLoading, error: ratingError }] =
    useLazyQuery<{ rating: number }>(GET_OTHER_RATING_BY_ID)
  const [
    getOtherFeedbackById,
    { data: feedbackData, loading: feedbackLoading, error: feedbackError },
  ] = useLazyQuery<{ feedbackList: FeedBack[] }>(GET_OTHER_FEEDBACK_BY_ID)
  const { notifySuccess, notifyError, onOpenChatDrawer } = useApp()
  const { user, isValidating } = useAuth()
  const [showSelectStuffDrawer, setShowSelectStuffDrawer] = useState(false)

  const handleStartConversation = async () => {
    if (!stuff || !stuff?.author?.id) return
    setIsDiscussion(true)
    onOpenChatDrawer()
    if (stuff.author.id === user?.uid) return onChangeConversation(null)
    joinConversation(stuff.author.id, 'DISCUSSING', stuff.id)
  }

  const handleRefetchSuggestedStuffList = useCallback(() => {
    const stuffId = router.query.stuffId
    if (stuffId) refetchSuggest({ id: stuffId })
  }, [refetchSuggest, router.query.stuffId])

  useEffect(() => {
    const stuffId = router.query.stuffId
    if (stuffId && stuff) {
      getSuggestedStuff({
        variables: {
          id: stuffId,
        },
      })
    }
  }, [getSuggestedStuff, router, stuff])

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
    if (newSuggestedStuffResponse && !errorSuggestStuff) {
      const stuffName = newSuggestedStuffResponse.suggestedStuff?.suggest_stuff.name
      notifySuccess('Đề xuất thành công.', `${stuffName} đã được đề xuất thành công.`)
      handleRefetchSuggestedStuffList()
      // setTimeout(() => {
      //   refetchSuggest()
      // }, 500)
    } else if (errorSuggestStuff) {
      notifyError(
        'Chưa thể đề xuất',
        `Trong quá trình xử lí đã xảy ra lỗi. Bạn vui lòng thử lại sau.`
      )
    }
  }, [
    errorSuggestStuff,
    newSuggestedStuffResponse,
    notifySuccess,
    notifyError,
    refetchSuggest,
    router,
    handleRefetchSuggestedStuffList,
  ])

  const handleSelectStuff = useCallback(
    async (stuff: Stuff) => {
      const stuffId = router.query.stuffId
      if (!stuff || !stuffId) return // TODO: handle show error message or something.
      addSuggestStuff({
        variables: {
          input: {
            stuff_id: stuffId,
            suggest_stuff_id: stuff?.id,
          },
        },
      })
      setShowSelectStuffDrawer(false)
    },
    [addSuggestStuff, router.query.stuffId]
  )

  const isAuthor = useMemo(() => user?.uid === stuff?.author?.id, [user, stuff])
  if (isValidating || loadingStuff) {
    return (
      <CenterContainer>
        <CircularProgress />
      </CenterContainer>
    )
  }
  console.log({ stuff })
  if (!stuff || errorStuff || _.isEmpty(stuff)) {
    return <NotFoundPage />
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Gợi ý trao đổi`,
      children: (
        <>
          {router.query.stuffId && (
            <SuggestExchangeStuffs
              loading={loadingSuggestedStuffList}
              stuffs={suggestedStuffListResponse?.suggestedStuffList || []}
              stuffId={router.query.stuffId as string}
              isOwner={stuff?.author?.id === user?.uid}
            />
          )}
        </>
      ),
    },
    {
      key: '2',
      label: `FXchange đề xuất`,
      children: <>{recommendStuffs && <RecommendStuffs stuffs={recommendStuffs} />}</>,
    },
  ]

  return (
    <>
      <NextSeo
        title={stuff.name + ' | FXchange'}
        description={
          stuff?.description + ' - Đăng bởi ' + (stuff?.author?.information.full_name || 'Ẩn danh')
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
      <div className="grid gap-6 max-md:gap-3 max-md:-mx-3 max-md:grid-cols-1 grid-cols-stuff_detail max-lg:grid-cols-stuff_detail_lg">
        {stuff && (
          <SectionContainer>
            {ratingData ? (
              <ExchangeStuffDetail
                stuff={stuff}
                ratingPoints={ratingData.rating}
              />
            ) : (
              <></>
            )}
            <NavBottom mount={!isMobile}>
              <div className="flex justify-between w-full">
                <IsAuthenticated
                  alternativeComponent={<LoginButton title="Đăng nhập để trao đổi" />}
                >
                  <IsNot roles={[ROLES.MODERATOR]}>
                    <div className="flex items-center w-full gap-2 mx-auto">
                      <IsNotOwner
                        authorId={stuff.author.id}
                        user={user}
                      >
                        <IsAvailable status={stuff.status}>
                          <Button
                            size="md"
                            fullWidth
                            onClick={() => {
                              setQuicklyChangeOpen(true)
                            }}
                          >
                            Trao đổi ngay
                          </Button>
                          <Button
                            size="md"
                            fullWidth
                            variant="soft"
                            color="primary"
                            onClick={() => setShowSelectStuffDrawer(true)}
                          >
                            Chọn từ tủ đồ
                          </Button>
                        </IsAvailable>
                        <QuicklyExchangeModal
                          isOpen={quicklyChangeOpen}
                          onClose={() => setQuicklyChangeOpen(false)}
                          onFinish={() => {
                            setQuicklyChangeOpen(false)
                            handleRefetchSuggestedStuffList()
                          }}
                          stuff={stuff}
                        />
                      </IsNotOwner>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          onClick={handleStartConversation}
                          size="md"
                          variant="soft"
                          color="neutral"
                          startDecorator={<MessageCircle />}
                        >
                          Hỏi đáp
                        </Button>
                      </div>
                    </div>
                  </IsNot>
                </IsAuthenticated>
              </div>
            </NavBottom>
          </SectionContainer>
        )}
        <SectionContainer className="bg-white">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: colors.zinc[900],
              },
            }}
          >
            <Tabs
              className="font-sans"
              tabBarStyle={{
                padding: '0 16px',
              }}
              defaultActiveKey="1"
              items={isAuthor ? items : items.filter((i) => !isAuthor && i.key === '1')}
            />
          </ConfigProvider>
        </SectionContainer>
        <SelectStuffDrawer
          title="Tủ đồ của bạn"
          open={showSelectStuffDrawer}
          onClose={() => setShowSelectStuffDrawer(false)}
          onConfirm={handleSelectStuff}
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
      </div>
    </>
  )
}

export default StuffDetailPage
