import { gql } from '@apollo/client';

export const GetHistoryPoint = gql`
  query GetPointHistoryByUserId($userId: String!) {
    pointHistory: getPointHistoryByUserId(userId: $userId) {
      id
      change
      content
      time
      user {
        id
        information {
          full_name
        }
      }
    }
  }
`

class UserQuery {
  public findAll() {
    return gql`
      query GetAllUser {
        users {
          id
          attendance_dates
          information {
            full_name
            avatar_url
            email
          }
          auction_nickname
          status
          role_id
          create_at
          update_at
        }
      }
    `
  }

  public updateInfo() {
    return gql`
      mutation UpdateUserInfo($input: UserUpdateInforInput!) {
        user: updateUserInfor(input: $input) {
          id
        }
      }
    `
  }

  public updateUserStatus() {
    return gql`
      mutation UpdateUserStatus($uid: String!, $status: Int!) {
        user: changeUserStatus(id: $uid, status: $status) {
          id
          status
        }
      }
    `
  }
}

export const GetFeedBackList = gql`
  query GetFeedbackByUid {
    feedbackList: getFeedBackByUid {
      id
      rating
      content
      transaction_id
      create_at
      update_at
    }
  }
`

export const GetFeedBackedList = gql`
  query UserGetFeedback {
    feedBackedList: userGetFeedback {
      id
      rating
      content
      transaction_id
      create_at
      update_at
    }
  }
`

export const UserFeedbackMutation = gql`
  mutation ($input: FeedbackInput!) {
    userFeedback(input: $input) {
      id
    }
  }
`

export default new UserQuery() as UserQuery
