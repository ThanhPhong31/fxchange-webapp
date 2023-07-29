import { gql } from '@apollo/client';

import {
    AUCTION_BASIC_FIELDS, BIDDING_HISTORY_FIELDS, BIDDING_HISTORY_SELF_FIELDS
} from './fragments';

class AuctionQuery {
  public getBiddingHistory() {
    return gql`
      query GetBiddingHistory($id: ID!) {
        biddingHistories: getBiddingHistory(stuff_id: $id) {
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
  }

  public getAllAuctions() {
    return gql`
      query GetAllAuctions($isApproved: Boolean) {
        auctions: getAllAuctions(isApproved: $isApproved) {
          stuff_id
          status
          is_approved
          update_at
          stuff {
            id
            name
            category {
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
      }
    `
  }
  public getAllApprovedAuctions() {
    return gql`
      query GetAllApprovedAuctions($startedOnly: Boolean) {
        auctions: getAllApprovedAuctions(startedOnly: $startedOnly) {
          stuff_id
          status
          is_approved
          update_at
          initial_price
          step_price
          final_price
          expire_at
          stuff {
            id
            name
            category {
              slug
              name
            }
            media
            author {
              information {
                full_name
                avatar_url
              }
            }
          }
        }
      }
    `
  }

  public placeABid() {
    return gql`
      ${BIDDING_HISTORY_SELF_FIELDS}
      mutation PlaceABid($stuffId: ID!, $biddingPrice: Int!) {
        biddingHistory: placeABid(stuff_id: $stuffId, bidding_price: $biddingPrice) {
          ...BiddingHistorySelfFields
        }
      }
    `
  }

  public getByStuffId() {
    return gql`
      ${AUCTION_BASIC_FIELDS}
      query GetAuctionByStuffId($stuffId: ID!) {
        auction: getAuctionByStuffId(stuffId: $stuffId) {
          ...AuctionBasicFields
          initial_price
          step_price
          final_price
          winner {
            auction_nickname
          }
        }
      }
    `
  }

  public approve() {
    return gql`
      ${AUCTION_BASIC_FIELDS}
      mutation ApproveAuction($stuffId: ID!) {
        auction: approveAuction(stuffId: $stuffId) {
          ...AuctionBasicFields
        }
      }
    `
  }

  public start() {
    return gql`
      ${AUCTION_BASIC_FIELDS}

      mutation StartAuction($stuffId: ID!) {
        auction: startAuction(stuffId: $stuffId) {
          ...AuctionBasicFields
        }
      }
    `
  }
}

export default new AuctionQuery() as AuctionQuery
