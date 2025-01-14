import * as React from 'react';
import { useIntl } from 'react-intl';

export default function useFormatMessage() {
  const { formatMessage } = useIntl();

  const customFormatMessage = React.useCallback(
    (id, values = {}) => formatMessage({ id }, values),
    [formatMessage],
  );

  return customFormatMessage;
}
