import {
  ESSENTIAL_STUFF_FIELDS,
  ESSENTIAL_TRANSACTION_FIELDS,
  ESSENTIAL_USER_FIELDS,
} from './fragments'
import { gql } from '@apollo/client'

export const UserRequestCancelMutation = gql`
  mutation ($input: UserRequestCancel!) {
    userRequestCancel(input: $input) {
      id
    }
  }
`
export const MODCreateIssueMutation = gql`
  mutation ($input: MODCreateIssue!) {
    MODCreateIssue(input: $input) {
      id
    }
  }
`

export const HandleIssueMutation = gql`
  mutation ($input: HandleIssue!) {
    handleIssue(input: $input) {
      id
    }
  }
`
class TransactionQuery {
  findByUID() {
    return gql`
      ${ESSENTIAL_STUFF_FIELDS}
      query FindMyTransactions {
        transactions: getTransactionsByUserID {
          id
          status
          is_pickup
          stuff {
            ...EssentialStuffFields
            type {
              slug
            }
            category {
              name
            }
          }
          amount
          expire_at
          create_at
          update_at
        }
      }
    `
  }
  findByID() {
    return gql`
      ${ESSENTIAL_TRANSACTION_FIELDS}

      query FindTransactionByID($id: ID!) {
        transaction: getTransactionByID(id: $id) {
          ...EssentialTransactionFields
        }
      }
    `
  }
  startTransaction() {
    return gql`
      mutation StartTransaction(
        $stuff_id: String!
        $exchange_stuff_id: String
        $is_pickup: Boolean!
        $expire_at: Date
      ) {
        transaction: createTransaction(
          input: {
            stuff_id: $stuff_id
            exchange_stuff_id: $exchange_stuff_id
            is_pickup: $is_pickup
            expire_at: $expire_at
          }
        ) {
          id
          is_pickup
        }
      }
    `
  }

  getPickupTransactions() {
    return gql`
      ${ESSENTIAL_TRANSACTION_FIELDS}

      query GetPickupTransactions {
        transactions: getPickupTransactions {
          ...EssentialTransactionFields
        }
      }
    `
  }

  confirmReceivedStuff() {
    return gql`
      ${ESSENTIAL_TRANSACTION_FIELDS}

      mutation ConfirmReceivedStuff($input: TransactionEvidence!) {
        transaction: MODConfirmReceivedStuff(input: $input) {
          ...EssentialTransactionFields
        }
      }
    `
  }

  confirmPickupStuff() {
    return gql`
      ${ESSENTIAL_TRANSACTION_FIELDS}

      mutation ConfirmPickupStuff($input: TransactionEvidence!) {
        transaction: MODConfirmPickup(input: $input) {
          ...EssentialTransactionFields
        }
      }
    `
  }

  getIssueByTransactionId() {
    return gql`
      query ($transaction_id: String!) {
        transactionIssueList: getIssueByTransactionId(transaction_id: $transaction_id) {
          id
          issue
          issue_solved
          create_at
          update_at
        }
      }
    `
  }

  getIssueById() {
    return gql`
      query ($id: String!) {
        transactionIssue: getIssueById(id: $id) {
          id
        }
      }
    `
  }
}

export default new TransactionQuery() as TransactionQuery
