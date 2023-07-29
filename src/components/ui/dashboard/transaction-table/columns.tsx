import { Transaction } from '@/types/model'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'is_pickup',
    header: 'Hình thức',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
]
