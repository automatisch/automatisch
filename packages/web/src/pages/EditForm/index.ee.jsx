import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Container from 'components/Container';
import InputCreator from 'components/InputCreator';

import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import useFormatMessage from 'hooks/useFormatMessage';
import useForm from 'hooks/useForm.ee';
import useUpdateForm from 'hooks/useUpdateForm.ee';
import addKeyByNameInArrayOfObjects from 'helpers/addKeyByNameInArrayOfObjects';

export default function EditForm() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { formId } = useParams();

  const { data, isLoading: isFormLoading } = useForm(formId);
  const currentUserAbility = useCurrentUserAbility();
  const canManageFlow = currentUserAbility.can('manage', 'Flow');

  const { mutate, isLoading: isUpdateFormLoading } = useUpdateForm(formId);
  const defaultValues = data?.data;

  const handleFormUpdate = (values) => {
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
            <PageTitle>{formatMessage('editFormPage.title')}</PageTitle>
          </Grid>
        </Grid>

        {isFormLoading && (
          <CircularProgress
            data-test="edit-form-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        )}

        <Grid item xs={12} justifyContent="flex-end">
          <Form
            data-test="edit-form-form"
            onSubmit={handleFormUpdate}
            defaultValues={defaultValues}
            render={({ formState: { isDirty, isValid } }) => (
              <Stack direction="column" gap={2} sx={{ position: 'relative' }}>
                <TextField
                  required={true}
                  name="name"
                  label={formatMessage('editFormForm.name')}
                  fullWidth
                />

                <InputCreator key="fields" schema={dynamicFieldsSchema} />

                <LoadingButton
                  data-test="submit-edit-form-form"
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2 }}
                  loading={isUpdateFormLoading}
                  disabled={!isValid || !isDirty || !canManageFlow}
                >
                  {formatMessage('editFormForm.buttonSubmit')}
                </LoadingButton>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
