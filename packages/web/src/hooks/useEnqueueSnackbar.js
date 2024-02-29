import { useSnackbar } from 'notistack';
export default function useEnqueueSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return function wrappedEnqueueSnackbar(message, options) {
    const key = enqueueSnackbar(message, {
      ...(options || {}),
      SnackbarProps: {
        onClick: () => closeSnackbar(key),
        ...{
          'data-test': 'snackbar',
          'data-snackbar-variant': `${options.variant}` || 'default',
        },
        ...(options.SnackbarProps || {}),
      },
    });
    return key;
  };
}
