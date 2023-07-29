import { Badge, Tooltip } from 'antd';
import { Ban, MoreVertical, Unlock } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import colors from 'tailwindcss/colors';

import { ROLES } from '@/components/context/auth-context-container';
import needConfirmation, { NeedConfirmationProps } from '@/components/hoc/needConfirmation';
import { useAuth } from '@/contexts/auth-context';
import { DEFAULTS, USER_STATUS } from '@/libs/constants';
import cn from '@/libs/utils';
import { TransactionStatusEnum, Type, UserDetail } from '@/types/model';
import { Button, ButtonProps, Chip, IconButton, Menu, MenuItem } from '@mui/joy';

export interface UserRowDataProps {
  data: UserDetail
  showEmail?: boolean
  onBlock: (user: UserDetail) => void
  onUnBlock: (user: UserDetail) => void
}

const UserRowData = ({ data, showEmail, onBlock, onUnBlock }: UserRowDataProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  // const BlockButton = needConfirmation<ButtonProps & NeedConfirmationProps>(Button, {
  //   title: 'Xác nhận',
  //   description: 'Bạn chắc chắn muốn chặn ' + data.information.full_name + '?',
  //   onConfirm: () => {
  //     console.log('blocking...')
  //   },
  // })

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const hiddenEmail =
    data.information.email.slice(0, 2) +
    '*****@****' +
    data.information.email.slice(data.information.email.length - 2)

  return (
    <Tooltip title={data.status === USER_STATUS.blocked && 'Đã chặn'}>
      <div
        className={cn(
          'flex items-stretch justify-start p-4 border mb-[-1px] first:rounded-t-md last:rounded-b-md hover:bg-gray-50',
          {
            'bg-gray-100': data.status === USER_STATUS.blocked,
          }
        )}
      >
        <div className="flex-1">
          <div className="flex flex-col">
            <Tooltip title={data.information.full_name || DEFAULTS.full_name}>
              <Link href={`./profile/${data.id}`}>
                <h3
                  className={cn('text-sm flex items-center gap-3 line-clamp-1 whitespace-nowrap', {
                    'text-gray-400': data.status === USER_STATUS.blocked,
                  })}
                >
                  {data.information.full_name || DEFAULTS.full_name}
                  {data.status === USER_STATUS.blocked ? (
                    <Badge
                      dot
                      status="error"
                      size="default"
                      className="aspect-square"
                      // size="sm"
                      color="success"
                    />
                  ) : (
                    <Badge
                      dot
                      status="success"
                      size="default"
                      className="aspect-square"
                      // size="sm"
                      color="success"
                    />
                  )}
                </h3>
              </Link>
            </Tooltip>
            <p
              className={cn('mt-1 text-xs text-gray-500', {
                'text-gray-300': data.status === USER_STATUS.blocked,
              })}
            >
              {data.auction_nickname || DEFAULTS.auction_nickname}
            </p>
          </div>
        </div>
        <div className="flex items-center flex-1">
          <span
            className={cn({
              'text-gray-400': data.status === USER_STATUS.blocked,
            })}
          >
            {!showEmail ? hiddenEmail : data.information.email}
          </span>
        </div>
        <div className="flex items-center flex-1">
          <p
            className={cn('text-sm text-gray-600', {
              'text-gray-400': data.status === USER_STATUS.blocked,
            })}
          >
            {moment(data.create_at).format('DD-MM-YYYY')}
          </p>
        </div>
        <div className="flex items-center flex-1">
          <p
            className={cn('text-sm text-gray-600', {
              'text-gray-400': data.status === USER_STATUS.blocked,
            })}
          >
            {moment(data.attendance_dates[data.attendance_dates.length - 1]).format('DD-MM-YYYY')}
          </p>
        </div>
        <div className="flex items-center justify-end flex-1 gap-2">
          {data.role_id !== ROLES.ADMIN && (
            <>
              <IconButton
                color="neutral"
                onClick={handleClick}
                variant="plain"
                size="sm"
              >
                <MoreVertical />
              </IconButton>
              <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                open={open}
                sx={{
                  width: 150,
                }}
                onClose={handleClose}
                aria-labelledby="dropdown-menu"
                placement="bottom-end"
                autoFocus={false}
                color="neutral"
              >
                {data.status === USER_STATUS.active ? (
                  <MenuItem
                    onClick={() => {
                      onBlock(data)
                    }}
                  >
                    <span className="flex items-center gap-3 font-sans">
                      <Ban
                        size={20}
                        className="text-gray-500"
                      />
                      Chặn
                    </span>
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => {
                      onUnBlock(data)
                    }}
                  >
                    <span className="flex items-center gap-3 font-sans">
                      <Unlock
                        size={20}
                        className="text-gray-500"
                      />
                      Gỡ chặn
                    </span>
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </div>
      </div>
    </Tooltip>
  )
}

export const UserRowHeader = () => {
  return (
    <div className="flex items-stretch justify-start px-4 py-3 uppercase text-xs mb-[-1px] first:rounded-t-md last:rounded-b-md">
      <div className="flex-1">
        <h3 className="text-xs">Họ tên</h3>
      </div>
      <div className="flex items-center flex-1">
        <h3 className="text-xs">Email</h3>
      </div>
      <div className="flex items-center flex-1">
        <h3 className="text-xs">Ngày tạo</h3>
      </div>
      <div className="flex items-center flex-1">
        <h3 className="text-xs">Đăng nhập gần nhất</h3>
      </div>
      <div className="flex items-center justify-end flex-1 gap-2">
        <h3 className="text-xs"></h3>
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

export default UserRowData
