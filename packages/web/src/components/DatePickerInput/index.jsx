import * as React from 'react';
import PropTypes from 'prop-types';
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
  format,
}) {
  const userLocale = navigator.language || 'en-US';

  const props = {
    label,
    views: ['year', 'month', 'day'],
    onChange,
    disableFuture,
    disableHighlightToday: true,
    minDate,
    maxDate,
    format,
  };

  if (defaultValue) {
    props.defaultValue = defaultValue;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={userLocale}>
      <DatePicker {...props} />
    </LocalizationProvider>
  );
}

DatePickerInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.string.isRequired,
  disableFuture: PropTypes.bool,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  format: PropTypes.string,
};
