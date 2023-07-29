// import { Input } from 'antd'

import { StuffCategory } from '@/types/model'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Option, Select } from '@mui/joy'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'

type Props = {
  isMarket?: boolean
  categoryFilter?: number
  categories?: StuffCategory[]
  setCategoryFilter?: React.Dispatch<React.SetStateAction<number>>
  searchInput?: string
  setSearchInput?: React.Dispatch<React.SetStateAction<string>>
  isIncreaseSorted?: boolean
  setIsIncreaseSorted?: React.Dispatch<React.SetStateAction<boolean>>
  searchLabel?: string
}

function StuffFilter({
  isMarket,
  categoryFilter,
  categories,
  searchInput,
  isIncreaseSorted,
  setCategoryFilter,
  setSearchInput,
  setIsIncreaseSorted,
  searchLabel,
}: Props) {
  const debounced = useDebouncedCallback((value: string) => {
    if (setSearchInput) setSearchInput(value)
  }, 500)
  const handleCategoryFilterChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null
  ) => {
    if (newValue && setCategoryFilter) {
      setCategoryFilter(newValue)
    }
  }

  const handleSortChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (setIsIncreaseSorted) {
      if (newValue === 'ins') setIsIncreaseSorted(true)
      else setIsIncreaseSorted(false)
    }
  }

  const handleInputSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setSearchInput) {
      debounced(event.target.value)
    }
  }

  const handleClearInput = () => {
    if (setSearchInput) {
      setSearchInput('1')
    }
  }
//filter stuff
  return (
    <div className="flex items-center justify-between w-full mb-2">
      <div className="flex items-center w-full md:gap-3 md:justify-between max-md:flex-col-reverse">
        <div className="flex items-center gap-3 max-md:w-full">
          {isMarket && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Sắp xếp</span>
              <Select
                defaultValue="ins"
                placeholder="Thứ tự"
                onChange={handleSortChange}
              >
                <Option value="ins">Tăng dần</Option>
                <Option value="des">Giảm dần</Option>
              </Select>
            </div>
          )}
          {categories && categories.length > 0 && (
            <Select
              size="md"
              className="max-md:w-full"
              color="neutral"
              variant="outlined"
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
            >
              <Option value={1}>Danh mục</Option>
              {categories?.map((category, index) => (
                <Option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </Option>
              ))}
            </Select>
          )}
        </div>
        <div className="max-md:mb-3 max-md:w-full max-md:ml-0">
          <Input
            size="md"
            color="neutral"
            placeholder={searchLabel || 'Tìm kiếm vật phẩm...'}
            defaultValue={searchInput}
            className="border-none"
            variant="soft"
            prefix=""
            startDecorator={<SearchOutlined className="opacity-50" />}
            // allowClear
            onChange={handleInputSearchChange}
          />
        </div>
      </div>
    </div>
  )
}

export default StuffFilter
