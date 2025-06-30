import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Textarea from '@mui/joy/Textarea';
import { CssVarsProvider } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import Container from 'components/Container';
import * as React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import useFlowForm from 'hooks/useFlowForm.ee';
import useCreateFormSubmission from 'hooks/useCreateFormSubmission.ee';

export default function FormFlow() {
  const { flowId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: flow, isLoading } = useFlowForm(flowId);
  const { mutate: createFormSubmission, isSuccess } = useCreateFormSubmission(
    flow?.data.webhookUrl,
  );

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
    <CssVarsProvider>
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
            {formFields?.map(({ name, type, key }) => (
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
