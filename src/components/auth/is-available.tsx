import React from 'react';

import { StuffStatus } from '@/libs/constants';
import { WithChildren } from '@/types/WithChildren';
import { Button } from '@mui/joy';

const IsAvailable = ({ status, children }: WithChildren & { status?: number }) => {
  if (status !== StuffStatus.ACTIVE || !status) {
    return (
      <Button
        fullWidth
        variant="soft"
        color="neutral"
        disabled
      >
        Món đồ không khả dụng
      </Button>
    )
  }

  return <>{children}</>
}

export default IsAvailable
