import { AUCTION_FIELDS, ESSENTIAL_STUFF_FIELDS, STUFF_FIELDS } from './fragments'
import { gql } from '@apollo/client'

// Just for example
const ExampleQuery = gql`
  query hero {
    name
    address
  }
`

export const CreateStuffQuery = gql`
  mutation ($input: StuffInput!) {
    stuff: createStuff(input: $input) {
      id
    }
  }
`

export const UpdateStuffQuery = gql`
  mutation ($input: UpdateStuffInput!) {
    stuff: updateStuff(input: $input) {
      id
    }
  }
`

export const CreateQuicklyExchangeStuffMutation = gql`
  mutation CreateQuicklyExchangeStuff($input: QuicklyStuffInput!) {
    createQuicklyExchangeStuff(input: $input) {
      id
    }
  }
`

export const CreateTransactionMutation = gql`
  mutation ($input: TransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`

export const GetStuffByID = gql`
  query ($stuffId: ID!) {
    stuff(stuffId: $stuffId) {
      id
      name
      description
      category {
        name
        id
      }
      condition
      custom_field {
        price
      }
      media
      status
      type {
        id
        name
      }
      tags {
        id
        tag_id
        value
      }
    }
  }
`

export const GET_OTHER_RATING_BY_ID = gql`
  query viewOrtherRating($id: String) {
    rating: viewOrtherRating(id: $id)
  }
`

export const GET_OTHER_FEEDBACK_BY_ID = gql`
  query viewOrtherFeedback($id: String) {
    feedbackList: viewOrtherFeedback(id: $id) {
      id
      rating
      content
      transaction_id
      create_at
      update_at
    }
  }
`

export const GetTypeList = gql`
  query {
    types {
      id
      name
      slug
    }
  }
`

export const GetCategoryList = gql`
  query {
    categories {
      id
      name
      slug
    }
  }
`

export const GetStuffList = gql`
  query GetStuffListQuery {
    stuff {
      id
      name
    }
  }
`

class StuffQuery {
  getByID() {
    return gql`
      query ($id: ID!) {
        stuff: getStuffById(id: $id) {
          id
          name
          description
          condition
          media
          status
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
          payment_type {
            id
          }
          price
          create_at
          update_at
        }
      }
    `
  }

  getAuctionByID() {
    return gql`
      ${ESSENTIAL_STUFF_FIELDS}
      ${AUCTION_FIELDS}
      query ($id: ID!) {
        stuff: getStuffById(id: $id) {
          ...EssentialStuffFields
          author {
            id
            information {
              full_name
              avatar_url
            }
          }
          ...AuctionFields
        }
      }
    `
  }
  getByTypeSlug() {
    return gql`
      query ($typeSlug: String!) {
        stuffList: stuffByTypeSlug(typeSlug: $typeSlug) {
          id
          name
          description
          condition
          media
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
          payment_type {
            id
          }
          price
          create_at
          update_at
        }
      }
    `
  }

  getAuctionStuffs() {
    return gql`
      query ($typeSlug: String!) {
        stuffList: stuffByTypeSlug(typeSlug: $typeSlug) {
          id
          name
          description
          condition
          media
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
          auction {
            status
          }
          price
          create_at
          update_at
        }
      }
    `
  }
  getAll() {
    return gql`
      query {
        stuffList: stuff {
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
      }
    `
  }

  getAllPostedStuff() {
    return gql`
      ${STUFF_FIELDS}
      query GetAllPostedStuff($page: Int, $limit: Int) {
        stuffList: getAllPostedStuff(page: $page, limit: $limit) {
          ...StuffFields
        }
      }
    `
  }

  getMyStuff() {
    return gql`
      query ($excludeSuggested: Boolean) {
        stuffList: getStuffByUid(excludeSuggested: $excludeSuggested) {
          id
          name
          description
          condition
          price
          status
          payment_type {
            slug
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
          auction {
            status
          }
          media
          create_at
          update_at
        }
      }
    `
  }

  getMyAvailableStuff() {
    return gql`
      query GetMyAvailableStuff {
        stuffList: getAvailableStuffByUid {
          id
          name
          description
          condition
          price
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
      }
    `
  }
  getRecommendStuff() {
    return gql`
      query ($id: ID!) {
        getRelateStuff(stuffId: $id) {
          id
          name
          description
          condition
          media
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
          create_at
          update_at
        }
      }
    `
  }
  getExchangeSuggestStuff() {
    return gql`
      query ($id: ID!) {
        suggestedStuffList: getExchangeSuggestStuff(stuffId: $id) {
          id
          target_stuff_id
          suggest_stuff {
            id
            name
            author {
              id
              information {
                full_name
                avatar_url
              }
            }
            media
            description
            condition
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
            create_at
            update_at
          }
        }
      }
    `
  }
  deleteStuff() {
    return gql`
      mutation ($id: ID!) {
        message: deleteStuff(stuffId: $id)
      }
    `
  }
  suggestStuff() {
    return gql`
      mutation ($input: ExchangeInput) {
        suggestedStuff: addExchangeStuff(input: $input) {
          id
          suggest_stuff {
            name
          }
        }
      }
    `
  }
  subscribeNewSuggestStuff() {
    return gql`
      subscription OnSuggestStuffAdded($channelId: String!) {
        newSuggestStuff(channelId: $channelId) {
          id
          suggest_stuff {
            name
            create_at
          }
          create_at
        }
      }
    `
  }

  MODDeleteStuff() {
    return gql`
      mutation MODDeleteStuff($stuffId: ID!) {
        message: MODDeleteStuff(stuffId: $stuffId)
      }
    `
  }
}

export default new StuffQuery() as StuffQuery
