import AuctionInfomation from './moreInfoCases/Auction-Infomation'
import Money_Clothe_Case from './moreInfoCases/Money-Clothe-Case'
import Money_Other_Case from './moreInfoCases/Money-Other-Case'
import Not_Money_Other_Case from './moreInfoCases/Not-Money-Other-Case'
import NotMoneyDeviceCase from './moreInfoCases/not-money-clothe-case'
import { Input } from '@mui/joy'
import { ErrorMessage, Field } from 'formik'
import React, { memo, useEffect, useLayoutEffect, useState } from 'react'

type Props = {
  type: string
  category: string
  customFieldPrice: number
  tagPaymentType: string
  tagStepPrice: number
  tagEndTime: string
  tagSize: string
}

function MoreInf({
  type,
  category,
  customFieldPrice,
  tagPaymentType,
  tagStepPrice,
  tagEndTime,
  tagSize,
}: Props) {
  if (type === 'Quyên góp' || type === 'Trao đổi') {
    if (category === 'Quần áo') {
      return <NotMoneyDeviceCase tagSize={tagSize} />
    }
  } else if (type === 'Mua bán' || type === 'Đấu giá') {
    return (
      <div>
        <div className="flex flex-col">
          <div className="flex justify-between mt-4">
            {/* ----- Price ----- */}
            <div className="w-5/12">
              <label
                htmlFor="custom_field_price"
                className="mt-4 text-base font-medium"
              >
                {type === 'Mua bán' ? 'Giá bán' : 'Giá khởi điểm'}
              </label>
              <Input
                id="custom_fields.price"
                name="custom_fields.price"
                type="number"
                value={customFieldPrice}
                placeholder="Vui lòng nhập giá"
              />
              <Field
                type="number"
                className="w-full p-2 mt-3 text-sm font-normal border rounded-md appearance-none border-1 text-slate-900"
              />
              <ErrorMessage
                name="custom_field_price"
                component="div"
                className="mt-1 ml-2 text-sm text-red-600"
              />
            </div>

            {/* ----- Payment Type ----- */}
            <div className="w-5/12">
              <div className="mb-3">
                <label htmlFor="tag_PaymentType">Phương thức thanh toán</label>
              </div>
              <div className="relative">
                <Field
                  as="select"
                  id="tag_PaymentType"
                  name="tag_PaymentType"
                  value={tagPaymentType}
                  className="w-full p-2 text-sm font-normal border rounded-md appearance-none border-1 text-slate-900"
                >
                  <option
                    value=""
                    disabled
                  >
                    Vui lòng chọn
                  </option>
                  <option value="money">Tiền mặt</option>
                  <option value="score">Điểm</option>
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
                  name="tag_PaymentType"
                  component="div"
                  className="mt-1 ml-2 text-sm text-red-600"
                />
              </div>
            </div>
          </div>

          {/* ----- Auction Infomation ----- */}
          <div>
            {type === 'Đấu giá' ? (
              <AuctionInfomation
                tagStepPrice={tagStepPrice}
                tagEndTime={tagEndTime}
              />
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* --------- o0o --------- */}
        {category === 'Quần áo' ? <Money_Clothe_Case tagSize={tagSize} /> : <div></div>}
      </div>
    )
  }

  return <div></div>
}
// const props = {
//   type: 'Quyên góp',
//   category: 'Quần áo',
//   customFieldPrice: 0,
//   tagPaymentType: '',
//   tagStepPrice: 0,
//   tagEndTime: '',
//   tagSize: ''
// };
// const wrapper = shallow(<MoreInf {...props} />);

export default memo(MoreInf)

// onChange={(e, newValue) => {
//   handleSelectChange(newValue, 'category')
// }}
