import { ConfigProvider, Modal, Spin, Tabs, TabsProps } from 'antd';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import colors from 'tailwindcss/colors';

import needConfirmation from '@/components/hoc/needConfirmation';
import { getDashboardLayout } from '@/components/layouts/dashboard-layout';
import CreateStuffIssueForm from '@/components/ui/form/create-stuff-issue-form';
import StuffOwnCard from '@/components/ui/stuff/stuff-own-card';
import { ErrorCodes } from '@/constants/error.constants';
import { useApp } from '@/contexts/app-context';
import { useAuth } from '@/contexts/auth-context';
import stuffQuery from '@/graphql/queries/stuff-query';
import { NextPageWithLayout } from '@/pages/_app';
import { StuffListGraphQLResponse } from '@/types/common';
import { Stuff } from '@/types/model';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button } from '@mui/joy';

const StuffInventory: NextPageWithLayout = () => {
  const [selectedStuff, setSelectedStuff] = useState<Stuff | null>(null)
  const { notify } = useApp()
  const [initLoading, setInitLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, isValidating } = useAuth()
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Stuff[]>([])
  const [reached, setReached] = useState(false)
  const router = useRouter()
  const limit = 10
  const [
    getStuffs,
    {
      data: stuffListResponse,
      loading: onLoadStuffList,
      error: errorOnLoadStuffList,
      refetch: refetchStuffs,
    },
  ] = useLazyQuery<StuffListGraphQLResponse>(stuffQuery.getAllPostedStuff())
  const [forceDeleteStuff, { data: deleteResult, loading: onDeleting, error: errorOnDelete }] =
    useMutation(stuffQuery.MODDeleteStuff())

  useEffect(() => {
    // Handle error on delete
    if (errorOnDelete) {
      console.log({ errorOnDelete })
      if (Object.keys(errorOnDelete.networkError as any).includes('result')) {
        const errorCode = (errorOnDelete.networkError as any)?.result?.errors[0]?.extensions?.code
        notify({
          title: ErrorCodes[errorCode as string],
          type: 'error',
          duration: 5000,
        })
      }
    }
  }, [errorOnDelete, notify])

  const handleForceDeleteStuff = async (stuff: Stuff) => {
    const response = await forceDeleteStuff({
      variables: {
        stuffId: stuff.id,
      },
    })
    console.log('🚀 ~ file: index.tsx:65 ~ handleForceDeleteStuff ~ response:', response)

    if (response) {
      notify({
        title: 'Xóa vật phẩm thành công',
        type: 'success',
        duration: 5000,
      })
      setData([...data.filter((item) => item.id !== stuff.id)])
    }
  }

  const handleLoadMore = useCallback(async () => {
    if (reached) return
    const newPage = page + 1
    if (data.length > 0) setIsLoading(true)
    const { data: stuffListData } = await getStuffs({
      variables: {
        page: newPage,
        limit: limit,
      },
    })
    if (newPage === 1) setInitLoading(false)
    if (newPage > page && stuffListData && stuffListData.stuffList.length > 0) {
      setPage(newPage)
      const newData = _.cloneDeep(data)
      setTimeout(() => {
        setData(newData.concat(stuffListData.stuffList))
        setIsLoading(false)
      }, 500)
    } else {
      setReached(true)
    }
  }, [data, getStuffs, page, reached])

  useEffect(() => {
    if (user && !isValidating && page === 0) {
      handleLoadMore()
    }
  }, [handleLoadMore, isValidating, page, user])

  useEffect(() => {
    if (onLoadStuffList) {
    }
  }, [onLoadStuffList])
//delete modal
  const handleDeleteStuff = (stuff: Stuff) => {
    Modal.confirm({
      title: 'Xác nhận',
      content:
        'Sau khi xóa sẽ không thể khôi phục lại được. Bạn chắc chắn muốn xóa {{stuffName}}?'.replace(
          '{{stuffName}}',
          stuff.name
        ),
      onOk: () => {
        handleForceDeleteStuff(stuff)
      },
    })
  }

  const handleAskForEditStuff = (stuff: Stuff) => {
    console.log('🚀 ~ file: index.tsx:111 ~ handleAskForEditStuff ~ stuff:', stuff)
    setSelectedStuff(stuff)
  }
//nav bar
  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: `Tất cả`,
      children: (
        <Spin
          spinning={isLoading}
          tip="Loading..."
          delay={500}
          size="large"
        >
          <section className="grid items-stretch grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
            {data.map((st, index) => (
              <StuffOwnCard
                onDelete={handleDeleteStuff}
                onEdit={handleAskForEditStuff}
                isMod={user?.role === 2 ? false : true}
                key={index}
                data={st}
                editLabel="Yêu cầu chỉnh sửa"
                deleteLabel="Xóa vĩnh viễn"
              />
            ))}
          </section>
        </Spin>
      ),
    },
    {
      key: 'exchange',
      label: `Trao đổi`,
      children: (
        <Spin
          spinning={isLoading}
          tip="Loading..."
          delay={500}
          size="large"
        >
          <section className="grid items-stretch grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
            {data
              .filter((st) => st.type.slug === 'exchange')
              .map((st, index) => (
                <StuffOwnCard
                  onDelete={handleDeleteStuff}
                  onEdit={handleAskForEditStuff}
                  isMod={user?.role === 2 ? false : true}
                  key={index}
                  data={st}
                  editLabel="Yêu cầu chỉnh sửa"
                  deleteLabel="Xóa vĩnh viễn"
                />
              ))}
          </section>
        </Spin>
      ),
    },
    {
      key: 'market',
      label: `Mua bán`,
      children: (
        <Spin
          spinning={isLoading}
          tip="Loading..."
          delay={500}
          size="large"
        >
          <section className="grid items-stretch grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
            {data
              .filter((st) => st.type.slug === 'market')
              .map((st, index) => (
                <StuffOwnCard
                  onDelete={handleDeleteStuff}
                  onEdit={handleAskForEditStuff}
                  isMod={user?.role === 2 ? false : true}
                  key={index}
                  data={st}
                  editLabel="Yêu cầu chỉnh sửa"
                  deleteLabel="Xóa vĩnh viễn"
                />
              ))}
          </section>
        </Spin>
      ),
    },
    {
      key: 'auction',
      label: `Đấu giá`,
      children: (
        <Spin
          spinning={isLoading}
          tip="Loading..."
          delay={500}
          size="large"
        >
          <section className="grid items-stretch grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
            {data
              .filter((st) => st.type.slug === 'auction')
              .map((st, index) => (
                <StuffOwnCard
                  onDelete={handleDeleteStuff}
                  onEdit={handleAskForEditStuff}
                  isMod={user?.role === 2 ? false : true}
                  key={index}
                  data={st}
                  editLabel="Yêu cầu chỉnh sửa"
                  deleteLabel="Xóa vĩnh viễn"
                />
              ))}
          </section>
        </Spin>
      ),
    },
  ]

  const onChangeTab = (key: string) => {
    router.push({
      hash: key,
    })
  }

  return (
    <Spin spinning={onLoadStuffList || onDeleting}>
      <h3 className="pt-8 pb-5 text-2xl font-semibold text-zinc-700">Kho vật phẩm</h3>
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
      <div className="flex justify-center mt-6">
        {data.length > 0 ? (
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleLoadMore}
          >
            Load more
          </Button>
        ) : (
          <></>
        )}
      </div>
      {selectedStuff && (
        <CreateStuffIssueForm
          stuff={selectedStuff}
          onCancel={() => setSelectedStuff(null)}
        />
      )}
    </Spin>
  )
}

StuffInventory.getLayout = getDashboardLayout

export default StuffInventory
