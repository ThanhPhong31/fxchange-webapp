import UserAvatar from '../common/user-avartar'
import StuffTypeIcon from '../stuff/stuff-type-icon'
import { Transaction, TransactionStatusEnum, Type } from '@/types/model'
import { MoreVertSharp } from '@mui/icons-material'
import { IconButton } from '@mui/joy'
import { Badge, Tooltip } from 'antd'
import { ArrowLeftRightIcon, MoreHorizontal, MoreVertical } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import colors from 'tailwindcss/colors'

export interface TransactionRowDataProps {
  data: Transaction
  [key: string]: any
}

const TransactionRowData = ({ data, ...props }: TransactionRowDataProps) => {
  return (
    <div
      className="flex items-stretch justify-start p-4 border mb-[-1px] first:rounded-t-md last:rounded-b-md"
      {...props}
    >
      <div className="flex-1">
        <Link href={`./deposit-requests/${data.id}`}>
          <h3 className="text-sm line-clamp-1">{data.stuff.name}</h3>
        </Link>
        <p className="mt-1 text-xs text-gray-500">{data.stuff.category.name}</p>
      </div>
      <div className="flex items-center flex-1">
        <TransactionBadge
          status={data.status}
          type={data.stuff.type.slug as Type}
        />
      </div>
      <div className="flex items-center justify-end flex-1 gap-2">
        <div className="flex items-center gap-1">
          <p className="text-xs mr-3 text-gray-400 ">{moment(data.update_at).fromNow()}</p>
          <div>
            <Tooltip title={data.stuff_owner?.information.full_name}>
              <UserAvatar
                size="sm"
                src={data.stuff_owner?.information.avatar_url}
                alt={data.stuff_owner?.information.full_name}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip title={data.stuff.type.name}>
              <StuffTypeIcon
                type={data.stuff.type?.slug ?? 'default'}
                className="text-slate-400"
                size={20}
              />
            </Tooltip>
          </div>
          {data.stuff.type.slug !== 'auction' && (
            <div>
              <Tooltip title={data.customer?.information.full_name}>
                <UserAvatar
                  size="sm"
                  src={data.customer?.information.avatar_url}
                  alt={data.customer?.information.full_name}
                />
              </Tooltip>
            </div>
          )}
        </div>
        {/* <IconButton
          color="neutral"
          variant="plain"
          size="sm"
        >
          <MoreVertical />
        </IconButton> */}
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

export default TransactionRowData
