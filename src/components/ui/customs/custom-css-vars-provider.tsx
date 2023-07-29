'use client'

import { theme } from '@/libs/muiTheme'
import { CssVarsProvider } from '@mui/joy'
import React from 'react'

export const MUICssProvider = ({ children }: { children: React.ReactNode }) => {
  return <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
}
