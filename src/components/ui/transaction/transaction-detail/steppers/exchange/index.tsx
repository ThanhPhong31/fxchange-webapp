import { getCurrentTransactionStep } from '@/libs/utils'
import { LoadingOutlined } from '@ant-design/icons'
import { Steps } from 'antd'
import React from 'react'

type Props = {
  status: string
  isPickup: boolean | null
}

function TransactionStepperExchangeDetail({ status, isPickup }: Props) {
  return (
    <div className="border-2 p-5 rounded-md mt-1">
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
        <div>
          {/* <Steps
            direction="vertical"
            type="navigation"
            current={
              status === 'pending' ? 2 : status === 'on-going' ? 3 : status === 'success' ? 4 : -1
            }
            items={[
              {
                title: 'Đã tiếp nhận yêu cầu ký gửi',
                description: 'Ngày cập nhật trạng thái',
              },
              {
                title: 'Đã ký gửi ở phòng 202',
                description: 'Ngày cập nhật trạng thái',
              },
              {
                title: 'Đã xác nhận đồ ký gửi',
                description: 'Ngày cập nhật trạng thái',
              },
              {
                title: 'Đã nhận được hàng',
                description: 'Ngày cập nhật trạng thái',
              },
              {
                title: 'Giao dịch đã hoàn thành',
                description: 'Ngày cập nhật trạng thái',
              },
            ]}
          /> */}
        </div>
      )}
    </div>
  )
}

export default TransactionStepperExchangeDetail
