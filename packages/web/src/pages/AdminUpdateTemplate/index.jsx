import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useParams } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useAdminTemplate from 'hooks/useAdminTemplate.ee';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminUpdateTemplate from 'hooks/useAdminUpdateTemplate.ee';

function AdminUpdateTemplatePage() {
  const formatMessage = useFormatMessage();
  const { templateId } = useParams();

  const { data: template, isLoading: isTemplateLoading } =
    useAdminTemplate(templateId);

  const { mutateAsync: updateTemplate, isPending } =
    useAdminUpdateTemplate(templateId);

  const handleFormSubmit = async (data) => {
    updateTemplate(data);
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
            <Form onSubmit={handleFormSubmit} defaultValues={template.data}>
              <Stack direction="column" gap={2}>
                <TextField
                  name="name"
                  label={formatMessage('adminUpdateTemplate.titleFieldLabel')}
                  fullWidth
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2 }}
                  loading={isPending}
                  data-test="update-button"
                >
                  {formatMessage('adminUpdateTemplate.submit')}
                </LoadingButton>
              </Stack>
            </Form>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
export default AdminUpdateTemplatePage;
