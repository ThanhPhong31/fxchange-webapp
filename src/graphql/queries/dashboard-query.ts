import { gql } from '@apollo/client'

export const GET_AVERAGE_TRANSACTION = gql`
  query {
    avgTimeOfTrans: getAverageTransactionHappen
  }
`

export const GET_TOP_ACTIVE_USER = gql`
  query {
    topUsers: getTopActiveUser {
      id
      attendance_dates
      rating
      reputation
      information {
        full_name
        avatar_url
        email
      }
      auction_nickname
      status
      create_at
      update_at
    }
  }
`

export const GET_CREATED_USERS = gql`
  query GetUserCreated($start: Date, $end: Date) {
    creUsers: getUserCreated(start: $start, end: $end) {
      information {
        full_name
        avatar_url
        email
      }
    }
  }
`

export const GET_POPULAR_CATEGORIES = gql`
  query {
    popularCates: getPopularCategories {
      name
      slug
      amount
    }
  }
`

export const GET_TRANSACTION_RATES = gql`
  query GetTransactionRates($start: Date, $end: Date) {
    getTransactionRates(start: $start, end: $end) {
      success
      pending
      cancel
    }
  }
`

export const GET_TRANSACTION_BY_TYPE = gql`
  query GetTransactionsByTypes($start: Date, $end: Date) {
    transTypes: getTransactionsByTypes(start: $start, end: $end) {
      date
      data {
        exchange
        market
        auction
      }
    }
  }
`
