import { TransactionStatus } from '@/libs/constants'
import { getCurrentTransactionStep } from '@/libs/utils'
import { LoadingOutlined } from '@ant-design/icons'
import { Steps } from 'antd'
import React from 'react'

type Props = {
  status: string
  isPickup?: boolean | null
}

function TransactionStepperMarketDetail({ status, isPickup }: Props) {
  return (
    <div className="p-5 mt-1 border-2 rounded-md">
      {isPickup ? (
        <div>
          <Steps
            direction="vertical"
            type="navigation"
            current={getCurrentTransactionStep(status)}
            items={[
              {
                title: 'Đã tiếp nhận yêu cầu ký gửi',
                description: 'Ngày cập nhật trạng thái',
              },
              {
                title: 'Đã ký gửi tại phòng 202',
                description: 'Ngày cập nhật trạng thái',
              },
              {
                title: 'Giao dịch đã hoàn thành',
                description: 'Ngày cập nhật trạng thái',
              },
            ]}
          />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default TransactionStepperMarketDetail
