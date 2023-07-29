import { TransactionStatus } from './constants'
import { ClassValue, clsx } from 'clsx'
import ShortUniqueId from 'short-unique-id'
import { twMerge } from 'tailwind-merge'

export default function cn(...classNames: ClassValue[]): string {
  return twMerge(clsx(classNames))
}

export function generateUUID(length = 8): string {
  const generator = new ShortUniqueId()
  return generator(length)
}

export const getCurrentTransactionStep = (status: string) => {
  return status === TransactionStatus.PENDING
    ? 0
    : status === TransactionStatus.ONGOING
    ? 1
    : status === TransactionStatus.COMPLETED
    ? 3
    : -1
}

export const getStuffSlug = (id?: string, typeSlug?: string) => {
  if (!id && !typeSlug) return '/'
  if (!id) return `/${typeSlug || 'stuffs'}`
  return `/${typeSlug || 'stuffs'}/${id}`
}

export function isIncludePrice(type: string) {
  return ['market', 'auction'].includes(type)
}

export function isAuction(type: string) {
  return ['auction'].includes(type)
}

interface BasicSocketEvent {
  join: string
  joined: string
  leave: string
  left: string
  view: string
  create: string
  created: string
  update: string
  updated: string
}

export const getBasicEvents = (tag: string): BasicSocketEvent => {
  return {
    join: `${tag}:join`,
    joined: `${tag}:joined`,
    leave: `${tag}:leave`,
    left: `${tag}:left`,
    view: `${tag}:view`,
    create: `${tag}:create`,
    created: `${tag}:created`,
    update: `${tag}:update`,
    updated: `${tag}:updated`,
  }
}
