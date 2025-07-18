import * as React from 'react';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import Checkbox from '@mui/joy/Checkbox';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Stack from '@mui/joy/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';

import useFormatMessage from 'hooks/useFormatMessage';

function ArrayFieldEntry(props) {
  const {
    fields,
    namePrefix,
    searchParamsObject = {},
    dateFormat,
    timeFormat,
  } = props;
  const formatMessage = useFormatMessage();
  const materialTheme = useTheme();

  const getInputType = (validationFormat) => {
    const typeMap = {
      url: 'url',
      tel: 'tel',
      number: 'number',
    };
    return typeMap[validationFormat] || 'text';
  };

  const getValidationMessage = (validationFormat, validationHelperText) => {
    if (validationHelperText) return validationHelperText;

    const messageMap = {
      url: 'formFlow.invalidUrl',
      tel: 'formFlow.invalidTel',
      number: 'formFlow.invalidNumber',
      alphanumeric: 'formFlow.invalidAlphanumeric',
    };

    const messageKey =
      messageMap[validationFormat] || 'formFlow.invalidPattern';
    return formatMessage(messageKey);
  };

  const getValidationPattern = (validationFormat, customPattern) => {
    if (validationFormat === 'alphanumeric') return '[a-zA-Z0-9]+';
    if (validationFormat === 'custom') return customPattern;
    return undefined;
  };

  return (
    <Stack spacing={2}>
      {fields.map((field) => {
        const fieldName = `${namePrefix}.${field.key}`;
        const defaultValue = searchParamsObject[fieldName] || '';

        return (
          <React.Fragment key={field.key}>
            {field.type === 'string' && (
              <FormControl required={field.required} disabled={field.readonly}>
                <FormLabel>{field.name}</FormLabel>
                <Input
                  name={fieldName}
                  defaultValue={defaultValue}
                  required={field.required}
                  disabled={field.readonly}
                  type={getInputType(field.validationFormat)}
                  slotProps={{
                    input: {
                      pattern: getValidationPattern(
                        field.validationFormat,
                        field.validationPattern,
                      ),
                      title: getValidationMessage(
                        field.validationFormat,
                        field.validationHelperText,
                      ),
                    },
                  }}
                />
              </FormControl>
            )}

            {field.type === 'multiline' && (
              <FormControl required={field.required} disabled={field.readonly}>
                <FormLabel>{field.name}</FormLabel>
                <Textarea
                  name={fieldName}
                  defaultValue={defaultValue}
                  minRows={3}
                  required={field.required}
                  disabled={field.readonly}
                />
              </FormControl>
            )}

            {field.type === 'checkbox' && (
              <FormControl required={field.required} disabled={field.readonly}>
                <Checkbox
                  name={fieldName}
                  label={`${field.name}${field.required ? ' *' : ''}`}
                  defaultChecked={
                    defaultValue === 'true' || defaultValue === 'on'
                  }
                  value="true"
                  required={field.required}
                  disabled={field.readonly}
                />
              </FormControl>
            )}

            {field.type === 'dropdown' && (
              <FormControl required={field.required} disabled={field.readonly}>
                <FormLabel>{field.name}</FormLabel>
                <Select
                  name={fieldName}
                  defaultValue={defaultValue}
                  placeholder={formatMessage('formFlow.chooseOption')}
                  required={field.required}
                  disabled={field.readonly}
                >
                  {(field.options || []).map((option, index) => (
                    <Option key={index} value={option.value}>
                      {option.value}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            )}

            {field.type === 'date' && (
              <FormControl required={field.required} disabled={field.readonly}>
                <FormLabel>{field.name}</FormLabel>
                <ThemeProvider theme={materialTheme}>
                  <DatePicker
                    defaultValue={defaultValue || null}
                    disabled={field.readonly}
                    format={dateFormat}
                    slotProps={{
                      textField: {
                        name: fieldName,
                        required: field.required,
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
                              borderColor: materialTheme.palette.primary.main,
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
            )}

            {field.type === 'time' && (
              <FormControl required={field.required} disabled={field.readonly}>
                <FormLabel>{field.name}</FormLabel>
                <ThemeProvider theme={materialTheme}>
                  <TimePicker
                    defaultValue={defaultValue || null}
                    disabled={field.readonly}
                    format={timeFormat}
                    slotProps={{
                      textField: {
                        name: fieldName,
                        required: field.required,
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
                              borderColor: materialTheme.palette.primary.main,
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
            )}

            {field.type === 'datetime' && (
              <FormControl required={field.required} disabled={field.readonly}>
                <FormLabel>{field.name}</FormLabel>
                <ThemeProvider theme={materialTheme}>
                  <DateTimePicker
                    defaultValue={defaultValue || null}
                    disabled={field.readonly}
                    format={`${dateFormat} ${timeFormat}`}
                    slotProps={{
                      textField: {
                        name: fieldName,
                        required: field.required,
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
                              borderColor: materialTheme.palette.primary.main,
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
            )}
          </React.Fragment>
        );
      })}
    </Stack>
  );
}

ArrayFieldEntry.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool,
      readonly: PropTypes.bool,
      options: PropTypes.array,
      validationFormat: PropTypes.string,
      validationPattern: PropTypes.string,
      validationHelperText: PropTypes.string,
    }),
  ).isRequired,
  namePrefix: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  searchParamsObject: PropTypes.object,
};

export default ArrayFieldEntry;
