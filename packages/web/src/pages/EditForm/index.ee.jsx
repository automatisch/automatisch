import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import FormEditor from 'components/FormEditor/index.ee';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useForm from 'hooks/useForm.ee';
import useUpdateForm from 'hooks/useUpdateForm.ee';
import addKeyByNameInArrayOfObjects from 'helpers/addKeyByNameInArrayOfObjects';

export default function EditForm() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { formId } = useParams();

  const { data, isLoading: isFormLoading } = useForm(formId);
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
            render={({ formState: { isDirty, isValid }, control }) => (
              <FormEditor
                control={control}
                isDirty={isDirty}
                isValid={isValid}
                isLoading={isUpdateFormLoading}
                translationPrefix="editFormForm"
              />
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
