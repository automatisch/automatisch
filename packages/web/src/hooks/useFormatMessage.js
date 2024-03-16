import { useIntl } from 'react-intl';
export default function useFormatMessage() {
  const { formatMessage } = useIntl();
  return (id, values = {}) => formatMessage({ id }, values);
}
