import { gql } from '@apollo/client'

class CommentQuery {
  getByStuffId() {
    return gql`
      query ($stuffId: ID!) {
        comments: getCommentsByStuffId(stuffId: $stuffId) {
          id
          content
          author {
            id
            information {
              full_name
              avatar_url
            }
          }
          create_at
          update_at
        }
      }
    `
  }
}

export default new CommentQuery() as CommentQuery
