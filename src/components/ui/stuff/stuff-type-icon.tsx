import {
    ArrowLeftRight, CircleDollarSign, Gavel, HelpCircle, LucideIcon, LucideProps
} from 'lucide-react';
import React from 'react';

import { Type } from '@/types/model';

export interface StuffTypeIconProps extends LucideProps {
  type: string
}

const StuffTypeIcon = ({ type, ...props }: StuffTypeIconProps) => {
  const iconByTypes: { [key: string]: LucideIcon } = {
    exchange: ArrowLeftRight,
    market: CircleDollarSign,
    auction: Gavel,
    default: HelpCircle,
  }
  const Icon = iconByTypes[type] || HelpCircle
  return <Icon {...props} />
}

export default StuffTypeIcon
