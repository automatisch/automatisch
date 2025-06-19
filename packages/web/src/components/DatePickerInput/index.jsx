import * as React from 'react';
import { useIntl } from 'react-intl';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerInput({
  onChange,
  defaultValue = '',
  label,
  disableFuture = false,
  minDate,
  maxDate,
}) {
  const intl = useIntl();

  const props = {
    label,
    views: ['year', 'month', 'day'],
    onChange,
    disableFuture,
    disableHighlightToday: true,
    minDate,
    maxDate,
  };

  if (defaultValue) {
    props.defaultValue = defaultValue;
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterLuxon}
      adapterLocale={intl.locale}
    >
      <DatePicker {...props} />
    </LocalizationProvider>
  );
}
