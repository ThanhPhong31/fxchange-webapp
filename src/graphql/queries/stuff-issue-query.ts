import { GetCategoryList } from './stuff-query'
import { gql } from '@apollo/client'

class StuffIssueQuery {
  public createStuffIssue() {
    return gql`
      mutation CreateStuffIssue($input: CreateStuffIssue!) {
        createStuffIssue(input: $input) {
          id
        }
      }
    `
  }

  public getMyIssues() {
    return gql`
      query GetAllStuffIssuesByUID {
        stuffIssues: getAllStuffIssuesByUID {
          id
          author {
            information {
              full_name
            }
          }
          stuff {
            name
          }
          description
          solved
          create_at
        }
      }
    `
  }

  public getAllIssues() {
    return gql`
      query GetAllStuffIssues {
        stuffIssues: getAllStuffIssues {
          id
          author {
            information {
              full_name
            }
          }
          stuff {
            name
          }
          description
          solved
          create_at
        }
      }
    `
  }

  public getIssueDetail() {
    return gql`
      query GetStuffIssueById($id: ID!) {
        stuffIssue: getStuffIssueById(id: $id) {
          id
          stuff {
            id
            name
            type {
              name
              slug
            }
            category {
              name
            }
            media
            description
          }
          user_id
          description
          solved
          create_at
        }
      }
    `
  }

  public confirm() {
    return gql`
      mutation ConfirmStuffIssueStatus($id: ID!) {
        stuffIssue: confirmStuffIssueStatus(id: $id) {
          id
          stuff {
            id
            name
            type {
              name
              slug
            }
            category {
              name
            }
            media
            description
          }
          user_id
          description
          solved
          create_at
        }
      }
    `
  }
}

export default new StuffIssueQuery() as StuffIssueQuery
