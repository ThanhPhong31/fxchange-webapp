import StuffList from '../ui/stuff/stuff-list'
import stuffQuery from '@/graphql/queries/stuff-query'
import { StuffListGraphQLResponse } from '@/types/common'
import { useQuery } from '@apollo/client'
import React from 'react'

interface UseStuffProps {
  type: 'exchange' | 'market' | 'auction' | 'all'
}

function useStuff({ type }: UseStuffProps) {
  const query = type === 'all' ? stuffQuery.getAll() : stuffQuery.getByTypeSlug()
  const variables = type !== 'all' && { typeSlug: type }
  const { data, loading, error } = useQuery<StuffListGraphQLResponse>(query, {
    variables: {
      ...variables,
    },
  })

  return { data: data?.stuffList, loading, error, StuffGrid: StuffList }
}

export default useStuff
