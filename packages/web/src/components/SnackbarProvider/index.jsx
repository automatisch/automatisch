import * as React from 'react';
import { SnackbarProvider as BaseSnackbarProvider } from 'notistack';

const SnackbarProvider = (props) => {
  return (
    <BaseSnackbarProvider
      {...props}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      dense
    />
  );
};

export default SnackbarProvider;
