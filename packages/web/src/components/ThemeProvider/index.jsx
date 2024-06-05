import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as BaseThemeProvider } from '@mui/material/styles';
import clone from 'lodash/clone';
import get from 'lodash/get';
import set from 'lodash/set';
import * as React from 'react';

import useAutomatischInfo from 'hooks/useAutomatischInfo';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import { defaultTheme, mationTheme } from 'styles/theme';

const customizeTheme = (theme, config) => {
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

const ThemeProvider = ({ children, ...props }) => {
  const { data: automatischInfo, isPending: isAutomatischInfoPending } =
    useAutomatischInfo();
  const isMation = automatischInfo?.data.isMation;
  const { data: configData, isLoading: configLoading } = useAutomatischConfig();
  const config = configData?.data;

  const customTheme = React.useMemo(() => {
    const installationTheme = isMation ? mationTheme : defaultTheme;

    if (configLoading || isAutomatischInfoPending) return installationTheme;

    const customTheme = customizeTheme(installationTheme, config || {});

    return customTheme;
  }, [configLoading, config, isMation, isAutomatischInfoPending]);

  // TODO: maybe a global loading state for the custom theme?
  if (isAutomatischInfoPending || configLoading) return <></>;

  return (
    <BaseThemeProvider theme={customTheme} {...props}>
      <CssBaseline />

      {children}
    </BaseThemeProvider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
