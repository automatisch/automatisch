import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useParams } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useAdminTemplate from 'hooks/useAdminTemplate.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminUpdateTemplate from 'hooks/useAdminUpdateTemplate.ee';

function AdminUpdateTemplatePage() {
  const formatMessage = useFormatMessage();
  const { templateId } = useParams();

  const {
    data: template,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
    error: templateError,
  } = useAdminTemplate(templateId);

  const {
    mutateAsync: updateTemplate,
    isPending: isUpdateTemplatePending,
    isError: isUpdateTemplateError,
    error: updateTemplateError,
  } = useAdminUpdateTemplate(templateId);

  const handleFormSubmit = async (data) => {
    await updateTemplate(data);
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid container item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('adminTemplatePage.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} sx={{ pt: 5, pb: 5 }}>
          <Stack spacing={5}></Stack>
          {!isTemplateLoading && (
            <Form onSubmit={handleFormSubmit} defaultValues={template?.data}>
              <Stack direction="column" gap={2}>
                <TextField
                  name="name"
                  label={formatMessage('adminUpdateTemplate.titleFieldLabel')}
                  fullWidth
                  disabled={!template}
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2 }}
                  loading={isUpdateTemplatePending}
                  data-test="update-button"
                  disabled={!template}
                >
                  {formatMessage('adminUpdateTemplate.submit')}
                </LoadingButton>
              </Stack>
            </Form>
          )}
          {(isTemplateError || isUpdateTemplateError) && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {templateError?.message ||
                updateTemplateError?.message ||
                formatMessage('genericError')}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
export default AdminUpdateTemplatePage;
