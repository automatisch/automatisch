import type {
  OptionsWithExtraProps,
  SnackbarMessage,
  VariantType
} from 'notistack';
import { useSnackbar } from 'notistack';

type ExtendedOptionsWithExtraProps<V extends VariantType> = OptionsWithExtraProps<V> & {
  SnackbarProps?: OptionsWithExtraProps<V> & { 'data-test'?: string; }
}

export default function useEnqueueSnackbar() {
  const { enqueueSnackbar } = useSnackbar();

  return function wrappedEnqueueSnackbar<V extends VariantType>(message: SnackbarMessage, options: ExtendedOptionsWithExtraProps<V>) {
    return enqueueSnackbar(message, options);
  };
}
