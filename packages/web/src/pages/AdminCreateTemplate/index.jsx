import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from 'react-router-dom';

import * as URLS from 'config/urls';
import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useFlow from 'hooks/useFlow';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminCreateTemplate from 'hooks/useAdminCreateTemplate.ee';

function AdminCreateTemplatePage() {
  const formatMessage = useFormatMessage();
  const { flowId } = useParams();
  const navigate = useNavigate();

  const { data: flow, isLoading: isTemplateLoading } = useFlow(flowId);

  const { mutateAsync: createTemplate, isPending } = useAdminCreateTemplate();

  const handleFormSubmit = async (data) => {
    await createTemplate({
      name: data.name,
      flowId: flowId,
    });

    navigate(URLS.ADMIN_TEMPLATES);
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
            <Form onSubmit={handleFormSubmit} defaultValues={flow.data}>
              <Stack direction="column" gap={2}>
                <TextField
                  name="name"
                  label={formatMessage('adminCreateTemplate.titleFieldLabel')}
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
                  {formatMessage('adminCreateTemplate.submit')}
                </LoadingButton>
              </Stack>
            </Form>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
export default AdminCreateTemplatePage;
