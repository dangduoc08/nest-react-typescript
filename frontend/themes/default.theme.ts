import {
  Theme,
  createMuiTheme
} from '@material-ui/core/styles'

export const defaultTheme: Theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiButton: {
      root: {
        textTransform: 'none'
      }
    }
  },
  palette: {
    primary: {
      main: '#00326f'
    }
  },
  breakpoints: {  // custom breakpoint responsive
    values: {
      xs: 0,
      sm: 770,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
})