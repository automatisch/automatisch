import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PropTypes from 'prop-types';

import ThemeProvider from 'components/ThemeProvider';

function DateField({
  name,
  label,
  format,
  defaultValue = null,
  required = false,
  readonly = false,
}) {
  return (
    <FormControl required={required} disabled={readonly}>
      <FormLabel>{label}</FormLabel>
      <ThemeProvider>
        <DatePicker
          defaultValue={defaultValue}
          disabled={readonly}
          format={format}
          slotProps={{
            textField: {
              name,
              required,
              fullWidth: true,
              size: 'small',
              sx: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  fontSize: '0.875rem',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.32)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '8px 12px',
                  fontSize: '0.875rem',
                },
              },
            },
          }}
        />
      </ThemeProvider>
    </FormControl>
  );
}

DateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  required: PropTypes.bool,
  readonly: PropTypes.bool,
};

export default DateField;
