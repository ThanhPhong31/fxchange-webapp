import { ErrorCodes } from '@/constants/error.constants'
import { useApp } from '@/contexts/app-context'
import { auth } from '@/libs/firebase'
import AuthServices from '@/services/auth.service'
import { ApolloClient, createHttpLink, from, InMemoryCache, split } from '@apollo/client'
import { ApolloLink, FetchResult, Observable, Operation } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { ServerSentEventsLink } from '@graphql-sse/apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { signOut } from 'firebase/auth'
import { Client, ClientOptions, createClient } from 'graphql-sse'

const sseLink = new ServerSentEventsLink({
  graphQlSubscriptionUrl: process.env.NEXT_PUBLIC_API_URL + '/api/graphql/stream',
})

const link = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL + '/api/graphql' || 'http://localhost:8080/api/graphql',
  credentials: 'include',
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  sseLink,
  link
)

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(async ({ message, locations, path, extensions }) => {
      if (extensions?.code === ErrorCodes.INVALID_TOKEN) {
        signOut(auth)
        await AuthServices.logout()
      }
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    })

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_URL + '/api/graphql' || 'http://localhost:8080/api/graphql',
  credentials: 'include',
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, uploadLink.concat(splitLink), splitLink]),
  connectToDevTools: true,
})

export default client
