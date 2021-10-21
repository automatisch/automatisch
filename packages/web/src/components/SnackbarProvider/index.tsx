import { SnackbarProvider as BaseSnackbarProvider, SnackbarProviderProps } from 'notistack';

const SnackbarProvider = (props: SnackbarProviderProps) => {
  return (
    <BaseSnackbarProvider
      {...props}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      dense
    />
  )
};

export default SnackbarProvider;
