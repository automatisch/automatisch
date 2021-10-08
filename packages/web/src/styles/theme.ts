import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        a: {
          textDecoration: 'none',
        },
      },
    },
  }
});

export default theme;
