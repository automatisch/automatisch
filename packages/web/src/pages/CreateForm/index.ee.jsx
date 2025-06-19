import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import * as React from 'react';

import * as URLS from 'config/urls';
import InputCreator from 'components/InputCreator';
import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import useFormatMessage from 'hooks/useFormatMessage';
import useCreateForm from 'hooks/useCreateForm.ee';
import addKeyByNameInArrayOfObjects from 'helpers/addKeyByNameInArrayOfObjects';

export default function CreateForm() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const currentUserAbility = useCurrentUserAbility();
  const canManageFlow = currentUserAbility.can('manage', 'Flow');

  const { mutate, isLoading: isCreateFormLoading } = useCreateForm();

  const handleFormCreation = (values) => {
    const formData = {
      ...values,
      fields: addKeyByNameInArrayOfObjects(values.fields),
    };
    mutate(formData);

    navigate(URLS.FORMS);
  };

  const dynamicFieldsSchema = {
    label: 'Fields',
    key: 'fields',
    type: 'dynamic',
    required: false,
    description: 'Add or remove fields as needed',
    value: [{}],
    fields: [
      {
        label: 'Field name',
        key: 'name',
        type: 'string',
        required: true,
        description: 'Displayed name to the user',
        variables: false,
      },
      {
        label: 'Type',
        key: 'type',
        type: 'dropdown',
        required: true,
        description: 'Field type',
        variables: false,
        options: [{ label: 'String', value: 'string' }],
      },
    ],
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid container sx={{ mb: [2, 5] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid
            container
            item
            xs
            sm
            alignItems="center"
            order={{ xs: 0, height: 80 }}
          >
            <PageTitle>{formatMessage('createFormPage.title')}</PageTitle>
          </Grid>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end">
          <Form
            data-test="create-form-form"
            onSubmit={handleFormCreation}
            defaultValues={{}}
            render={({ formState: { isValid } }) => (
              <Stack direction="column" gap={2} sx={{ position: 'relative' }}>
                <TextField
                  required={true}
                  name="name"
                  label={formatMessage('createFormForm.name')}
                  fullWidth
                />

                <InputCreator key="fields" schema={dynamicFieldsSchema} />

                <LoadingButton
                  data-test="submit-create-form-form"
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2 }}
                  loading={isCreateFormLoading}
                  disabled={!isValid || !canManageFlow}
                >
                  {formatMessage('createFormForm.buttonSubmit')}
                </LoadingButton>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
