import {createTheme, ThemeOptions} from '@mui/material'

export const customTheme: ThemeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: 'rgba(168,85,287, .8)',
      main: 'rgba(168,85,287, .65)',
      dark: 'rgba(168,85,287, .28)',
    },
    background: {
      paper: '#151515',
      default: 'rgba(0,0,0,.96)',
    },
  },
})
