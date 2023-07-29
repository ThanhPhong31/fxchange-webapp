import { useApp } from '@/contexts/app-context'
import { ModalProps } from '@/types/props'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Radio,
  radioClasses,
  RadioGroup,
  Sheet,
  Typography,
} from '@mui/joy'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

type TransactionChoice = 'pickup' | 'independent'
interface ScheduleModalProps extends ModalProps {
  onConfirmExchange: (isPickup: boolean, expireAt?: Date | null) => void
  loading: boolean
}

const ScheduleModal = ({
  onClose,
  open,
  title,
  onConfirmExchange,
  loading,
}: ScheduleModalProps) => {
  const { messageApi } = useApp()
  const [isPickup, setIsPickup] = useState<boolean>(true)
  const [currentStep, setCurrentStep] = useState<number>(1)

  const handleFinishStepOne = (choice: TransactionChoice) => {
    const nextStep = choice === 'pickup' ? 3 : 2
    setIsPickup(choice === 'pickup')
    setCurrentStep(nextStep)
  }

  useEffect(() => {
    if (!open) {
      setCurrentStep(1)
    }

    return () => {
      setCurrentStep(1)
    }
  }, [open])

  const handleSubmit = (date?: Date) => {
    if (!isPickup && !date) return messageApi?.warning('Vui lòng chọn ngày giao đổi dự kiến')
    onConfirmExchange(isPickup, date)
  }

  const Steps: { [key: number]: React.ReactNode } = {
    '1': (
      <StepOne
        onClose={onClose}
        onFinish={handleFinishStepOne}
      />
    ),
    '2': (
      <StepIndependent
        loading={loading}
        onClose={() => setCurrentStep(1)}
        onFinish={handleSubmit}
      />
    ),
    '3': (
      <StepPickUp
        loading={loading}
        onClose={() => setCurrentStep(1)}
        onFinish={handleSubmit}
      />
    ),
  }

  return (
    <Modal
      title={title}
      open={!!open}
      onClose={() => onClose()}
      sx={{
        zIndex: 1000,
      }}
    >
      <ModalOverflow>
        <ModalDialog
          className="!min-w-[600px]"
          aria-labelledby="layout-modal-title"
          aria-describedby="layout-modal-description"
          layout="center"
        >
          <ModalClose />
          {Steps[currentStep]}
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  )
}

interface StepProps {
  onClose: () => void
  onFinish: (date?: Date) => void
  loading: boolean
}

const StepOne = ({
  onClose,
  onFinish,
}: {
  onClose: () => void
  onFinish: (choice: TransactionChoice) => void
}) => {
  const [choice, setChoice] = useState<TransactionChoice | null>(null)

  useEffect(() => {
    return () => {
      setChoice(null)
    }
  }, [])

  return (
    <>
      <h3 className="mb-3">Chọn phương thức giao dịch</h3>
      <FormControl>
        <RadioGroup
          overlay
          name="member"
          onChange={(e) => setChoice(e.target.value as TransactionChoice)}
          orientation="horizontal"
          sx={{ gap: 2, mt: 1, width: '100%' }}
        >
          <Sheet
            component="label"
            key="pickup"
            variant="outlined"
            sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              boxShadow: 'sm',
              borderRadius: 'md',
              bgcolor: 'background.body',
              gap: 1.5,
            }}
          >
            <Radio
              checkedIcon={<CheckCircleRoundedIcon />}
              value="pickup"
              sx={{
                mt: -1,
                mr: -1,
                mb: 0.5,
                alignSelf: 'flex-end',
                '--Radio-actionRadius': (theme) => theme.vars.radius.md,
              }}
            />
            <h1 className="font-bold text-7xl text-slate-100">FX</h1>
            <h3 className="text-lg">Ký gửi tại FXchange</h3>
          </Sheet>
          <Sheet
            component="label"
            key="independent"
            variant="outlined"
            sx={{
              flex: 1,

              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              boxShadow: 'sm',
              borderRadius: 'md',
              bgcolor: 'background.body',
              gap: 1.5,
            }}
          >
            <Radio
              checkedIcon={<CheckCircleRoundedIcon />}
              value="independent"
              sx={{
                mt: -1,
                mr: -1,
                mb: 0.5,
                alignSelf: 'flex-end',
                '--Radio-actionRadius': (theme) => theme.vars.radius.md,
              }}
            />
            <h1 className="font-bold text-7xl text-slate-100">Self</h1>
            <h3 className="text-lg">Tự giao dịch</h3>
          </Sheet>
        </RadioGroup>
      </FormControl>
      <div className="flex items-center w-full mt-6 ml-auto">
        <Button
          fullWidth
          color="neutral"
          variant="plain"
          onClick={onClose}
        >
          Hủy
        </Button>
        <Button
          fullWidth
          color="primary"
          onClick={() => {
            if (!choice) throw new Error('You must select one.')

            onFinish(choice)
          }}
        >
          Tiếp tục
        </Button>
      </div>
    </>
  )
}

const StepIndependent = ({ onClose, onFinish, loading }: StepProps) => {
  const { messageApi } = useApp()
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const onChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date)
    } else {
      console.log('Clear')
    }
  }

  const handleSubmit = () => {
    if (!selectedDate) return messageApi?.warning('Vui lòng chọn ngày giao dịch dự kiến.')
    onFinish(selectedDate?.toDate())
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-zinc-800">Ngày giao dịch dự kiến</h3>
      <p className="mb-6">Để cuộc trao đổi diễn ra dễ dàng hơn, bạn hãy chọn ngày gặp mặt</p>
      <div className="flex items-center gap-5 ">
        <div className="flex items-center flex-1">
          <span className="mr-3 font-medium">Ngày</span>
          <DatePicker
            className="w-full"
            presets={[
              { label: 'Yesterday', value: dayjs().add(-1, 'd') },
              { label: 'Last Week', value: dayjs().add(-7, 'd') },
              { label: 'Last Month', value: dayjs().add(-1, 'month') },
            ]}
            onChange={(date) => {
              onChange(date)
            }}
          />
        </div>
      </div>
      <div className="flex items-center w-full mt-6 ml-auto">
        <Button
          fullWidth
          color="neutral"
          variant="plain"
          loading={loading}
          onClick={onClose}
        >
          Trở lại
        </Button>
        <Button
          disabled={!selectedDate}
          fullWidth
          loading={loading}
          color="primary"
          onClick={handleSubmit}
        >
          Xác nhận
        </Button>
      </div>
    </>
  )
}

const StepPickUp = ({ onClose, onFinish, loading }: StepProps) => {
  return (
    <>
      <h3 className="text-lg font-semibold text-zinc-800">Lưu ý về việc ký gửi</h3>
      <p className="max-w-md mt-3 mb-6">
        Để thuận tiện trong việc giao dịch, Bạn vui lòng ký gửi đồ trong vòng 3 ngày kể từ ngày hôm
        nay. Nếu sau 3 ngày, FXchange vẫn chưa nhận được hàng, giao dịch sẽ tự động hủy.
      </p>
      <div className="flex items-center w-full mt-6 ml-auto">
        <Button
          fullWidth
          color="neutral"
          variant="plain"
          onClick={onClose}
          loading={loading}
        >
          Trở lại
        </Button>
        <Button
          fullWidth
          color="primary"
          onClick={() => onFinish()}
          loading={loading}
        >
          Xác nhận
        </Button>
      </div>
    </>
  )
}

export default ScheduleModal
