import React from 'react';

import { useAuth } from '@/contexts/auth-context';

import { IsAProps } from './is-a';

interface IsOwnerProps extends IsAProps {
  authorId: string
}

const IsOwner = ({ authorId, children }: IsOwnerProps) => {
  const { user } = useAuth()
  if (!user || user.uid !== authorId) return <></>
  return <>{children}</>
}

export default IsOwner
