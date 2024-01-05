import * as React from 'react';
import { SnackbarProvider as BaseSnackbarProvider } from 'notistack';
import { css } from '@emotion/css';

const SnackbarProvider = (props) => {
  const classes = {
    zIndexOverwrite: css({
      zIndex: 2200000000,
    }),
  };
  return (
    <BaseSnackbarProvider
      {...props}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      dense
      classes={{ containerRoot: classes.zIndexOverwrite }}
    />
  );
};
export default SnackbarProvider;
