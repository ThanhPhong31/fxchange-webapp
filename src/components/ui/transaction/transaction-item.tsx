import ImageNotFound from '../common/image-not-found'
import TransactionStatusBadge from './transaction-status-badge'
import { Transaction, User } from '@/types/model'
import { Image } from 'antd'
import Link from 'next/link'
import React from 'react'

type Props = {
  transaction: Transaction
}

function TransactionItem({ transaction }: Props) {
  const hasStuffImages = transaction.stuff?.media && transaction.stuff?.media.length > 0
//Show transaction item
  return (
    <div className="border p-6 flex rounded-lg">
      <div className="mr-8">
        {hasStuffImages ? (
          <Image
            className="rounded-2xl border object-cover"
            width={150}
            height={150}
            src={transaction.stuff?.media?.[0]}
            alt={transaction.stuff?.name}
          />
        ) : (
          <ImageNotFound />
        )}
      </div>
      <Link href={`/transactions/${transaction.id}`}>
        <div className="">
          <h3 className="block text-lg font-bold">{transaction.stuff?.name}</h3>
          <span className="block text-sm text-slate-500 mt-1 space-x-3">
            Loại giao dịch: <span>
              {transaction.stuff.type?.slug === 'market'
                ? 'Mua bán'
                : transaction.stuff.type?.slug === 'exchange'
                ? 'Trao đổi'
                : 'Đấu giá'}
            </span>
          </span>
          <span className="block text-sm text-slate-500 mt-1 space-x-3">
            Phân loại: <span>{transaction.stuff.category.name}</span>
          </span>
          <div className=" mt-2">
            <span className="block mr-2 text-black">Trạng thái:</span>
            <TransactionStatusBadge status={transaction.status} />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default TransactionItem
