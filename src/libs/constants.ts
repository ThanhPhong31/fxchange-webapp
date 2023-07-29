import { Transaction } from '@/types/model'
import { ErrorMessage } from 'formik'

export const excludeRoutes = ['dang-nhap', 'dang-ky']

const exampleData = {
  name: 'Áo phông',
  description: 'Áo phông cỡ L, màu đen',
  type: 'Trao đổi',
  category: '6467d8e463220063c879f62d',
  condition: 80,
  tags: [
    {
      id: 0,
      value: 'M',
    },
    {
      id: 2,
      value: 'Samsung',
    },
  ],
  price: 0,
  type_price: 'point',
}

const categories = [
  {
    id: 1,
    name: 'Quần áo',
    slug: 'quan-ao',
  },
  {
    id: 2,
    name: 'Đồ gia dụng',
    slug: 'do-gia-dung',
  },
  {
    id: 3,
    name: 'Đồ điện tử',
    slug: 'do-dien-tu',
  },
  {
    id: 4,
    name: 'Đồ dùng học tập',
    slug: 'do-dung-hoc-tap',
  },
]

const types = [
  {
    id: 'exchange',
    name: 'Trao đổi',
  },
  {
    id: 'market',
    name: 'Mua bán',
  },
  {
    id: 'đấu giá',
    name: 'Đấu giá',
  },
]

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  // {
  //   id: '123',
  //   amount: 100000,
  //   create_at: new Date(Date.now()),
  //   customer_id: '123',
  //   stuff_owner_id: '456',
  //   expire_at: new Date(Date.now()),
  //   is_pickup: true,
  //   status: 'PENDING',
  //   update_at: new Date(Date.now()),
  //   exchange_stuff_id: '4533',
  //   stuff_id: '3435',
  //   customer: {
  //     id: '12',
  //     information: {
  //       full_name: 'John',
  //       avatar_url: 'abc',
  //     },
  //   },
  // },
]

export const TransactionStatus = {
  CANCELED: 'CANCELED',
  PENDING: 'PENDING',
  ONGOING: 'ONGOING',
  WAIT: 'WAIT',
  COMPLETED: 'COMPLETED',
}

export const AuctionStatus = {
  BLOCKED: 'BLOCKED',
  READY: 'READY',
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
}

export const StuffStatus = {
  ACTIVE: 1,
  INACTIVE: 0,
  SOLD: 2,
  PENDING: 3,
}

export const ConversationType = {
  DISCUSSING: 'DISCUSSING',
  INTRANSACTION: 'INTRANSACTION',
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
}

export const CONDITIONS = [
  {
    value: 20,
    label: 'Có thể sửa chữa',
  },
  { value: 40, label: 'Còn sử dụng tốt' },
  { value: 80, label: 'Hàng sưu tầm' },
  { value: 100, label: 'Hàng hiếm' },
]

export const AUCTION_DURATIONS = [
  { value: 1, label: '1 phút' },
  { value: 2, label: '2 phút' },
  { value: 30, label: '30 phút' },
  { value: 60, label: '1 giờ' },
  { value: 120, label: '2 giờ' },
  { value: 180, label: '3 giờ' },
  { value: 360, label: '6 giờ' },
  { value: 720, label: '12 giờ' },
  { value: 1080, label: '18 giờ' },
  { value: 1440, label: '24 giờ' },
]

export const ErrorMessages = {
  INVALID_AUCTION: 'Ra giá không hợp lệ',
}

export const USER_STATUS = {
  active: 1,
  blocked: 0,
}

export const STUFF_STATUS = {
  inactive: 0,
  active: 1,
  sold: 2,
}

export const DEFAULTS = {
  full_name: 'Người dùng FXchange',
  auction_nickname: 'Chưa cập nhật',
}
