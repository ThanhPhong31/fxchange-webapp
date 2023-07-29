import { TransactionStatus } from '@/libs/constants'
import { Chip } from '@mui/joy'
import React from 'react'

type Props = {
  status: string
}

function TransactionStatusBadge({ status }: Props) {
  return (
    <div>
      {status === TransactionStatus.WAIT ? (
        <Chip className="!bg-purple-600">Đang đợi</Chip>
      ) : status === TransactionStatus.COMPLETED ? (
        <Chip className="!bg-green-600">Đã hoàn thành</Chip>
      ) : status === TransactionStatus.ONGOING ? (
        <Chip className="!bg-blue-600">Đang bàn giao</Chip>
      ) : status === TransactionStatus.PENDING ? (
        <Chip className="!bg-yellow-600">Đợi ký gửi</Chip>
      ) : (
        <Chip className="!bg-red-600">Đã hủy</Chip>
      )}
    </div>
  )
}

export default TransactionStatusBadge
