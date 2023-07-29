import { CONVERSATON_FIELDS } from './fragments'
import { gql } from '@apollo/client'

class ChatQuery {
  startConversation() {
    return gql`
      mutation ($partnerId: String!, $type: String!, $stuffId: ID, $exchangeStuffId: ID) {
        conversation: startConversation(
          partnerId: $partnerId
          type: $type
          stuffId: $stuffId
          exchangeStuffId: $exchangeStuffId
        ) {
          id
          channel_id
          status
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
          messages {
            id
            content
            sender {
              id
              information {
                full_name
                avatar_url
              }
            }
            create_at
          }
          stuff {
            id
            name
            media
            author {
              id
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
      }
    `
  }
  conversations() {
    return gql`
      ${CONVERSATON_FIELDS}
      query {
        conversations {
          ...ConversationFields
          status
        }
      }
    `
  }
  detachStuffFromConversation() {
    return gql`
      mutation DetachStuffFromConversation($channelId: String!) {
        detachStuffFromConversation(channelId: $channelId, all: false) {
          id
        }
      }
    `
  }
  messages() {
    return gql`
      query ($channelId: String!) {
        messages(channelId: $channelId) {
          id
          external_id
          content
          sender {
            id
            information {
              full_name
              avatar_url
            }
          }
          create_at
        }
      }
    `
  }
  sendMessage() {
    return gql`
      mutation SendMessage($message: MessageInput) {
        sendMessage(message: $message) {
          id
          create_at
          sender {
            id
            information {
              avatar_url
              full_name
            }
          }
        }
      }
    `
  }
}

export default new ChatQuery() as ChatQuery
