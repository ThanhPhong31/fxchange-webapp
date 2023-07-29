export interface ModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: React.ReactNode
}

export interface ModalPropsGeneric<T> {
  open: boolean
  onClose: () => void
  onConfirm: (value: T | any | null | undefined) => void
  title?: string
  description?: React.ReactNode
}
