import Banner from '@/components/ui/common/Banner'
import { Button } from '@mui/joy'
import { Result } from 'antd'
import React from 'react'

const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Âu nâu, trang này hiện không tồn tại"
      extra={
        <Button
          variant="solid"
          color="info"
        >
          Trở lại trang chủ
        </Button>
      }
    />
  )
}

export default NotFoundPage
