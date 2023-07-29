import { Role } from '@/services/auth.service';

export type Type = 'exchange' | 'market' | 'auction' | 'donate' | 'default'
export interface Stuff {
  id: string
  name: string
  description: string
  condition: number
  payment_type: {
    id?: string
    name?: string
    slug?: string
  }
  type: {
    id?: string
    name?: string
    slug?: string
  }
  category: {
    id?: number
    name?: string
    slug?: string
  }
  status?: number
  auction?: Auction
  tags?: StuffTag[]
  price: number
  media?: string[]
  author: UserDetailInResponse
  type_price: StuffTypePrice
  create_at: string
  update_at?: string
}

export type StuffTypePrice = 'point' | 'money'

export interface StuffType {
  id: string
  name: string
  slug: string
}

export interface StuffCategory {
  id: string
  name: string
  slug: string
}

export interface StuffTag {
  id: string
  tag: Tag
  value: any
}

export interface Tag {
  id: number
  name?: string
  values?: TagValue[]
}

export interface TagValue {
  slug?: string
  value?: string
}

export interface User {
  uid: string | null
  full_name: string | null
  email: string | null
  avatar_url: string | null
  phone?: string | null
  address?: string | null
  role: Role
  point: number
  auction_nickname?: string
  invitation_code: string
  need_update?: boolean
}

export interface UserDetailInResponse {
  id: string
  information: {
    avatar_url?: string
    full_name?: string
  }
}

export interface UserDetail {
  id: string
  attendance_dates: Date[]
  information: {
    avatar_url?: string
    full_name?: string
    email: string
  }
  auction_nickname: string
  status: number
  role_id: number
  create_at?: Date
  update_at?: Date
}

export interface UserDetailInAuctionResponse {
  auction_nickname?: string
  invitation_code?: string
}

export interface UserDetailInMessage {
  id: string
  information?: {
    avatar_url?: string
    full_name?: string
  }
}

export declare enum Role {
  ADMIN = 0,
  MODERATOR = 1,
  MEMBER = 2,
}

export interface CommentInput {
  id: string
  author_id: string
  stuff_id: string
  content: string
  parent_id?: string
  active: boolean
}

export interface CommentSocketResponse {
  comment: Comment
  temp_id: string
}
export interface Comment {
  id?: string
  author_id: string
  author?: UserDetailInResponse
  stuff_id: string
  content: string
  children?: Comment[]
  create_at?: Date
  update_at?: Date
  active: boolean
}

export type ConversationTypeEnum = 'DISCUSSING' | 'INTRANSACTION' | 'INACTIVE' | 'ACTIVE'

export interface Conversation {
  id: string
  author: UserDetailInResponse
  channel_id: string
  status: ConversationTypeEnum
  messages?: Message[]
  stuff?: Stuff
  exchange_stuff?: Stuff
  last_message?: Message
  participants?: UserDetailInResponse[]
}

export interface MessageInput {
  external_id: string
  channel_id: string
  content: string
}

export interface Message {
  id?: string
  external_id?: string
  sender_id?: string
  sender?: UserDetailInMessage
  channel_id: string
  content: string
  create_at?: Date
  active?: boolean
}

export interface SuggestedStuff {
  id: string
  target_stuff_id: string
  target_stuff: Stuff
  suggest_stuff: Stuff
  suggest_stuff_id: string
  status: number
  create_at: Date
  update_at: Date
}

export interface AuthResponse {
  message: string
  data: {
    uid: string
    email?: string
    full_name?: string
    role: Role
    point: number
    photo_url?: string
    auction_nickname?: string
    invitation_code: string
    phone?: string
    need_update?: boolean
  }
}

export interface Notification {
  id?: string
  content: string
  target_id: String
  target_url: string
  type_slug: string
  type: NotificationType
  actor_id: string
  actor: UserDetailInResponse
  receiver_ids: string[]
  is_read: boolean
  create_at: Date
  update_at?: Date
}

export type NotificationType = {
  id: string
  name: string
  slug: string
  create_at: Date
  update_at?: Date
}

export type TransactionStatusEnum = 'CANCELED' | 'PENDING' | 'ONGOING' | 'WAIT' | 'COMPLETED'

export interface Transaction {
  id: string
  stuff_owner_id: string
  stuff_owner?: UserDetailInResponse
  customer_id: string
  customer?: UserDetailInResponse
  status: TransactionStatusEnum
  stuff_id: string
  stuff: Stuff
  exchange_stuff_id: string | null
  exchange_stuff: Stuff
  amount: number
  is_pickup: boolean | null
  expire_at: Date | null
  create_at: Date
  update_at: Date | null
}

export interface TransactionIssue {
  id: string
  issue: string | null
  issue_solved: string | null
  create_at: Date | null
  update_at: Date | null
}
export enum AuctionStatusEnum {
  BLOCKED,
  READY,
  PENDING,
  STARTED,
  COMPLETED,
  CANCELED,
}

export type AuctionStatusType = BLOCKED | READY | PENDING | STARTED | COMPLETED | CANCELED

export type Auction = {
  stuff_id: string
  stuff: Stuff
  initial_price: number
  step_price: number
  final_price: number | null
  start_automatically: boolean
  is_approved: boolean
  status: AuctionStatusType
  total_participants: number
  duration: number
  winner_id: string | null
  winner: UserDetailInAuctionResponse | null
  bidding_history?: BiddingHistory[]
  create_at: Date
  update_at: Date
  start_at: Date | null
  expire_at: Date | null
}

export type BiddingHistory = {
  id: string
  auction_id: string
  auction: Auction
  author_id: string
  author: UserDetailInAuctionResponse
  bid_price: number
  create_at: Date
  update_at: Date
}

export type StuffIssue = {
  id: string
  author_id: string
  author?: UserDetailInResponse
  user_id: string
  user?: UserDetailInResponse
  description: string
  stuff_id: string
  solved: Boolean
  stuff?: Stuff
  create_at: Date
  update_at: Date
}
