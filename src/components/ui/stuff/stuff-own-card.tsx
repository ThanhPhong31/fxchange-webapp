import { Badge as BadgeAnt, Spin } from 'antd';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { AuctionStatus, STUFF_STATUS } from '@/libs/constants';
import cn from '@/libs/utils';
import { Stuff } from '@/types/model';
import { Chip, IconButton, Menu, MenuItem } from '@mui/joy';

import Badge, { badgeVariant } from '../common/badge';
import FxImage from '../common/fx-image';
import { AuctionBadge } from './auction-rowdata';

interface StuffOwnCardProps {
  data: Stuff
  isMod?: boolean
  editLabel?: string
  deleteLabel?: string
  onEdit?: (stuff: Stuff) => void
  onDelete?: (stuff: Stuff) => void
  showType?: boolean
  loading?: boolean
}

function StuffOwnCard({
  loading = false,
  data,
  isMod,
  onDelete,
  onEdit,
  editLabel,
  deleteLabel,
  showType = true,
}: StuffOwnCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    if (onEdit) onEdit(data)
    handleClose()
  }

  const handleDelete = () => {
    if (onDelete) onDelete(data)
    handleClose()
  }

  const isSold = data.status === STUFF_STATUS.sold
  const isHappeningAuction = data.auction?.status === AuctionStatus.STARTED
  const isFinished = data.auction?.status === AuctionStatus.COMPLETED
  const isPending = data.auction?.status === AuctionStatus.PENDING
  console.log({ isMod })
  return (
    <Spin spinning={loading}>
      <BadgeAnt.Ribbon
        color="volcano"
        style={{
          display: !isSold ? 'none' : 'block',
        }}
        text={isSold && 'Đã bán'}
      >
        <div
          className={cn('flex flex-col p-4 pt-0 bg-white h-full border rounded-lg shadow-sm', {
            'bg-gray-100': isSold,
          })}
        >
          <div className="flex items-center justify-between py-[6px]">
            <Link
              target="_blank"
              href={'/' + data.type.slug + '/' + data.id}
            >
              <h3 className="flex items-center gap-2 text-lg py-[6px] cursor-pointer text-neutral-800 hover:underline !line-clamp-1">
                {data.name}
              </h3>
            </Link>
            {!isSold && !isHappeningAuction && !isFinished && (
              <>
                <IconButton
                  color="neutral"
                  onClick={handleClick}
                >
                  <MoreHorizontal />
                </IconButton>
                <Menu
                  id="basic-menu"
                  placement="bottom-end"
                  anchorEl={anchorEl}
                  open={open}
                  sx={{
                    width: 200,
                  }}
                  onClose={handleClose}
                  aria-labelledby="basic-demo-button"
                >
                  {(data.status === 1 || isPending || isMod) && (
                    <MenuItem onClick={handleEdit}>{editLabel || 'Chỉnh sửa'}</MenuItem>
                  )}
                  {
                    <MenuItem
                      color="danger"
                      onClick={handleDelete}
                    >
                      {deleteLabel || 'Xóa'}
                    </MenuItem>
                  }
                </Menu>
              </>
            )}
          </div>
          <Link
            target="_blank"
            href={data.type.slug + '/' + data.id}
          >
            <div className={cn('relative w-full overflow-hidden rounded-lg h-60 aspect-square')}>
              <FxImage
                src={
                  data.media && data.media.length > 0
                    ? data.media[0]
                    : 'https://source.unsplash.com/random'
                }
                alt={data.name}
                className={cn('object-cover w-full h-full', {
                  grayscale: isSold,
                })}
              />
              {data.auction && (
                <div className="absolute px-2 py-1 bg-white rounded-full top-3 left-3">
                  <AuctionBadge
                    className=""
                    status={data.auction.status}
                  />
                </div>
              )}
            </div>
          </Link>
          <div className="pt-3 space-x-2">
            {showType && (
              <Badge
                className=" w-fit"
                variant={badgeVariant[data?.type.slug as keyof { [key: string]: string }]}
              >
                {data?.type.name}
              </Badge>
            )}
            <Chip
              size="sm"
              variant="soft"
              color="neutral"
            >
              {data.category.name}
            </Chip>
          </div>
          <div className="pt-3">
            <p className="text-sm text-gray-500 line-clamp-2">{data.description}</p>
          </div>
        </div>
      </BadgeAnt.Ribbon>
    </Spin>
  )
}

export default StuffOwnCard
