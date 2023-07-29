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
import MarketStuffDetail from '@/components/ui/stuff/stuff-detail/market'
import RecommendStuffs from '@/components/ui/stuff/stuff-detail/recommend-stuff-list'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import { useChat } from '@/contexts/chat-context'
import stuffQuery, {
  GET_OTHER_FEEDBACK_BY_ID,
  GET_OTHER_RATING_BY_ID,
} from '@/graphql/queries/stuff-query'
import { Stuff } from '@/types/model'
import { useLazyQuery } from '@apollo/client'
import FeedbackIcon from '@mui/icons-material/Feedback'
import { Button, CircularProgress, Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { useMediaQuery } from '@mui/material'
import _ from 'lodash'
import { MessageCircle } from 'lucide-react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
  const isMobile = useMediaQuery('(max-width: 768px)')
  const router = useRouter()
  const { onOpenChatDrawer, notify } = useApp()
  const { joinConversation, onChangeConversation, setIsDiscussion } = useChat()
  const { user } = useAuth()
  const [showSelectStuffDrawer, setShowSelectStuffDrawer] = useState(false)
  const {
    stuff,
    recommendStuffs,
    errorRecommendStuff,
    errorStuff,
    loadingStuff,
    loadingRecommendStuff,
  } = useStuffDetail({
    id: (router.query.stuffId as string) || undefined,
  })
  const [getOtherRatingById, { data: ratingData, loading: ratingLoading, error: ratingError }] =
    useLazyQuery<{ rating: number }>(GET_OTHER_RATING_BY_ID)
  const [
    getOtherFeedbackById,
    { data: feedbackData, loading: feedbackLoading, error: feedbackError },
  ] = useLazyQuery<{ feedbackList: FeedBack[] }>(GET_OTHER_FEEDBACK_BY_ID)

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

  if (loadingStuff)
    return (
      <CenterContainer>
        <CircularProgress />
      </CenterContainer>
    )

  if (!stuff || errorStuff || _.isEmpty(stuff)) {
    return <NotFoundPage />
  }

  const handleStartConversation = async () => {
    if (!stuff || !stuff?.author?.id) return
    onOpenChatDrawer()
    setIsDiscussion(true)
    if (stuff.author.id === user?.uid) return onChangeConversation(null)
    joinConversation(stuff.author.id, 'DISCUSSING', stuff.id)
  }

  const handleBuyNow = (stuff: Stuff) => {
    if (!user)
      return notify({
        type: 'warning',
        title: 'Bạn cần đăng nhập để mua món đồ này.',
        duration: 0,
      })
    if (stuff.price > user?.point) {
      return notify({
        type: 'warning',
        title: 'Không đủ điểm',
        description:
          'Bạn có thể nhận thêm điểm khi điểm danh hằng ngày hoặc mời bạn bè tham gia FXchange',
        duration: 0,
      })
    }

    router.push('/market/checkout?stuffId=' + stuff.id)
  }

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
      <div className="grid max-lg:gap-3 gap-4 max-md:grid-cols-1 max-md:-mx-3 max-md:rounded-none grid-cols-stuff_detail max-lg:grid-cols-stuff_detail_lg mb-[40px] lg:mb-0">
        {stuff && (
          <SectionContainer>
            <MarketStuffDetail
              stuff={stuff}
              ratingPoints={ratingData?.rating}
            />
            <IsNotOwner
              authorId={stuff.author.id}
              user={user}
            >
              <NavBottom mount={!isMobile}>
                <div className="flex justify-between w-full">
                  <IsAuthenticated
                    alternativeComponent={<LoginButton title="Đăng nhập để mua ngay" />}
                  >
                    <IsNot roles={[ROLES.MODERATOR]}>
                      <div className="flex items-center w-full gap-2">
                        <IsAvailable status={stuff.status}>
                          <Button
                            size="lg"
                            fullWidth
                            onClick={() => {
                              handleBuyNow(stuff)
                            }}
                          >
                            Mua ngay
                          </Button>
                        </IsAvailable>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            onClick={handleStartConversation}
                            size="lg"
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
            </IsNotOwner>
          </SectionContainer>
        )}
        <SectionContainer>
          <div className="px-3 pt-5 pb-3">
            <h3 className="font-sans text-xl font-semibold">Có thể bạn sẽ thích</h3>
          </div>
          {recommendStuffs ? <RecommendStuffs stuffs={recommendStuffs} /> : <></>}
        </SectionContainer>
        <SelectStuffDrawer
          title="Đồ của bạn"
          open={showSelectStuffDrawer}
          onClose={() => setShowSelectStuffDrawer(false)}
          onConfirm={() => {}}
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
