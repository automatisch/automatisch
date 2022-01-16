import * as React from 'react';
import { ThemeProvider as BaseThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from 'styles/theme';

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children, ...props }: ThemeProviderProps): React.ReactElement => {
  return (
    <BaseThemeProvider theme={theme} {...props}>
      <CssBaseline />

      {children}
    </BaseThemeProvider>
  );
};

export default ThemeProvider;
