import type {
  OptionsWithExtraProps,
  SnackbarMessage,
  VariantType,
  SnackbarKey
} from 'notistack';
import { useSnackbar } from 'notistack';

type ExtendedOptionsWithExtraProps<V extends VariantType> = OptionsWithExtraProps<V> & {
  SnackbarProps?: OptionsWithExtraProps<V> & { 'data-test'?: string; }
}

export default function useEnqueueSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return function wrappedEnqueueSnackbar<V extends VariantType>(message: SnackbarMessage, options: ExtendedOptionsWithExtraProps<V>) {
    const key: SnackbarKey = enqueueSnackbar(
      message,
      {
        ...(options || {}) as Record<string, unknown>,
        SnackbarProps: {
          onClick: () => closeSnackbar(key),
          ...({
            'data-test': 'snackbar', // keep above options.snackbarProps
            'data-snackbar-variant': `${options.variant}` || 'default',
          }) as Record<string, string>,
          ...(options.SnackbarProps || {}) as Record<string, unknown>,
        }
      }
    );

    return key;
  };
}
