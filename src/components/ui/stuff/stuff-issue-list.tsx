import stuffIssueQuery from '@/graphql/queries/stuff-issue-query'
import { Stuff, StuffIssue } from '@/types/model'
import { useMutation } from '@apollo/client'
import { Chip, IconButton, Menu, MenuItem } from '@mui/joy'
import { Modal, Popover, Spin } from 'antd'
import { MoreVertical } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export interface StuffIssueListProps {
  data: StuffIssue[]
}

const StuffIssueList = ({ data }: StuffIssueListProps) => {
  return (
    <div className="p-4 border rounded-xl ">
      {data.map((sti) => (
        <StuffIssueCard
          data={sti}
          key={sti.id}
        />
      ))}
    </div>
  )
}

const StuffIssueCard = ({ data }: { data: StuffIssue }) => {
  const [confirmSolved, { data: updatedStuffIssue, loading, error }] = useMutation(
    stuffIssueQuery.confirm()
  )

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [modal, contextHolder] = Modal.useModal()
  const open = Boolean(anchorEl)
  const router = useRouter()

  const handleConfirmSolved = () => {
    // const issueId = router.query.issueId
    if (!data.id) return
    modal.confirm({
      title: 'Xác nhận vấn đề đã được giải quyết',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        confirmSolved({
          variables: {
            id: data.id,
          },
        })
      },
    })
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const title = 'Vật phẩm: ' + (data.stuff?.name || 'Không xác định')
  const badge = data.solved ? (
    <Chip
      className="!font-sans"
      size="sm"
      title="Đã xử lí"
      color="neutral"
      variant="soft"
    >
      Đã xử lí
    </Chip>
  ) : (
    <Chip
      className="!font-sans"
      size="sm"
      title="Chưa xử lí"
      color="success"
      variant="soft"
    >
      Chưa xử lí
    </Chip>
  )
  const atDashboard = router.asPath.includes('/dashboard')
  const slug = (atDashboard ? '/dashboard/stuff-issues/' : '/issues/') + data.id
  const splitDescription = data.description.split('\n').filter((s) => s.trim() !== '')

  const popoverContent = (
    <div>
      <ul className="list-disc list-inside">
        {splitDescription.map((s) => (
          <li
            className="list-item"
            key={s}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <Spin spinning={loading}>
      <div className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-gray-100">
        <div>
          <Popover
            title={title}
            content={popoverContent}
          >
            <Link href={slug}>
              <h3 className="font-sans text-base font-semibold text-zinc-900 hover:text-primary-700">
                {title}
              </h3>
            </Link>
          </Popover>
          <p className="font-sans text-xs text-gray-600">
            Được tạo {moment(data.create_at).fromNow()}{' '}
            {!atDashboard && `bởi ${data.author?.information.full_name}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {badge}
          <IconButton
            size="sm"
            color="neutral"
            variant="plain"
            onClick={handleClick}
          >
            <MoreVertical
              size={20}
              className="text-gray-500"
            />
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
            {!data.solved ? (
              <MenuItem
                color="neutral"
                onClick={handleConfirmSolved}
              >
                Đã giải quyết
              </MenuItem>
            ) : (
              <MenuItem
                color="neutral"
                // onClick={handleConfirmSolved}
              >
                Xóa
              </MenuItem>
            )}
          </Menu>
        </div>
        {contextHolder}
      </div>
    </Spin>
  )
}

export default StuffIssueList
