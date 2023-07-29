import MemoField from '@/components/ui/common/MemoField'
import { FormControl, Option, Select } from '@mui/joy'
import React, { memo } from 'react'

type Props = {
  label: any
  options: any
  value: any
  setValue: any
  type: any
}

const SelectAddress = ({ label, options, value, setValue, type }: Props) => {
  // address form
  return (
    <div className={`flex flex-col w-4/12 ${type === 'district' ? 'ml-2 mr-2' : ''}`}>
      <div className="font-medium mb-2">
        <label
          htmlFor={type === 'province' ? 'province' : type === 'district' ? 'district' : 'ward'}
        >
          {label}
        </label>
      </div>
      <div>
        <MemoField>
          <FormControl sx={{minWidth: 220, maxWidth: 220 }}>
            <Select
              id={type === 'province' ? 'province' : type === 'district' ? 'district' : 'ward'}
              name="select-address"
              value={value}
              onChange={(e, value) => setValue(value)}
              placeholder="Vui lòng chọn"
            >
              <Option
                value=""
                disabled
              >{`--Chọn ${label}--`}</Option>

              {options?.map((item: any) => {
                return (
                  <Option
                    key={
                      type === 'province'
                        ? item?.province_id
                        : type === 'district'
                        ? item?.district_id
                        : item?.ward_id
                    }
                    value={
                      type === 'province'
                        ? item?.province_id
                        : type === 'district'
                        ? item?.district_id
                        : item?.ward_id
                    }
                  >
                    {type === 'province'
                      ? item?.province_name
                      : type === 'district'
                      ? item?.district_name
                      : item?.ward_name}
                  </Option>
                )
              })}
            </Select>
          </FormControl>
        </MemoField>
      </div>
    </div>
  )
}
export default memo(SelectAddress)
