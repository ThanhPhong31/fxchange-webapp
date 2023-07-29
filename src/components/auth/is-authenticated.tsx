import React from 'react';

import { useAuth } from '@/contexts/auth-context';
import { WithChildren } from '@/types/WithChildren';

export interface IsAuthenticatedProps extends WithChildren {
  alternativeComponent: React.ReactNode
}

const IsAuthenticated = ({ children, alternativeComponent }: IsAuthenticatedProps) => {
  const { user } = useAuth()

  if (!user) return <>{alternativeComponent}</>

  return <>{children}</>
}

export default IsAuthenticated
