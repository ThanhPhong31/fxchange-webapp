import UserRowData, { UserRowHeader } from './user-rowdata'
import { UserDetail } from '@/types/model'
import { List } from 'antd'

export interface UserTableProps {
  users: UserDetail[]
  showEmail?: boolean
  onBlock: (user: UserDetail) => void
  onUnBlock: (user: UserDetail) => void
}

const UserTable = ({ users, showEmail, onBlock, onUnBlock }: UserTableProps) => {
  return (
    <>
      <UserRowHeader />
      <List
        dataSource={users}
        renderItem={(item) => (
          <UserRowData
            onBlock={onBlock}
            onUnBlock={onUnBlock}
            data={item}
            showEmail={showEmail}
          />
        )}
      />
    </>
  )
}

export default UserTable
