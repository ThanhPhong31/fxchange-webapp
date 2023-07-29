import {
  Auction,
  Conversation,
  Message,
  Stuff,
  StuffIssue,
  SuggestedStuff,
  Transaction,
  TransactionIssue,
  UserDetail,
} from './model'
import { BiddingHistory } from './model.d'

export interface WithClassName {
  className?: string
}

export interface GraphQLResponse<T> {
  data: {
    [key: string]: T
  }
}

export interface GraphQLResponseCustomKey<T, K extends string> {
  [K]: T
}

export interface UserListGraphQLResponse {
  users: UserDetail[]
}

export interface StuffListGraphQLResponse {
  stuffList: Stuff[]
}

export interface ConversationListGraphQLResponse {
  conversations: Conversation[]
}

export interface MessagesListGraphQLResponse {
  messages: Message[]
}

export interface SuggestedStuffListGraphQLResponse {
  suggestedStuffList: SuggestedStuff[]
}

export interface SuggestedStuffGraphQLResponse {
  suggestedStuff: SuggestedStuff
}

export interface TransactionGraphQLResponse {
  transaction: Transaction
  transactionIssueList: TransactionIssue[]
}

export interface TransactionListGraphQLResponse {
  transactions: Transaction[]
}

export interface BiddingHistoryListGraphQLResponse {
  biddingHistories: BiddingHistory[]
}

export interface AuctionListGraphQLResponse {
  auctions: Auction[]
}

export interface AuctionGraphQLResponse {
  auction: Auction
}

export interface StuffGraphQLResponse {
  stuff: Stuff
}

export interface StuffIssueListGraphQLResponse {
  stuffIssues: StuffIssue[]
}

export interface StuffIssueGraphQLResponse {
  stuffIssue: StuffIssue
}
