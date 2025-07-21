import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Stack from '@mui/joy/Stack';
import Textarea from '@mui/joy/Textarea';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/joy/Typography';
import Container from 'components/Container';
import * as React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ArrayField from './components/ArrayField';

import useFlowForm from 'hooks/useFlowForm.ee';
import useCreateFormSubmission from 'hooks/useCreateFormSubmission.ee';
import useFormatMessage from 'hooks/useFormatMessage';

export default function FormFlow() {
  const { flowId } = useParams();
  const [searchParams] = useSearchParams();
  const materialTheme = useTheme();
  const formatMessage = useFormatMessage();
  const { data: flow, isLoading } = useFlowForm(flowId);
  const {
    mutate: createFormSubmission,
    isSuccess,
    data: submissionResult,
  } = useCreateFormSubmission(flow?.data.webhookUrl);

  // Get user's locale from browser
  const userLocale = navigator.language || 'en-US';

  // Get locale-specific date/time formats
  const getDateFormat = () => {
    // Common locale formats
    const formats = {
      'en-US': 'MM/dd/yyyy',
      'en-GB': 'dd/MM/yyyy',
      de: 'dd.MM.yyyy',
      fr: 'dd/MM/yyyy',
      es: 'dd/MM/yyyy',
      it: 'dd/MM/yyyy',
      pt: 'dd/MM/yyyy',
      ja: 'yyyy/MM/dd',
      zh: 'yyyy/MM/dd',
      ko: 'yyyy/MM/dd',
    };
    return (
      formats[userLocale] || formats[userLocale.split('-')[0]] || 'MM/dd/yyyy'
    );
  };

  const getTimeFormat = () => {
    // Check if locale uses 24-hour format
    const uses24Hour = !new Intl.DateTimeFormat(userLocale, { hour: 'numeric' })
      .format(new Date())
      .includes('AM');
    return uses24Hour ? 'HH:mm' : 'hh:mm a';
  };

  // Helper function to get input type based on validation format
  const getInputType = (validationFormat) => {
    const typeMap = {
      url: 'url',
      tel: 'tel',
      number: 'number',
    };
    return typeMap[validationFormat] || 'text';
  };

  // Helper function to get validation message
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

  // Helper function to get pattern for validation
  const getValidationPattern = (validationFormat, customPattern) => {
    if (validationFormat === 'alphanumeric') return '[a-zA-Z0-9]+';
    if (validationFormat === 'custom') return customPattern;
    return undefined;
  };

  const joyTheme = React.useMemo(
    () =>
      extendTheme({
        colorSchemes: {
          light: {
            palette: {
              primary: {
                50: materialTheme.palette.primary.light,
                100: materialTheme.palette.primary.light,
                200: materialTheme.palette.primary.light,
                300: materialTheme.palette.primary.light,
                400: materialTheme.palette.primary.main,
                500: materialTheme.palette.primary.main,
                600: materialTheme.palette.primary.main,
                700: materialTheme.palette.primary.dark,
                800: materialTheme.palette.primary.dark,
                900: materialTheme.palette.primary.dark,
              },
              text: {
                primary: materialTheme.palette.text.primary,
                secondary: materialTheme.palette.text.secondary,
              },
              background: {
                body: materialTheme.palette.background.default,
                surface: materialTheme.palette.background.paper,
              },
            },
          },
        },
        fontFamily: {
          body: materialTheme.typography.fontFamily,
          display: materialTheme.typography.fontFamily,
        },
      }),
    [materialTheme],
  );

  if (isLoading) return formatMessage('formFlow.loading');

  const formFields = flow.data.fields;

  const searchParamsObject = Object.fromEntries(searchParams.entries());

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formDataObject = {};

    // Get array field keys for quick lookup
    const arrayFieldKeys = new Set(
      formFields?.filter((f) => f.type === 'array').map((f) => f.key) || [],
    );

    // Process form data
    for (const [key, value] of formData.entries()) {
      const [fieldName, index, subfieldKey] = key.split('.');

      if (subfieldKey && arrayFieldKeys.has(fieldName)) {
        // Handle array field entry
        formDataObject[fieldName] = formDataObject[fieldName] || [];
        formDataObject[fieldName][index] =
          formDataObject[fieldName][index] || {};
        formDataObject[fieldName][index][subfieldKey] = value;
      } else if (!arrayFieldKeys.has(key)) {
        // Handle regular field
        formDataObject[key] = value;
      }
    }

    // Merge with search params, excluding array field dotted notation
    const data = Object.entries(searchParamsObject).reduce(
      (acc, [key, value]) => {
        const [fieldName] = key.split('.');
        if (!key.includes('.') || !arrayFieldKeys.has(fieldName)) {
          acc[key] = value;
        }
        return acc;
      },
      formDataObject,
    );

    createFormSubmission(data, {
      onSuccess: (result) => {
        if (result.type === 'redirect') {
          window.location.href = result.data;
          return;
        }

        if (flow.data.asyncRedirectUrl) {
          window.location.href = flow.data.asyncRedirectUrl;
          return;
        }
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={userLocale}>
      <CssVarsProvider theme={joyTheme}>
        <CssBaseline />

        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
          <Container maxWidth="sm">
            <Typography gutterBottom color="primary" level="h1">
              {flow.data.displayName}
            </Typography>

            {flow.data.description && (
              <Typography
                level="body-lg"
                sx={{ mb: 3, color: 'text.secondary' }}
              >
                {flow.data.description}
              </Typography>
            )}

            <Stack
              component="form"
              direction="column"
              gap={2}
              onSubmit={handleSubmit}
            >
              {formFields?.map(
                ({
                  name,
                  type,
                  key,
                  options,
                  required,
                  readonly,
                  validationFormat,
                  validationPattern,
                  validationHelperText,
                  fields,
                  minItems,
                  maxItems,
                }) => (
                  <React.Fragment key={key}>
                    {type === 'string' && (
                      <FormControl required={required} disabled={readonly}>
                        <FormLabel>{name}</FormLabel>
                        <Input
                          name={key}
                          defaultValue={searchParamsObject[key] || ''}
                          required={required}
                          disabled={readonly}
                          type={getInputType(validationFormat)}
                          onChange={(e) => {
                            // Clear custom validity on change
                            e.target.setCustomValidity('');
                          }}
                          slotProps={{
                            input: {
                              pattern: getValidationPattern(
                                validationFormat,
                                validationPattern,
                              ),
                              title: getValidationMessage(
                                validationFormat,
                                validationHelperText,
                              ),
                            },
                          }}
                        />
                      </FormControl>
                    )}

                    {type === 'multiline' && (
                      <FormControl required={required} disabled={readonly}>
                        <FormLabel>{name}</FormLabel>
                        <Textarea
                          name={key}
                          defaultValue={searchParamsObject[key] || ''}
                          minRows={3}
                          required={required}
                          disabled={readonly}
                        />
                      </FormControl>
                    )}

                    {type === 'checkbox' && (
                      <FormControl required={required} disabled={readonly}>
                        <Checkbox
                          name={key}
                          label={`${name}${required ? ' *' : ''}`}
                          defaultChecked={
                            searchParamsObject[key] === 'true' ||
                            searchParamsObject[key] === 'on'
                          }
                          value="true"
                          required={required}
                          disabled={readonly}
                        />
                      </FormControl>
                    )}

                    {type === 'dropdown' && (
                      <FormControl required={required} disabled={readonly}>
                        <FormLabel>{name}</FormLabel>
                        <Select
                          name={key}
                          defaultValue={searchParamsObject[key] || ''}
                          placeholder={formatMessage('formFlow.chooseOption')}
                          required={required}
                          disabled={readonly}
                        >
                          {(options || []).map((option, index) => (
                            <Option key={index} value={option.value}>
                              {option.value}
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    {type === 'date' && (
                      <FormControl required={required} disabled={readonly}>
                        <FormLabel>{name}</FormLabel>
                        <ThemeProvider theme={materialTheme}>
                          <DatePicker
                            defaultValue={searchParamsObject[key] || null}
                            disabled={readonly}
                            format={getDateFormat()}
                            slotProps={{
                              textField: {
                                name: key,
                                required: required,
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
                                      borderColor:
                                        materialTheme.palette.primary.main,
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

                    {type === 'time' && (
                      <FormControl required={required} disabled={readonly}>
                        <FormLabel>{name}</FormLabel>
                        <ThemeProvider theme={materialTheme}>
                          <TimePicker
                            defaultValue={searchParamsObject[key] || null}
                            disabled={readonly}
                            format={getTimeFormat()}
                            slotProps={{
                              textField: {
                                name: key,
                                required: required,
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
                                      borderColor:
                                        materialTheme.palette.primary.main,
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

                    {type === 'datetime' && (
                      <FormControl required={required} disabled={readonly}>
                        <FormLabel>{name}</FormLabel>
                        <ThemeProvider theme={materialTheme}>
                          <DateTimePicker
                            defaultValue={searchParamsObject[key] || null}
                            disabled={readonly}
                            format={`${getDateFormat()} ${getTimeFormat()}`}
                            slotProps={{
                              textField: {
                                name: key,
                                required: required,
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
                                      borderColor:
                                        materialTheme.palette.primary.main,
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

                    {type === 'array' && (
                      <FormControl required={required} disabled={readonly}>
                        <FormLabel>{name}</FormLabel>
                        <ArrayField
                          name={key}
                          fields={fields}
                          minItems={minItems}
                          maxItems={maxItems}
                          searchParamsObject={searchParamsObject}
                          dateFormat={getDateFormat()}
                          timeFormat={getTimeFormat()}
                        />
                      </FormControl>
                    )}
                  </React.Fragment>
                ),
              )}

              <Button variant="solid" type="submit">
                {flow.data.submitButtonText ||
                  formatMessage('formFlow.submitButton')}
              </Button>

              {isSuccess && (
                <Alert>
                  {submissionResult?.data ||
                    flow.data.responseMessage ||
                    formatMessage('formFlow.successMessage')}
                </Alert>
              )}
            </Stack>
          </Container>
        </Box>
      </CssVarsProvider>
    </LocalizationProvider>
  );
}
