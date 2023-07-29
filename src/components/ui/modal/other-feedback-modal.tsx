import CreateIssueForm from '../form/create-issue-form'
import RatingForm from '../form/rating-form'
import RatingItem from '../rating/rating-item'
import { useAuth } from '@/contexts/auth-context'
import { TransactionStatus } from '@/libs/constants'
import { Transaction } from '@/types/model'
import { Modal, ModalClose, ModalDialog, ModalOverflow } from '@mui/joy'
import { ConfigProvider, Progress, Rate, Spin, Tabs, TabsProps } from 'antd'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'

type FeedBack = {
  id: string
  rating: number
  content: string
  transaction_id: string
  create_at: Date
  update_at: Date
}

type Props = {
  feedbackList: FeedBack[] | undefined
  ratingPoints?: number
  isOpen: boolean
  onClose: () => void
}

function OtherFeedbackModal({ isOpen, onClose, feedbackList, ratingPoints }: Props) {
  const { user } = useAuth()
  const router = useRouter()
  const [ratedPoints, setRatedPoints] = useState<number>(0)
  const [starProgress, setStarProgress] = useState<number[]>([0, 0, 0, 0, 0])
  const [starProgressCount, setStarProgressCount] = useState<number[]>([0, 0, 0, 0, 0])

  useEffect(() => {
    if (ratingPoints) {
      const decimal = ratingPoints - Math.floor(ratingPoints)
      if (decimal < 0.2) {
        setRatedPoints(Math.floor(ratingPoints))
      } else if (decimal > 0.2 && decimal < 0.7) {
        setRatedPoints(Math.floor(ratingPoints) + 0.5)
      } else {
        setRatedPoints(Math.ceil(ratingPoints))
      }
    } else {
      setRatedPoints(0)
    }
  }, [ratingPoints])

  useEffect(() => {
    if (feedbackList) {
      let starProgressClone: number[] = [0, 0, 0, 0, 0]
      let count = 0
      feedbackList.forEach((item, index) => {
        if (item.rating === 5) {
          starProgressClone[0]++
          count++
        } else if (item.rating === 4) {
          starProgressClone[1]++
          count++
        } else if (item.rating === 3) {
          starProgressClone[2]++
          count++
        } else if (item.rating === 2) {
          starProgressClone[3]++
        } else {
          starProgressClone[4]++
          count++
        }
      })
      setStarProgressCount(starProgressClone)
      if (count) {
        starProgressClone.forEach((item, index) => {
          starProgressClone[index] = (item / count) * 100
        })
      }
      setStarProgress(starProgressClone)
    }
  }, [feedbackList])

  console.log(starProgress)

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        zIndex: 90,
      }}
    >
      <ModalOverflow>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          className=""
          layout="center"
        >
          <div className="md:p-1 -mt-2 lg:min-w-[620px] md:min-w-[580px]">
            <h3 className="text-xl">Nhận xét và đánh giá</h3>
            <div className="my-2 mt-4 mx-4">
              <hr />
            </div>
            <div >
              <div className="flex items-center my-4">
                <div className="md:w-3/12 w-4/12">
                  <div>
                    <h4 className="md:text-6xl text-5xl md:ml-8 font-normal">{ratingPoints}</h4>
                  </div>
                  <div>
                    <Rate
                      allowHalf
                      className="text-sm md:ml-8"
                      defaultValue={ratedPoints}
                      value={ratedPoints}
                      disabled={true}
                    />
                  </div>
                  <div className="text-sm md:ml-8 mt-2">{feedbackList?.length} lượt đánh giá</div>
                </div>
                <div className="border-l md:w-9/12 w-8/12 md:pl-4 pl-2">
                  <Progress
                    percent={starProgress[0]}
                    status="normal"
                    format={() => `5`}
                    className="my-0"
                  />
                  <Progress
                    percent={starProgress[1]}
                    status="normal"
                    format={() => `4`}
                    className="my-0"
                  />
                  <Progress
                    percent={starProgress[2]}
                    status="normal"
                    format={() => `3`}
                    className="my-0"
                  />
                  <Progress
                    percent={starProgress[3]}
                    status="normal"
                    format={() => `2`}
                    className="my-0"
                  />
                  <Progress
                    percent={starProgress[4]}
                    status="normal"
                    format={() => `1`}
                    className="my-0"
                  />
                </div>
              </div>
            </div>
            <div className="my-2 mx-4">
              <hr />
            </div>
            <div className="py-2">
              {feedbackList &&
                feedbackList.map((item, index) => {
                  return (
                    <RatingItem
                      key={item.id}
                      feedback={item}
                      completed={true}
                      user={user}
                      isOtherFeedback={true}
                    />
                  )
                })}
              {feedbackList && feedbackList.length === 0 && (
                <div className="text-gray-500 text-base flex justify-center mt-2 select-none">
                  Không có đánh giá nào
                </div>
              )}
            </div>
          </div>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

export default OtherFeedbackModal
