import StuffFilter from '../stuff/stuff-filter'
import TransactionRowData from './transaction-rowdata'
import { Transaction } from '@/types/model'
import React, { useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'

export interface TransactionTableProps {
  transactions: Transaction[]
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [searchInput, setSearchInput] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number>(1)

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <TransactionRowData
      data={transactions[index]}
      style={style}
    />
  )

  return (
    // <List
    //   dataSource={transactions}
    //   renderItem={(item) => <TransactionRowData data={item} />}
    // />
    <>
      <StuffFilter
        isMarket
        categoryFilter={categoryFilter}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchLabel="Tìm kiếm theo tên..."
      />
      <div className="h-[70vh]">
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <List
              // className="md:w-[350px] h-[500px] px-2 overflow-y-auto pb-4"
              height={height}
              width={width}
              itemCount={transactions.length}
              itemSize={74}
              overscanCount={5}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
    </>
  )
}

export default TransactionTable
