import React from 'react';

import { useAuth } from '@/contexts/auth-context';

import { IsAProps } from './is-a';

const IsNot = ({ roles, children }: IsAProps) => {
  const { user } = useAuth()

  if (!user || roles?.includes(user.role)) return <></>

  return <>{children}</>
}

export default IsNot
