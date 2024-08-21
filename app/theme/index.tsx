'use client'

import {ThemeProvider, CssBaseline} from '@mui/material'
import {customTheme} from './customTheme'

export function CustomThemeProvider({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
