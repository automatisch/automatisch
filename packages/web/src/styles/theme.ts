import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const extendedTheme = createTheme({
  palette: {
    primary: {
      main: '#0059F7',
      light: '#4286FF',
      dark: '#001F52',
      contrastText: '#fff'
    },
    divider: '#0000001F',
    common: {
      black: '#1D1D1D',
      white: '#fff'
    },
    text: {
      primary: '#001F52',
      secondary: '#5C5C5C',
      disabled: '#C2C2C2'
    },
    error: {
      main: '#F44336',
      light: '#F88078',
      dark: '#E31B0C',
      contrastText: '#fff'
    },
    success: {
      main: '#4CAF50',
      light: '#7BC67E',
      dark: '#3B873E',
      contrastText: '#fff'
    },
    warning: {
      main: '#ED6C02',
      light: '#FFB547',
      dark: '#C77700',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    secondary: {
      main: '#F50057',
      light: '#FF4081',
      dark: '#C51162',
      contrastText: '#fff'
    },
    info: {
      main: '#6B6F8D',
      light: '#CED0E4',
      dark: '#484B6C',
      contrastText: '#fff'
    },
    background: {
      paper: '#fff',
      default: '#F3F7FD'
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: theme.typography.pxToRem(72),
      lineHeight: 1.11,
      fontWeight: 700,
    },
    h2: {
      fontSize: theme.typography.pxToRem(48),
      lineHeight: 1.16,
      fontWeight: 700,
    },
    h3: {
      fontSize: theme.typography.pxToRem(32),
      lineHeight: 1.16,
      fontWeight: 700,
    },
    h4: {
      fontSize: theme.typography.pxToRem(24),
      lineHeight: 1.3,
      fontWeight: 700,
    },
    h5: {
      fontSize: theme.typography.pxToRem(24),
      lineHeight: 1.3,
      fontWeight: 400,
    },
    h6: {
      fontSize: theme.typography.pxToRem(20),
      lineHeight: 1.2,
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: theme.typography.pxToRem(14),
      lineHeight: 1.71,
      fontWeight: 400,
      textTransform: 'uppercase',
    },
    subtitle2: {
      fontSize: theme.typography.pxToRem(14),
      lineHeight: 1.14,
      fontWeight: 400,
    },
    body1: {
      fontSize: theme.typography.pxToRem(16),
      lineHeight: 1.5,
      fontWeight: 700,
    },
    body2: {
      fontSize: theme.typography.pxToRem(16),
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      fontWeight: 700,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 16px'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        a: {
          textDecoration: 'none',
        },
      },
    },
  }
});

export default extendedTheme;
