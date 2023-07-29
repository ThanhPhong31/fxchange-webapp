import TransactionItem from './transaction-item'
import { Transaction, User } from '@/types/model'
import React from 'react'

type Props = {
  transactionList: Transaction[]
}

function TransactionList({ transactionList }: Props) {
  return (
    <div>
      {transactionList.map((item, index) => {
        return (
          <TransactionItem
            key={item.id}
            transaction={item}
          />
        )
      })}
    </div>
  )
}

export default TransactionList
