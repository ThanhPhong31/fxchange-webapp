import { gql } from '@apollo/client'
import { notification } from 'antd'

class NotificationQuery {
  getNotificationByUID() {
    return gql`
      query GetMyNotification($includeOfMod: Boolean) {
        notifications: getNotificationByUID(includeOfMod: $includeOfMod) {
          id
          content
          is_read
          target_id
          target_url
          type_slug
          create_at
        }
      }
    `
  }

  getUnreadNotification() {
    return gql`
      query GetUnreadNotification {
        data: getUnreadNotification {
          total
          messages
        }
      }
    `
  }

  markReadNotification() {
    return gql`
      mutation MarkReadNotification($id: ID!) {
        notification: markReadNotification(id: $id) {
          id
          content
          is_read
          target_id
          target_url
          type_slug
          create_at
        }
      }
    `
  }
}

export default new NotificationQuery() as NotificationQuery
