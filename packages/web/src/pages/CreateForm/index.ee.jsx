import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import * as React from 'react';

import * as URLS from 'config/urls';
import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import FormEditor from 'components/FormEditor/index.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useCreateForm from 'hooks/useCreateForm.ee';
import addKeyByNameInArrayOfObjects from 'helpers/addKeyByNameInArrayOfObjects';

export default function CreateForm() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const { mutate, isLoading: isCreateFormLoading } = useCreateForm();

  const handleFormCreation = (values) => {
    const formData = {
      ...values,
      fields: addKeyByNameInArrayOfObjects(values.fields),
    };
    mutate(formData);

    navigate(URLS.FORMS);
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
            defaultValues={{
              fields: [
                {
                  name: '',
                  type: 'string',
                  options: [{ value: '' }],
                  required: false,
                  readonly: false,
                },
              ],
            }}
            render={({ formState: { isValid }, control }) => (
              <FormEditor
                control={control}
                isValid={isValid}
                isLoading={isCreateFormLoading}
                translationPrefix="createFormForm"
              />
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
