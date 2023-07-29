import { Field, ErrorMessage } from 'formik'
import React, { memo } from 'react'

type Props = {
  tagSize: string
}

function NotMoneyDeviceCase({ tagSize }: Props) {
// Clothe size
  return (
    <div>
      <div className="mt-4">
        <div className="mb-3">
          <label htmlFor="tag_Size">Kích thước</label>
        </div>
        
        <div className="relative">
          <Field
            as="select"
            id="tag_Size"
            name="tag_Size"
            value={tagSize}
            className="p-2 w-full border border-1 rounded-md appearance-none text-slate-900 font-normal text-sm"
          >
            <option value="">Vui lòng chọn</option>
            <option value="xxl">XXL</option>
            <option value="xl">XL</option>
            <option value="l">L</option>
            <option value="m">M</option>
            <option value="s">S</option>
            <option value="xs">XS</option>
            <option value="xxs">XXS</option>
          </Field>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="w-4 h-4 fill-current text-gray-500"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 13l6-6H4l6 6z"
              />
            </svg>
          </div>
          <ErrorMessage
            name="tag_Size"
            component="div"
            className="text-sm text-red-600 mt-1 ml-2"
          />
        </div>
      </div>
    </div>
  )
}

export default memo(NotMoneyDeviceCase)
