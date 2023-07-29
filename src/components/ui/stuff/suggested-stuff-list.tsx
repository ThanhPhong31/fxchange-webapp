import { List, Tooltip } from 'antd';
import { ArrowLeftRight } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';

import needConfirmation, { NeedConfirmationProps } from '@/components/hoc/needConfirmation';
import { SuggestedStuff } from '@/types/model';
import { Button, ButtonProps } from '@mui/joy';

import ConditionChip from '../common/condition-chip';
import FxImage from '../common/fx-image';
import ImageNotFound from '../common/image-not-found';
import SectionContainer from '../common/section-container';
import UserCard from '../common/user-card';

interface SuggestedStuffListProps {
  stuffs?: SuggestedStuff[]
  isRecommendList?: boolean
  onConfirm: (stuff: SuggestedStuff) => void
  isOwner?: boolean
}

type CustomButtonProps = ButtonProps & NeedConfirmationProps

const SuggestedStuffList = ({
  stuffs,
  isRecommendList,
  onConfirm,
  isOwner = false,
}: SuggestedStuffListProps) => {
  const NeedConfirmButton = needConfirmation<CustomButtonProps>(Button, {
    title: 'Xác nhận trao đổi',
    description: 'Bạn chắc chắn muốn trao đổi?',
    onConfirm: () => {},
  })

  return (
    <div
      className={`grid w-full ${
        isRecommendList ? 'grid-cols-1' : 'grid-cols-2'
      } gap-4 max-md:gap-3 max-sm:grid-cols-1 max-md:grid-cols-1`}
    >
      {stuffs &&
        stuffs.length > 0 &&
        stuffs.map((item) => (
          <SectionContainer
            key={item.id}
            className="relative p-4 overflow-hidden bg-white border max-md:p-2 rounded-xl"
          >
            <div className="relative min-h-[200px] bg-slate-100 rounded-xl mb-2 overflow-hidden">
              {item.suggest_stuff.media && item.suggest_stuff.media.length > 0 ? (
                <Image
                  quality={60}
                  width={500}
                  height={300}
                  className="object-cover w-full !h-full"
                  referrerPolicy="no-referrer"
                  src={item.suggest_stuff.media[0] as string}
                  alt="stuff image"
                />
              ) : (
                <ImageNotFound />
              )}
              {item.suggest_stuff.condition && (
                <ConditionChip
                  className="!absolute top-3 left-3"
                  value={item.suggest_stuff.condition}
                  size="sm"
                />
              )}
            </div>
            <div className="w-full bg-white min-h-[50px]">
              <UserCard
                avatarSize="sm"
                avatarUrl={item.suggest_stuff.author.information.avatar_url}
                username={item.suggest_stuff.author.information.full_name}
                userNameClassName="text-xs"
                additionalInformation={
                  <p className="text-xs font-medium text-gray-400 max-md:text-base">
                    {moment(item.update_at).locale('vi').format('HH:mm DD/MM/YYYY')}
                  </p>
                }
              />
              <Tooltip title={item.suggest_stuff.name}>
                <h3 className="mt-2 mb-4 text-base font-semibold cursor-pointer line-clamp-1">
                  {item.suggest_stuff.name}
                </h3>
              </Tooltip>
              {isOwner && (
                <div className="mt-3">
                  <NeedConfirmButton
                    startDecorator={<ArrowLeftRight />}
                    color="info"
                    size="md"
                    fullWidth
                    variant="soft"
                    onClick={() => onConfirm(item)}
                  >
                    Trao đổi
                  </NeedConfirmButton>
                </div>
              )}
            </div>
          </SectionContainer>
        ))}
    </div>
  )
}

export default SuggestedStuffList
