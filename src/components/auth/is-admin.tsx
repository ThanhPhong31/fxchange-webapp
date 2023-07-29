import React from 'react';

import { useAuth } from '@/contexts/auth-context';

import { ROLES } from '../context/auth-context-container';
import IsA, { IsAProps } from './is-a';

const IsAdmin = ({ children }: IsAProps) => {
  const { user } = useAuth()

  return (
    <IsA
      user={user}
      roles={[ROLES.ADMIN]}
    >
      {children}
    </IsA>
  )
}

export default IsAdmin
