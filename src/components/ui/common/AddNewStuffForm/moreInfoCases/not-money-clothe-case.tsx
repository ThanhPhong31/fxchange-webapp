import { Field, ErrorMessage } from 'formik'
import React, { memo } from 'react'

type Props = {
  tagSize: string
}

function NotMoneyDeviceCase({ tagSize }: Props) {
  //cloth sizeup
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
            className="w-full p-2 text-sm font-normal border rounded-md appearance-none border-1 text-slate-900"
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
              className="w-4 h-4 text-gray-500 fill-current"
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
            className="mt-1 ml-2 text-sm text-red-600"
          />
        </div>
      </div>
    </div>
  )
}

export default memo(NotMoneyDeviceCase)
