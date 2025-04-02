import { deepmerge } from '@mui/utils';
import { createTheme, alpha } from '@mui/material/styles';
import { cardActionAreaClasses } from '@mui/material/CardActionArea';

const referenceTheme = createTheme();

export const primaryMainColor = '#0085c8';
export const primaryLightColor = '#4286FF';
export const primaryDarkColor = '#1a91ce';

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: primaryMainColor,
      light: primaryLightColor,
      dark: primaryDarkColor,
      contrastText: '#fff',
    },
    divider: 'rgba(194, 194, 194, .2)',
    common: {
      black: '#1D1D1D',
      white: '#fff',
    },
    text: {
      primary: '#001F52',
      secondary: '#5C5C5C',
      disabled: '#C2C2C2',
    },
    error: {
      main: '#F44336',
      light: '#F88078',
      dark: '#E31B0C',
      contrastText: '#fff',
    },
    success: {
      main: '#4CAF50',
      light: '#7BC67E',
      dark: '#3B873E',
      contrastText: '#fff',
    },
    warning: {
      main: '#ED6C02',
      light: '#FFB547',
      dark: '#C77700',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      main: '#F50057',
      light: '#FF4081',
      dark: '#C51162',
      contrastText: '#fff',
    },
    info: {
      main: '#6B6F8D',
      light: '#CED0E4',
      dark: '#484B6C',
      contrastText: '#fff',
    },
    background: {
      paper: '#fff',
      default: '#f1f5f9',
    },
    footer: {
      main: '#FFFFFF',
      text: '#001F52',
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontSize: referenceTheme.typography.pxToRem(14), // text-base
    fontFamily: [
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '"Noto Sans"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(','),
    h1: {
      fontSize: referenceTheme.typography.pxToRem(48), // text-5xl
      lineHeight: 1.2,
      fontWeight: 700,
    },
    h2: {
      fontSize: referenceTheme.typography.pxToRem(36), // text-4xl
      lineHeight: 1.25,
      fontWeight: 700,
    },
    h3: {
      fontSize: referenceTheme.typography.pxToRem(30), // text-3xl
      lineHeight: 1.3,
      fontWeight: 700,
    },
    h4: {
      fontSize: referenceTheme.typography.pxToRem(24), // text-2xl
      lineHeight: 1.375,
      fontWeight: 600,
    },
    h5: {
      fontSize: referenceTheme.typography.pxToRem(20), // text-xl
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h6: {
      fontSize: referenceTheme.typography.pxToRem(18), // text-lg
      lineHeight: 1.625,
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: referenceTheme.typography.pxToRem(14), // text-sm
      lineHeight: 1.43,
      fontWeight: 500,
      textTransform: 'uppercase',
    },
    subtitle2: {
      fontSize: referenceTheme.typography.pxToRem(14), // text-sm
      lineHeight: 1.43,
      fontWeight: 400,
    },
    body1: {
      fontSize: referenceTheme.typography.pxToRem(14), // text-base
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: referenceTheme.typography.pxToRem(14), // text-sm
      lineHeight: 1.43,
      fontWeight: 400,
    },
    button: {
      fontSize: referenceTheme.typography.pxToRem(16),
      fontWeight: 700,
      [referenceTheme.breakpoints.down('sm')]: {
        fontSize: referenceTheme.typography.pxToRem(16),
      },
    },
    stepApp: {
      fontSize: referenceTheme.typography.pxToRem(12),
      color: '#5C5C5C',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // rounded corners
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#DFE3EA', // soft gray-blue border
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#DFE3EA', // no change on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#DFE3EA', // keep it soft on focus too
            borderWidth: '1px', // maintain the same border width
            boxShadow: '0 0 0 1px #0085c8', // optional subtle outline
          },
          input: {
            padding: '8px 12px', // adjust spacing
            fontSize: referenceTheme.typography.pxToRem(14), // text-base
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: '#4B5B70', // text color (matches placeholder)
          fontSize: '1rem',
          '&::placeholder': {
            color: '#6B7A90',
            opacity: 1, // show full opacity
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.primary.dark,
          zIndex: theme.zIndex.drawer + 1,
        }),
      },
      defaultProps: {
        elevation: 2,
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 8, 20, 0.64)',
        },
        invisible: {
          background: 'transparent',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: referenceTheme.typography.pxToRem(14),
          borderRadius: '8px', // rounded corners
        },
        sizeMedium: {
          padding: '8px 16px', // Match input
        },
        sizeLarge: {
          padding: '10px 16px',
        },
        sizeSmall: {
          padding: '6px 10px',
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          [`& .${cardActionAreaClasses.focusHighlight}`]: {
            background: 'unset',
            border: `1px solid ${alpha(theme.palette.primary.light, 1)}`,
          },
          [`&:hover .${cardActionAreaClasses.focusHighlight}`]: {
            opacity: 1,
          },
        }),
      },
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'stepType' },
          style: ({ theme }) => ({
            color: '#001F52',
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.3),
            bgcolor: alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity,
            ),
          }),
        },
      ],
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        a: {
          textDecoration: 'none',
        },
        '#root': {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paperWidthSm: ({ theme }) => ({
          margin: theme.spacing(4, 3),
          width: `calc(100% - ${theme.spacing(6)})`,
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&&': {
            paddingTop: theme.spacing(2),
          },
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingTop: theme.spacing(3),
        }),
      },
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(1.5, 3),
          },
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({
          '@media all': {
            paddingRight: theme.spacing(1.5),
          },
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: theme.typography.fontWeightRegular,
        }),
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: theme.typography.fontWeightBold,
        }),
      },
    },
  },
});

export const mationTheme = createTheme(
  deepmerge(defaultTheme, {
    palette: {
      primary: {
        main: '#2962FF',
        light: '#448AFF',
        dark: '#2962FF',
        contrastText: '#fff',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            zIndex: theme.zIndex.drawer + 1,
          }),
        },
      },
    },
  }),
);

export default defaultTheme;
