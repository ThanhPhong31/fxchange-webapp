import { extendTheme } from '@mui/joy/styles'
import colors from 'tailwindcss/colors'

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          100: '#cfe4e9',
          200: '#9fc9d2',
          300: '#6eadbc',
          400: '#3e92a5',
          500: '#0e778f',
          600: '#0b5f72',
          700: '#084756',
          800: '#063039',
          900: '#03181d',
        },
        neutral: {
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        info: {
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        success: {
          100: '#cfe9e7',
          200: '#9fd4ce',
          300: '#70beb6',
          400: '#40a99d',
          500: '#109385',
          600: '#0d766a',
          700: '#0a5850',
          800: '#063b35',
          900: '#031d1b',
        },
      },
    },
  },
})

/**

,*/
