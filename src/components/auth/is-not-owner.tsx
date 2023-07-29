import React from 'react';

import { useAuth } from '@/contexts/auth-context';

import { IsAProps } from './is-a';

interface IsNotOwnerProps extends IsAProps {
  authorId: string
}

const IsNotOwner = ({ authorId, children }: IsNotOwnerProps) => {
  const { user } = useAuth()
  if (!user || user.uid === authorId) return <></>
  return <>{children}</>
}

export default IsNotOwner
