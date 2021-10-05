import { useIntl } from 'react-intl';

type Values = {
  [key: string]: any,
}

export default function useFormatMessage() {
  const { formatMessage } = useIntl();

  return (id: string, values: Values = {}) => formatMessage({ id }, values);
}
