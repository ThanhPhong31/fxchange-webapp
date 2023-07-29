import { Field } from 'formik'
import React, { memo } from 'react'

type Props = {
  tagMoreDescription: string
}

function NotMoneyDeviceCase({ tagMoreDescription }: Props) {
  return (
    <div>
      <div className="mt-4">
        <div>
          <label htmlFor="tag_MoreDescription">Mô tả thêm</label>
        </div>
        <div className="mt-2">
          <Field
            as="textarea"
            className="border border-gray-300 p-2 rounded-md w-full"
            id="tag_MoreDescription"
            name="tag_MoreDescription"
            placeholder="Type your message here"
            value={tagMoreDescription}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(NotMoneyDeviceCase)
