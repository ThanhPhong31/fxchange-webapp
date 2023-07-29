import { useSocket } from '@/contexts/socket-context'
import stuffQuery from '@/graphql/queries/stuff-query'
import { Stuff } from '@/types/model'
import { useLazyQuery } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'

export type UseStuffDetailProps = {
  id?: string | null
}

export default function useStuffDetail({ id }: UseStuffDetailProps) {
  const [loadingStuff, setLoadingStuff] = useState(true)
  const [stuff, setStuff] = useState<Stuff | null>(null)
  const [getStuff, { data: stuffData, loading: isLoadStuff, error: hasErrorOnLoadStuff }] =
    useLazyQuery(stuffQuery.getByID(), {
      fetchPolicy: 'cache-and-network',
    })
  const [
    getRecommendStuff,
    {
      data: recommendStuffs,
      refetch: refetchRecommend,
      loading: isLoadRecommendStuff,
      error: hasErrorOnLoadRecommendStuff,
    },
  ] = useLazyQuery(stuffQuery.getRecommendStuff(), {
    fetchPolicy: 'cache-and-network',
  })
  const { socket } = useSocket()

  const loadData = useCallback(() => {
    if (!id) return
    setLoadingStuff(true)
    getStuff({
      variables: {
        id: id,
      },
    })

    getRecommendStuff({
      variables: {
        id: id,
      },
    })
  }, [getRecommendStuff, getStuff, id])

  //Load stuff detail
  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (stuffData) {
      setStuff({ ...stuffData.stuff })
      setLoadingStuff(false)
    }
  }, [stuffData])

  // Join stuff channel
  useEffect(() => {
    if (!socket || !id) return
    socket.connect()
    socket.emit('stuff:view', { stuff_id: id })

    return () => {
      socket.disconnect()
    }
  }, [socket, id])

  return {
    stuff: stuff,
    loadingStuff: hasErrorOnLoadStuff ? isLoadStuff : loadingStuff,
    errorStuff: hasErrorOnLoadStuff,
    recommendStuffs: recommendStuffs && recommendStuffs?.getRelateStuff,
    loadingRecommendStuff: isLoadRecommendStuff,
    errorRecommendStuff: hasErrorOnLoadRecommendStuff,
  }
}
