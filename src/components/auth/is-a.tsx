import React from 'react';

import { useAuth } from '@/contexts/auth-context';
import { User, UserDetailInResponse } from '@/types/model';
import { WithChildren } from '@/types/WithChildren';

export interface IsAProps extends WithChildren {
  user?: User | null
  roles?: number[]
}

const IsA = ({ roles, children }: IsAProps) => {
  const { user } = useAuth()
  console.log({ roles })
  console.log({ user })
  console.log({ userROle: user?.role })
  console.log({ compare: roles?.includes(user?.role) })
  if (!user || (!roles?.includes(user?.role?.id) && !roles?.includes(user?.role))) return <></>
  return <>{children}</>
}

export default IsA
