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
import Typography from '@mui/joy/Typography';
import Container from 'components/Container';
import * as React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import useFlowForm from 'hooks/useFlowForm.ee';
import useCreateFormSubmission from 'hooks/useCreateFormSubmission.ee';

export default function FormFlow() {
  const { flowId } = useParams();
  const [searchParams] = useSearchParams();
  const materialTheme = useTheme();
  const { data: flow, isLoading } = useFlowForm(flowId);
  const { mutate: createFormSubmission, isSuccess } = useCreateFormSubmission(
    flow?.data.webhookUrl,
  );

  const joyTheme = React.useMemo(() => extendTheme({
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
  }), [materialTheme]);

  if (isLoading) return 'loading...';

  const formFields = flow.data.fields;

  const searchParamsObject = Object.fromEntries(searchParams.entries());

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData.entries());

    const data = { ...searchParamsObject, ...formDataObject };

    createFormSubmission(data);
  };

  return (
    <CssVarsProvider theme={joyTheme}>
      <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Typography gutterBottom color="primary" level="h1">
            {flow.data.displayName}
          </Typography>

          {flow.data.description && (
            <Typography level="body-lg" sx={{ mb: 3, color: 'text.secondary' }}>
              {flow.data.description}
            </Typography>
          )}

          <Stack
            component="form"
            direction="column"
            gap={2}
            onSubmit={handleSubmit}
          >
            {formFields?.map(({ name, type, key, options }) => (
              <React.Fragment key={key}>
                {type === 'string' && (
                  <FormControl>
                    <FormLabel>{name}</FormLabel>
                    <Input
                      name={key}
                      defaultValue={searchParamsObject[key] || ''}
                    />
                  </FormControl>
                )}
                
                {type === 'multiline' && (
                  <FormControl>
                    <FormLabel>{name}</FormLabel>
                    <Textarea
                      name={key}
                      defaultValue={searchParamsObject[key] || ''}
                      minRows={3}
                    />
                  </FormControl>
                )}
                
                {type === 'checkbox' && (
                  <FormControl>
                    <Checkbox
                      name={key}
                      label={name}
                      defaultChecked={searchParamsObject[key] === 'true' || searchParamsObject[key] === 'on'}
                      value="true"
                    />
                  </FormControl>
                )}
                
                {type === 'dropdown' && (
                  <FormControl>
                    <FormLabel>{name}</FormLabel>
                    <Select
                      name={key}
                      defaultValue={searchParamsObject[key] || ''}
                      placeholder="Choose an option"
                    >
                      {(options || []).map((option, index) => (
                        <Option key={index} value={option.value}>
                          {option.value}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </React.Fragment>
            ))}

            <Button variant="solid" type="submit">
              {flow.data.submitButtonText || 'Submit'}
            </Button>

            {isSuccess && (
              <Alert>
                {flow.data.responseMessage || 'Form submitted successfully!'}
              </Alert>
            )}
          </Stack>
        </Container>
      </Box>
    </CssVarsProvider>
  );
}
