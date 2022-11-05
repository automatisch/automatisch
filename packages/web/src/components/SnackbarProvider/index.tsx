import * as React from 'react';
import {
  SnackbarProvider as BaseSnackbarProvider,
  SnackbarProviderProps,
} from 'notistack';

const SnackbarProvider = (props: SnackbarProviderProps): React.ReactElement => {
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
