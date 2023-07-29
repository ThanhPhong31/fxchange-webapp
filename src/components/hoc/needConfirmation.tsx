import AlertModal from '../ui/modal/alert-modal'
import { WithChildren } from '@/types/WithChildren'
import React, { useState } from 'react'

export interface NeedConfirmationProps {
  onClick?: () => void
}

const needConfirmation = <P extends NeedConfirmationProps>(
  WrappedComponent: React.ComponentType<P>,
  { title, description, onConfirm }: { title: string; description?: string; onConfirm: () => void }
) => {
  const ComponentNeedConfirmation = (props: P) => {
    const [showConfirmation, setShowConfirmation] = useState(false)
    const handleConfirmation = () => {
      setShowConfirmation(false)
      // onConfirm()
      props.onClick && props.onClick()
    }

    const handleClick = () => {
      setShowConfirmation(true)
    }

    return (
      <>
        <WrappedComponent
          {...props}
          onClick={handleClick}
        />
        <AlertModal
          title={title}
          description={description}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmation}
          open={showConfirmation}
        />
      </>
    )
  }
  return ComponentNeedConfirmation
}

export default needConfirmation
