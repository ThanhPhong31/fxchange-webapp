import { NextPageWithLayout } from '../_app'
import CenterContainer from '@/components/ui/common/center-container'
import DangerModal from '@/components/ui/modal/danger-modal'
import AddingModal from '@/components/ui/modal/update-modal'
import StuffOwnCard from '@/components/ui/stuff/stuff-own-card'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import stuffQuery from '@/graphql/queries/stuff-query'
import { locale } from '@/libs/locale'
import { StuffListGraphQLResponse } from '@/types/common'
import { Stuff } from '@/types/model'
import { useMutation, useQuery } from '@apollo/client'
import { CircularProgress } from '@mui/joy'
import { ConfigProvider, Tabs, TabsProps } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'

const MyStuff: NextPageWithLayout = () => {
  const router = useRouter()
  const { isValidating } = useAuth()
  const { messageApi, notify } = useApp()
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const {
    data: stuffData,
    loading: loadOnGetStuffList,
    error: ErrorOnGetStuffList,
    refetch,
  } = useQuery<StuffListGraphQLResponse>(stuffQuery.getMyStuff())
  const [stuffList, setStuffList] = useState<Stuff[]>([])
  const [editStuff, setEditStuff] = useState<Stuff | null>(null)
  const [startDelete, { data, loading, error, called }] = useMutation(stuffQuery.deleteStuff())
  const messageKey = 'updatable'

  useEffect(() => {
    if (stuffData) setStuffList(stuffData.stuffList)
  }, [stuffData])

  // useEffect(() => {
  //   ;(async () => {
  //     if (data) {
  //       setStuffList([...stuffList.filter((st) => st.id !== editStuff?.id)])
  //       return notify({
  //         title: locale.vi.manageStuff.delete.success,
  //         type: 'success',
  //         duration: 3000,
  //       })
  //     }

  //     if (error) {
  //       return notify({
  //         title: locale.vi.manageStuff.delete.error,
  //         type: 'error',
  //         duration: 2000,
  //       })
  //     }
  //   })()
  // }, [data, loading, error, messageApi, stuffList, editStuff?.id, notify])

  useEffect(() => {
    ;(async () => {
      if (error) {
        return notify({
          title: locale.vi.manageStuff.delete.error,
          type: 'error',
          duration: 2000,
        })
      }
    })()
  }, [data, error, notify])

  const onChangeTab = (key: string) => {
    router.push({
      hash: key,
    })
  }

  const handleEditStuff = (stuff: Stuff) => {
    setOpenEditModal(true)
    setEditStuff(stuff)
  }

  const clearState = () => {
    setEditStuff(null)
    setOpenEditModal(false)
    setOpenDeleteModal(false)
  }

  const onConfirmToDelete = (stuff: Stuff) => {
    if (!stuff) return
    setEditStuff(stuff)
    setOpenDeleteModal(true)
  }

  const handleDeleteStuff = async (stuffId: string) => {
    if (!stuffId) return messageApi?.error(locale.vi.manageStuff.delete.error)
    messageApi?.open({
      key: messageKey,
      content: locale.vi.manageStuff.delete.loading,
      type: 'loading',
    })
    const { data } = await startDelete({
      variables: {
        id: stuffId,
      },
    })
    setOpenDeleteModal(false)
    if (data) {
      setStuffList([...stuffList.filter((st) => st.id !== editStuff?.id)])
      return notify({
        title: locale.vi.manageStuff.delete.success,
        type: 'success',
        duration: 3000,
      })
    }
  }
//select type
  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: `Tất cả`,
      children: (
        <section className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          {stuffList.map((st, index) => (
            <StuffOwnCard
              loading={editStuff?.id === st.id}
              onEdit={handleEditStuff}
              onDelete={onConfirmToDelete}
              key={index}
              data={st}
            />
          ))}
        </section>
      ),
    },
    {
      key: 'exchange',
      label: `Trao đổi`,
      children: (
        <section className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          {stuffList
            .filter((st) => st.type.slug === 'exchange')
            .map((st, index) => (
              <StuffOwnCard
                loading={editStuff?.id === st.id}
                onEdit={handleEditStuff}
                onDelete={onConfirmToDelete}
                key={index}
                data={st}
                showType={false}
              />
            ))}
        </section>
      ),
    },
    {
      key: 'market',
      label: `Mua bán`,
      children: (
        <section className="grid grid-cols-4 items-stretch gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          {stuffList
            .filter((st) => st.type.slug === 'market')
            .map((st, index) => (
              <StuffOwnCard
                loading={editStuff?.id === st.id}
                onEdit={handleEditStuff}
                onDelete={onConfirmToDelete}
                key={index}
                data={st}
                showType={false}
              />
            ))}
        </section>
      ),
    },
    {
      key: 'auction',
      label: `Đấu giá`,
      children: (
        <section className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          {stuffList
            .filter((st) => st.type.slug === 'auction')
            .map((st, index) => (
              <StuffOwnCard
                loading={editStuff?.id === st.id}
                showType={false}
                onEdit={handleEditStuff}
                onDelete={onConfirmToDelete}
                key={index}
                data={st}
              />
            ))}
        </section>
      ),
    },
  ]

  if (isValidating)
    return (
      <CenterContainer fixed>
        <CircularProgress />
      </CenterContainer>
    )

  return (
    <div>
      <h3 className="text-3xl max-md:text-xl">Tủ đồ của tôi</h3>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colors.zinc[900],
          },
        }}
      >
        <Tabs
          className="pt-1"
          size="large"
          defaultActiveKey="1"
          items={items}
          onChange={onChangeTab}
        />
      </ConfigProvider>
      <AddingModal
        stuff={editStuff}
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false)
          setEditStuff(null)
        }}
        onFinish={() => refetch()}
      />
      {/* delete Stuff */}
      <DangerModal
        title="Xác nhận"
        description={
          <p className="text-zinc-900">
            Bạn chắc chắn muốn xóa <span className="font-semibold">{editStuff?.name}</span>?
          </p>
        }
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => editStuff && handleDeleteStuff(editStuff.id)}
      />
    </div>
  )
}

MyStuff.meta = {
  title: 'Tủ đồ | FXchange',
}

export default MyStuff
