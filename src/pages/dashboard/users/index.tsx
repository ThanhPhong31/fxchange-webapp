import { ROLES } from '@/components/context/auth-context-container'
import { getDashboardLayout } from '@/components/layouts/dashboard-layout'
import UserTable from '@/components/ui/dashboard/table/user/user-table'
import TableSkeleton from '@/components/ui/skeleton/table-skeleton'
import { useApp } from '@/contexts/app-context'
import { useAuth } from '@/contexts/auth-context'
import userQuery from '@/graphql/queries/user-query'
import { USER_STATUS } from '@/libs/constants'
import NotFoundPage from '@/pages/404'
import { NextPageWithLayout } from '@/pages/_app'
import { UserListGraphQLResponse } from '@/types/common'
import { UserDetail } from '@/types/model'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Button, IconButton } from '@mui/joy'
import { Modal, Spin } from 'antd'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'

const ManageUserPage: NextPageWithLayout = () => {
  const { notifyError, notifySuccess } = useApp()
  const [getAllUser, { data: usersResponse, loading: loadingUsers, error: errorOnLoadUser }] =
    useLazyQuery<UserListGraphQLResponse>(userQuery.findAll())
  const [updateUserStatus, { loading: updatingUser }] = useMutation(userQuery.updateUserStatus())

  const { user, isValidating } = useAuth()
  const [showEmail, setShowEmail] = useState(false)
  const [modal, contextHolder] = Modal.useModal()

  useEffect(() => {
    if (!isValidating && user && user.role === ROLES.ADMIN) {
      getAllUser()
    }
  }, [getAllUser, isValidating, user])

  if (usersResponse && !usersResponse?.users && !isValidating) {
    return <NotFoundPage />
  }

  const handleUpdateUserStatus = async (userId: string, status: number) => {
    try {
      const response = await updateUserStatus({
        variables: {
          uid: userId,
          status: status,
        },
      })
      console.log('🚀 ~ file: index.tsx:45 ~ handleBlockUser ~ response:', response)

      notifySuccess(status == USER_STATUS.blocked ? 'Đã chặn thành công.' : 'Gỡ chặn thành công.')
    } catch (error) {
      notifyError(
        'Đã xảy ra lỗi.',
        `Không thể ${status == USER_STATUS.blocked ? 'chặn' : 'gỡ chặn'} người dùng này.`
      )
    }
  }

  const onBlock = (user: UserDetail) => {
    modal.confirm({
      title: 'Xác nhận',
      content: (
        <p>
          Bạn có chắc nhận muốn chặn <span className="font-bold">{user.information.full_name}</span>{' '}
          ?
        </p>
      ),
      okText: 'Chặn ngay',
      cancelText: 'Hủy',
      onOk: () => handleUpdateUserStatus(user.id, 0),
    })
  }

  const onUnBlock = (user: UserDetail) => {
    modal.confirm({
      title: 'Xác nhận',
      content: (
        <p>
          Bạn có chắc nhận muốn gỡ chặn{' '}
          <span className="font-bold">{user.information.full_name}</span> ?
        </p>
      ),
      okText: 'Gỡ chặn ngay',
      cancelText: 'Hủy',
      onOk: () => handleUpdateUserStatus(user.id, 1),
    })
  }

  return (
    <Spin spinning={updatingUser}>
      <div>
        <h3 className="pb-5 pt-8 text-2xl font-semibold text-zinc-700">Danh sách người dùng</h3>
        <div className="flex items-center mb-3 justify-between">
          <div></div>
          <div>
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={() => {
                setShowEmail(!showEmail)
              }}
            >
              {showEmail ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        {loadingUsers ? (
          <TableSkeleton />
        ) : (
          <UserTable
            users={usersResponse?.users || []}
            showEmail={showEmail}
            onBlock={onBlock}
            onUnBlock={onUnBlock}
          />
        )}
        {contextHolder}
      </div>
    </Spin>
  )
}

ManageUserPage.getLayout = getDashboardLayout

export default ManageUserPage
