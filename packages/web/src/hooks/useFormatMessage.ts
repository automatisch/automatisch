import { useIntl } from 'react-intl';

type Values = {
  [key: string]: any;
};

export default function useFormatMessage(): (
  id: string,
  values?: Values
) => string {
  const { formatMessage } = useIntl();

  return (id: string, values: Values = {}) => formatMessage({ id }, values);
}
