import FxImage from '../common/fx-image'
import cn from '@/libs/utils'
import { Stuff } from '@/types/model'
import { Button } from '@mui/joy'
import Link from 'next/link'
import React from 'react'

interface StuffOptionCardProps {
  selected?: boolean
  data: Stuff
  onSelect?: (stuff: Stuff) => void
  onEdit?: (stuff: Stuff) => void
}

function StuffOptionCard({ data, onEdit, onSelect, selected }: StuffOptionCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    if (onEdit) onEdit(data)
    handleClose()
  }

  return (
    <div className="flex flex-col p-3 bg-white border rounded-lg shadow-sm">
      <div
        className={cn('overflow-hidden rounded-lg h-60 aspect-square', {
          grayscale: selected,
        })}
      >
        <FxImage
          src={
            data.media && data.media.length > 0
              ? data.media[0]
              : 'https://source.unsplash.com/random'
          }
          alt={data.name}
          className="object-cover w-full h-full"
        />
      </div>
      <Link
        target="_blank"
        className="pt-4"
        href={data.type.slug + '/' + data.id}
      >
        <h3 className="flex items-center gap-2 text-base cursor-pointer text-neutral-800 hover:underline">
          {data.name}
        </h3>
      </Link>

      <div className="pt-2">
        <Button
          size="sm"
          variant={selected ? 'soft' : 'solid'}
          color="primary"
          fullWidth
          onClick={() => onSelect && onSelect(data)}
        >
          {selected ? 'Đã chọn' : 'Chọn'}
        </Button>
      </div>
    </div>
  )
}

export default StuffOptionCard
