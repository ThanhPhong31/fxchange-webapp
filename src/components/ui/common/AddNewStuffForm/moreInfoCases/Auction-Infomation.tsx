import { Field, ErrorMessage } from 'formik'
import React, { memo } from 'react'

type Props = {
  tagStepPrice: number
  tagEndTime: string
}

function AuctionInfomation({ tagStepPrice, tagEndTime }: Props) {
  return (
    <div>
      <div className="mt-4 flex justify-between">
        {/* ----- Step ----- */}
        <div className="w-5/12">
          <label
            htmlFor="tag_StepPrice"
            className="font-medium text-base mt-4"
          >
            Bước Giá
          </label>
          <Field
            id="tag_StepPrice"
            name="tag_StepPrice"
            value={tagStepPrice}
            type="number"
            className="mt-3 p-2 w-full border border-1 rounded-md appearance-none text-slate-900 font-normal text-sm"
            placeholder="Nhập vào"
          />
        </div>

        {/* ----- End Time ----- */}
        <div className="w-5/12">
          <div className="mb-3">
            <label htmlFor="tag_EndTime">Thời hạn đấu giá</label>
          </div>
          <div className="relative">
            <Field
              as="select"
              id="tag_EndTime"
              name="tag_EndTime"
              value={tagEndTime}
              className="p-2 w-full border border-1 rounded-md appearance-none text-slate-900 font-normal text-sm"
            >
              <option value="">Vui lòng chọn</option>
              <option value="30">30 phút</option>
              <option value="60">1 giờ</option>
              <option value="120">2 giờ</option>
              <option value="180">3 giờ</option>
              <option value="360">6 giờ</option>
              <option value="720">12 giờ</option>
              <option value="1080">18 giờ</option>
              <option value="1440">24 giờ</option>
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
              name="tag_EndTime"
              component="div"
              className="text-sm text-red-600 mt-1 ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(AuctionInfomation)
