import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as BaseThemeProvider } from '@mui/material/styles';
import theme from 'styles/theme';

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <BaseThemeProvider theme={theme} {...props}>
      <CssBaseline />

      {children}
    </BaseThemeProvider>
  );
};

export default ThemeProvider;
