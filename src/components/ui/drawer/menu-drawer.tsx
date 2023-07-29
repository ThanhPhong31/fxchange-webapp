import { MenuItem } from '../common/header'
import Logo from '../common/logo'
import { IconButton } from '@mui/joy'
import { Drawer } from 'antd'
import { X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface Props {
  menuItems: MenuItem[]
  open: boolean
  onClose: () => void
}
//menu drawer
const MenuDrawer = ({ menuItems, open, onClose }: Props) => {
  return (
    <Drawer
      title={
        <div>
          <Logo />
        </div>
      }
      // maskClassName="!bg-black/10 backdrop-blur-[2px]"
      contentWrapperStyle={{
        borderRadius: '0 18px 18px 0',
        maxWidth: '80vw',
        overflow: 'hidden',
      }}
      headerStyle={{
        padding: '8px 12px',
      }}
      closable={false}
      extra={
        <IconButton
          color="neutral"
          size="sm"
          onClick={onClose}
        >
          <X width={15} />
        </IconButton>
      }
      placement="left"
      className="max-w-[80vw] border border-slate-200"
      onClose={onClose}
      open={open}
      bodyStyle={{
        padding: 0,
      }}
    >
      {menuItems.map((item) => (
        <div
          className="w-full  !font-sans hover:bg-slate-100 cursor-pointer flex items-center justify-center"
          key={item.id}
        >
          <Link
            href={item.slug}
            onClick={onClose}
            className=" !font-sans font-medium w-full flex-1 p-3"
          >
            {item.title}
          </Link>
        </div>
      ))}
    </Drawer>
  )
}

export default MenuDrawer
