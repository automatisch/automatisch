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

import useForm from 'hooks/useForm.ee';
import useCreateFormSubmission from 'hooks/useCreateFormSubmission.ee';

export default function FormFlow() {
  const { flowId } = useParams();
  const { data: flow, isLoading } = useForm(flowId);
  const { mutate: createFormSubmission, isSuccess } =
    useCreateFormSubmission(flowId);

  if (isLoading) return 'loading...';

  const formFields = flow.data.fields;

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(event.target);
    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData.entries());

    console.log('data', data);
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
            {formFields.map(({ fieldName, fieldKey, fieldType }, index) => (
              <>
                {fieldType === 'string' && (
                  <FormControl key={index}>
                    <FormLabel>{fieldName}</FormLabel>
                    <Input name={fieldKey} />
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
