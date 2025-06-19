import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import Container from 'components/Container';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import useFlowForm from 'hooks/useFlowForm.ee';
import useCreateFormSubmission from 'hooks/useCreateFormSubmission.ee';

export default function FormFlow() {
  const { flowId } = useParams();
  const { data: flow, isLoading } = useFlowForm(flowId);
  const { mutate: createFormSubmission, isSuccess } = useCreateFormSubmission(
    flow?.data.webhookUrl,
  );

  if (isLoading) return 'loading...';

  const formFields = flow.data.fields;

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData.entries());

    createFormSubmission(data);
  };

  return (
    <CssVarsProvider>
      <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Typography gutterBottom color="primary" level="h1">
            {flow.data.name}
          </Typography>

          <Stack
            component="form"
            direction="column"
            gap={2}
            onSubmit={handleSubmit}
          >
            {formFields?.map(({ name, type, key }) => (
              <>
                {type === 'string' && (
                  <FormControl key={key}>
                    <FormLabel>{name}</FormLabel>
                    <Input name={key} />
                  </FormControl>
                )}
              </>
            ))}

            <Button variant="solid" type="submit">
              Submit
            </Button>

            {isSuccess && <Alert>Form submitted successfully!</Alert>}
          </Stack>
        </Container>
      </Box>
    </CssVarsProvider>
  );
}
