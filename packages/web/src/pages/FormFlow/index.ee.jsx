import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Stack from '@mui/joy/Stack';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/joy/Typography';
import Container from 'components/Container';
import * as React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import ArrayField from './components/ArrayField';
import StringField from './components/StringField';
import MultilineField from './components/MultilineField';
import CheckboxField from './components/CheckboxField';
import DropdownField from './components/DropdownField';
import DateField from './components/DateField';
import TimeField from './components/TimeField';
import DateTimeField from './components/DateTimeField';

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

        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', pb: 5 }}>
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
                      <StringField
                        name={key}
                        label={name}
                        defaultValue={searchParamsObject[key] || ''}
                        required={required}
                        readonly={readonly}
                        validationFormat={validationFormat}
                        validationPattern={validationPattern}
                        validationHelperText={validationHelperText}
                        onChange={(e) => {
                          // Clear custom validity on change
                          e.target.setCustomValidity('');
                        }}
                      />
                    )}

                    {type === 'multiline' && (
                      <MultilineField
                        name={key}
                        label={name}
                        defaultValue={searchParamsObject[key] || ''}
                        required={required}
                        readonly={readonly}
                      />
                    )}

                    {type === 'checkbox' && (
                      <CheckboxField
                        name={key}
                        label={name}
                        defaultValue={searchParamsObject[key]}
                        required={required}
                        readonly={readonly}
                      />
                    )}

                    {type === 'dropdown' && (
                      <DropdownField
                        name={key}
                        label={name}
                        options={options || []}
                        defaultValue={searchParamsObject[key] || ''}
                        required={required}
                        readonly={readonly}
                      />
                    )}

                    {type === 'date' && (
                      <DateField
                        name={key}
                        label={name}
                        format={getDateFormat()}
                        defaultValue={searchParamsObject[key] || null}
                        required={required}
                        readonly={readonly}
                      />
                    )}

                    {type === 'time' && (
                      <TimeField
                        name={key}
                        label={name}
                        format={getTimeFormat()}
                        defaultValue={searchParamsObject[key] || null}
                        required={required}
                        readonly={readonly}
                      />
                    )}

                    {type === 'datetime' && (
                      <DateTimeField
                        name={key}
                        label={name}
                        format={`${getDateFormat()} ${getTimeFormat()}`}
                        defaultValue={searchParamsObject[key] || null}
                        required={required}
                        readonly={readonly}
                      />
                    )}

                    {type === 'array' && (
                      <FormControl>
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
                <Alert
                  ref={(node) =>
                    node?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }
                >
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
