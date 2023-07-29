import { Result } from 'antd';
import React from 'react';
import Countdown from 'react-countdown';

import { ModalProps } from '@/types/props';
import { Button } from '@mui/joy';

import Modal from './modal';

interface Props extends ModalProps {
  onStart: () => void
  waitTime: number
}

const StartExchangeModal = ({ open, onClose, onStart, waitTime }: Props) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={onStart}
      title="Bắt đầu trao đổi"
      body={
        <>
          <Result
            status="success"
            title="Bắt đầu trao đổi thành công!"
            subTitle={
              <>
                Cuộc trao đổi sẽ được bắt đầu sau
                <Countdown
                  onComplete={onStart}
                  date={Date.now() + 5000}
                  renderer={({ seconds }) => <div>{seconds} giây.</div>}
                />
              </>
            }
            extra={[
              <Button
                key="buy"
                variant="plain"
                color="neutral"
                onClick={onClose}
              >
                Hủy, tôi đã đổi ý
              </Button>,
              <Button
                color="primary"
                key="console"
                onClick={onStart}
              >
                Bắt đầu ngay
              </Button>,
            ]}
          />
        </>
      }
    />
  )
}

export default StartExchangeModal
