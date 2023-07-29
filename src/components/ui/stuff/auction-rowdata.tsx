import { Badge, Tooltip } from 'antd';
import { MoreVertical } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import colors from 'tailwindcss/colors';

import { WithClassName } from '@/types/common';
import { Auction, AuctionStatusEnum, TransactionStatusEnum, Type } from '@/types/model';
import { IconButton } from '@mui/joy';

import UserAvatar from '../common/user-avartar';

export interface AuctionRowDataProps {
  data: Auction
}

const AuctionRowData = ({ data }: AuctionRowDataProps) => {
  return (
    <div className="flex items-stretch justify-start p-4 border mb-[-1px] first:rounded-t-md last:rounded-b-md">
      <div className="flex-1">
        <Link href={`./auction-requests/${data.stuff_id}`}>
          <h3 className="text-sm">{data.stuff.name}</h3>
        </Link>
        <p className="mt-1 text-xs text-gray-500">{data.stuff.category.name}</p>
      </div>
      <div className="flex items-center flex-1">
        {/* {data.st} */}
        <AuctionBadge status={data.status} />
      </div>
      <div className="flex items-center justify-end flex-1 gap-2">
        <div className="flex items-center gap-1">
          <p className="mr-3 text-xs text-gray-400 ">{moment(data.update_at).fromNow()}</p>
          <div>
            <Tooltip title={data.stuff.author.information.full_name}>
              <UserAvatar
                size="sm"
                src={data.stuff.author?.information.avatar_url}
                alt={data.stuff.author?.information.full_name}
              />
            </Tooltip>
          </div>
        </div>
        <IconButton
          color="neutral"
          variant="plain"
          size="sm"
        >
          <MoreVertical />
        </IconButton>
      </div>
    </div>
  )
}

export const AuctionBadge = ({
  status,
  className,
}: { status: AuctionStatusEnum } & WithClassName) => {
  const badgeTitles: {
    [key: string]: string
  } = {
    BLOCKED: 'Đã chặn',
    READY: 'Đã duyệt',
    PENDING: 'Đang đợi duyệt',
    STARTED: 'Đã bắt đầu',
    COMPLETED: 'Đã kết thúc',
    CANCELED: 'Đã hủy',
  }

  const badgeColors: { [key: string]: string } = {
    CANCELED: colors.red[500],
    READY: colors.emerald[500],
    PENDING: colors.amber[500],
    STARTED: colors.sky[500],
    BLOCKED: colors.purple[500],
    COMPLETED: colors.emerald[500],
  }

  const badgeTitle = badgeTitles[status]

  return (
    <Badge
      className={className}
      size="default"
      text={badgeTitle}
      color={badgeColors[status] as string}
      style={{
        fontWeight: 500,
        color: colors.gray[500],
      }}
    />
  )
}

export default AuctionRowData
