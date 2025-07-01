import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
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
    addButtonLabel: 'Add field',
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
        options: [
          { label: 'Checkbox', value: 'checkbox' },
          { label: 'Dropdown', value: 'dropdown' },
          { label: 'Multiline', value: 'multiline' },
          { label: 'String', value: 'string' },
        ],
      },
      {
        label: 'Options',
        key: 'options',
        addButtonLabel: 'Add option',
        type: 'dynamic',
        required: false,
        description: 'Options for dropdown fields',
        value: [{}],
        variables: false,
        showWhen: (values) => values?.type === 'dropdown',
        fields: [
          {
            label: 'Option',
            key: 'value',
            type: 'string',
            required: true,
            description: 'Option value',
            variables: false,
          },
        ],
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
              <Stack direction="column" gap={3} sx={{ position: 'relative' }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Stack gap={2}>
                    <TextField
                      required={true}
                      name="name"
                      label={formatMessage('editFormForm.name')}
                      fullWidth
                    />
                    <TextField
                      required={true}
                      name="displayName"
                      label={formatMessage('editFormForm.displayName')}
                      fullWidth
                    />
                    <TextField
                      name="description"
                      label={formatMessage('editFormForm.description')}
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                    />
                    <TextField
                      name="submitButtonText"
                      label={formatMessage('editFormForm.submitButtonText')}
                      fullWidth
                    />
                    <TextField
                      name="responseMessage"
                      label={formatMessage('editFormForm.responseMessage')}
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                    />

                    <Divider sx={{ my: 1 }} />

                    <InputCreator key="fields" schema={dynamicFieldsSchema} />
                  </Stack>
                </Paper>

                <LoadingButton
                  data-test="submit-edit-form-form"
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2, mt: 1 }}
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
