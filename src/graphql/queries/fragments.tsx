import { gql } from '@apollo/client'

export const ESSENTIAL_STUFF_FIELDS = gql`
  fragment EssentialStuffFields on Stuff {
    id
    name
    price
    description
    condition
    media
    create_at
    update_at
  }
`

export const STUFF_FIELDS = gql`
  fragment StuffFields on Stuff {
    id
    name
    description
    price
    condition
    payment_type {
      slug
    }
    author {
      id
      information {
        full_name
        avatar_url
      }
    }
    type {
      id
      name
      slug
    }
    category {
      id
      name
      slug
    }
    tags {
      id
      tag {
        name
      }
      value
    }
    media
    create_at
    update_at
  }
`

export const BIDDING_HISTORY_FIELDS = gql`
  fragment BiddingHistoryFields on Auction {
    bidding_history {
      id
      author_id
      author {
        auction_nickname
        invitation_code
      }
      bid_price
      create_at
      update_at
    }
  }
`

export const BIDDING_HISTORY_SELF_FIELDS = gql`
  fragment BiddingHistorySelfFields on BiddingHistory {
    id
    author_id
    author {
      auction_nickname
      invitation_code
    }
    bid_price
    create_at
    update_at
  }
`

export const AUCTION_FIELDS = gql`
  ${BIDDING_HISTORY_FIELDS}
  fragment AuctionFields on Stuff {
    auction {
      stuff_id
      initial_price
      step_price
      final_price
      start_automatically
      status
      total_participants
      create_at
      update_at
      expire_at
      ...BiddingHistoryFields
    }
  }
`

export const AUCTION_BASIC_FIELDS = gql`
  fragment AuctionBasicFields on Auction {
    stuff_id
    status
    is_approved
    update_at
    stuff {
      id
      name
      media
      category {
        slug
        name
      }
      type {
        slug
        name
      }
      author {
        information {
          full_name
          avatar_url
        }
      }
    }
  }
`

export const ESSENTIAL_USER_FIELDS = gql`
  fragment EssentialUserFields on User {
    id
    information {
      full_name
      avatar_url
    }
  }
`

export const ESSENTIAL_TRANSACTION_FIELDS = gql`
  ${ESSENTIAL_STUFF_FIELDS}
  ${ESSENTIAL_USER_FIELDS}
  fragment EssentialTransactionFields on Transaction {
    id
    status
    is_pickup
    stuff {
      ...EssentialStuffFields
      type {
        name
        slug
      }
      category {
        slug
        name
      }
    }
    exchange_stuff {
      ...EssentialStuffFields
      type {
        name
        slug
      }
      category {
        slug
        name
      }
    }
    moderator {
      ...EssentialUserFields
    }
    customer {
      ...EssentialUserFields
    }
    stuff_owner {
      ...EssentialUserFields
    }
    amount
    expire_at
    create_at
    update_at
  }
`

export const CONVERSATON_FIELDS = gql`
  fragment ConversationFields on Conversation {
    channel_id
    stuff {
      id
      name
      media
      author {
        id
      }
    }
    participants {
      id
      information {
        full_name
        avatar_url
      }
    }
    last_message {
      id
      content
      sender {
        id
        information {
          full_name
        }
      }
    }
    exchange_stuff {
      id
      name
      media
      author {
        id
      }
    }
  }
`
