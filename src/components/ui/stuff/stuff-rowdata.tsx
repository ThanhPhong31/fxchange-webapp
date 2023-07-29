import { Badge, Tooltip } from 'antd';
import { ArrowLeftRightIcon, MoreHorizontal, MoreVertical } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import colors from 'tailwindcss/colors';

import { Stuff, Transaction, TransactionStatusEnum, Type } from '@/types/model';
import { MoreVertSharp } from '@mui/icons-material';
import { IconButton } from '@mui/joy';

import UserAvatar from '../common/user-avartar';

export interface StuffRowDataProps {
  data: Stuff
}

const StuffRowData = ({ data }: StuffRowDataProps) => {
  return (
    <div className="flex items-stretch justify-start p-4 border mb-[-1px] first:rounded-t-md last:rounded-b-md">
      <div className="flex-1">
        <Link href={`./stuff-inventory/${data.id}`}>
          <h3 className="text-sm">{data.name}</h3>
        </Link>
        <p className="mt-1 text-xs text-gray-500">{data.category.name}</p>
      </div>
      <div className="flex items-center flex-1">
        {/* {data.st} */}
        {/* <TransactionBadge
          status={data.status}
          type={data.type.slug as Type}
        /> */}
      </div>
      <div className="flex items-center justify-end flex-1 gap-2">
        <div className="flex items-center gap-1">
          <p className="text-xs mr-3 text-gray-400 ">{moment(data.update_at).fromNow()}</p>
          <div>
            <Tooltip title={data.author.information.full_name}>
              <UserAvatar
                size="sm"
                src={data.author?.information.avatar_url}
                alt={data.author?.information.full_name}
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

export const TransactionBadge = ({
  status,
  type,
}: {
  status: TransactionStatusEnum
  type?: Type
}) => {
  const badgeTitles: {
    [key: string]: {
      [key: string]: string
    }
  } = {
    common: {
      CANCELED: 'Đã hủy',
      PENDING: 'Đợi ký gửi',
      ONGOING: 'Đang bàn giao',
      WAIT: 'Đang đợi',
      COMPLETED: 'Đã hoàn thành',
    },
    exchange: {
      CANCELED: 'Đã hủy',
      PENDING: 'Đợi ký gửi',
      ONGOING: 'Đang trao đổi',
      WAIT: 'Đang đợi',
      COMPLETED: 'Đã hoàn thành',
    },
  }

  const badgeColors = {
    CANCELED: colors.red[500],
    PENDING: colors.amber[500],
    ONGOING: colors.sky[500],
    WAIT: colors.purple[500],
    COMPLETED: colors.emerald[500],
  }

  const badgeTitle = badgeTitles[type === 'exchange' ? type : 'common'][status]

  return (
    <Badge
      size="default"
      text={badgeTitle}
      color={badgeColors[status]}
      style={{
        fontWeight: 500,
        color: colors.gray[500],
      }}
    />
  )
}

export default StuffRowData
