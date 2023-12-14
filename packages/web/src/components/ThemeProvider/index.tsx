import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as BaseThemeProvider } from '@mui/material/styles';
import clone from 'lodash/clone';
import get from 'lodash/get';
import set from 'lodash/set';
import * as React from 'react';

import { IJSONObject } from '@automatisch/types';
import useConfig from 'hooks/useConfig';
import useAutomatischInfo from 'hooks/useAutomatischInfo';
import { defaultTheme, mationTheme } from 'styles/theme';

type ThemeProviderProps = {
  children: React.ReactNode;
};

const customizeTheme = (theme: typeof defaultTheme, config: IJSONObject) => {
  // `clone` is needed so that the new theme reference triggers re-render
  const shallowDefaultTheme = clone(theme);

  for (const key in config) {
    const value = config[key];
    const exists = get(theme, key);

    if (exists) {
      set(shallowDefaultTheme, key, value);
    }
  }

  return shallowDefaultTheme;
};

const ThemeProvider = ({
  children,
  ...props
}: ThemeProviderProps): React.ReactElement => {
  const { isMation, loading: automatischInfoLoading } = useAutomatischInfo();
  const { config, loading: configLoading } = useConfig();

  const customTheme = React.useMemo(() => {
    const installationTheme = isMation ? mationTheme : defaultTheme;

    if (configLoading || automatischInfoLoading) return installationTheme;

    const customTheme = customizeTheme(installationTheme, config || {});

    return customTheme;
  }, [configLoading, config, isMation, automatischInfoLoading]);

  // TODO: maybe a global loading state for the custom theme?
  if (automatischInfoLoading || configLoading) return <></>;

  return (
    <BaseThemeProvider theme={customTheme} {...props}>
      <CssBaseline />

      {children}
    </BaseThemeProvider>
  );
};

export default ThemeProvider;
