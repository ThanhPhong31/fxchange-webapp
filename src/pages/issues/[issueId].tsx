import NotFoundPage from '../404'
import FxImage from '@/components/ui/common/fx-image'
import AddingModal from '@/components/ui/modal/adding-modal'
import { useAuth } from '@/contexts/auth-context'
import stuffIssueQuery from '@/graphql/queries/stuff-issue-query'
import stuffQuery from '@/graphql/queries/stuff-query'
import { getStuffSlug } from '@/libs/utils'
import { StuffGraphQLResponse, StuffIssueGraphQLResponse } from '@/types/common'
import { StuffIssue } from '@/types/model'
import { useLazyQuery } from '@apollo/client'
import { Button, FormLabel } from '@mui/joy'
import { Spin } from 'antd'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const IssueDetail = () => {
  const [getIssue, { data, loading, error, refetch: refetchIssue }] =
    useLazyQuery<StuffIssueGraphQLResponse>(stuffIssueQuery.getIssueDetail())

  const [
    getStuffDetail,
    { data: stuffDetail, loading: loadingStuffDetail, error: errorOnLoadStuffDetail },
  ] = useLazyQuery<StuffGraphQLResponse>(stuffQuery.getByID())

  const router = useRouter()
  const { isValidating, user } = useAuth()
  const [openEditModal, setOpenEditModal] = useState(false)

  useEffect(() => {
    if (router.query.issueId && !isValidating && user) {
      getIssue({
        variables: {
          id: router.query.issueId,
        },
      })
    }
  }, [getIssue, isValidating, router.query.issueId, user])

  if (
    (!isValidating && !user) ||
    error ||
    !data ||
    (data && data.stuffIssue.user_id !== user?.uid)
  ) {
    return <NotFoundPage />
  }

  const stuffIssue = data.stuffIssue

  const handleStartEditStuff = () => {
    if (!stuffIssue?.stuff?.id) return
    setOpenEditModal(true)
    getStuffDetail({
      variables: {
        id: stuffIssue.stuff.id,
      },
    })
  }

  return (
    <Spin spinning={loading || loadingStuffDetail}>
      <div className="flex items-start gap-4">
        <div className="max-w-md w-full">
          <div className="h-[300px] overflow-hidden rounded-xl">
            <FxImage
              className="w-full h-full object-cover"
              width={500}
              height={300}
              src={stuffIssue.stuff?.media?.[0] as string}
              alt={stuffIssue.stuff?.name as string}
            />
          </div>
          <h3 className="mt-3 font-sans text-xl font-semibold">{stuffIssue.stuff?.name}</h3>
          <p className="mt-1 font-sans">{stuffIssue.stuff?.description}</p>
          <p className="font-sans mt-1">Hình thức: {stuffIssue.stuff?.type?.name}</p>
          <p className="font-sans mt-1">Danh mục: {stuffIssue.stuff?.category?.name}</p>
        </div>
        <div>
          <div>
            <FormLabel>Lí do</FormLabel>
            <p>{stuffIssue.description}</p>
          </div>

          <Button
            onClick={handleStartEditStuff}
            endDecorator={<Pencil size={20} />}
          >
            Chỉnh sửa ngay
          </Button>
        </div>
      </div>
      {stuffDetail?.stuff && (
        <AddingModal
          stuff={stuffDetail?.stuff}
          open={openEditModal}
          onClose={() => {
            setOpenEditModal(false)
          }}
          onFinish={() =>
            refetchIssue({
              id: stuffIssue.id,
            })
          }
        />
      )}
    </Spin>
  )
}

export default IssueDetail
