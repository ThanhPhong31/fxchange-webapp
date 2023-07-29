import React from 'react';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@mui/joy';

const LoginButton = ({ title }: { title?: string }) => {
  const { redirectToLogin } = useAuth()

  return (
    <Button
      variant="soft"
      onClick={redirectToLogin}
      className="w-full"
    >
      {title || 'Đăng nhập'}
    </Button>
  )
}

export default LoginButton
