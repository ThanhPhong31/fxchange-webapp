import FormLabel from './form-label'
import cn from '@/libs/utils'
import { WithChildren } from '@/types/WithChildren'
import { WithClassName } from '@/types/common'
import React, { ReactNode } from 'react'

export interface FormGroupProps extends WithChildren, WithClassName {
  error?: string | ReactNode
  label?: string
  name?: string
}

const FormGroup = ({ children, error, label, name, className }: FormGroupProps) => {
  return (
    <div className={cn('mt-2', className)}>
      {label && (
        <FormLabel
          title={label}
          htmlFor={name}
        />
      )}
      <div className="mt-1">{children}</div>
      {error && React.isValidElement(error) ? (
        error
      ) : (
        <div className="mt-1 ml-2 text-sm text-red-600 font-normal font-sans  ">{error}</div>
      )}
    </div>
  )
}

export default FormGroup
