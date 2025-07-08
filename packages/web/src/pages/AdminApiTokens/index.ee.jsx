import * as React from 'react';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import ApiTokenList from 'components/ApiTokenList';
import ConditionalIconButton from 'components/ConditionalIconButton';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminCreateApiToken from 'hooks/useAdminCreateApiToken.ee';
import CreatedApiTokenDialog from 'components/CreatedApiTokenDialog';
import useAdminApiTokens from 'hooks/useAdminApiTokens.ee';
import NoResultFound from 'components/NoResultFound';

function AdminApiTokensPage() {
  const formatMessage = useFormatMessage();
  const { data: apiTokensData, isLoading } = useAdminApiTokens();
  const {
    mutate: createApiToken,
    reset,
    data: createdApiTokenData,
    isPending,
  } = useAdminCreateApiToken();
  const [open, setOpen] = React.useState(false);

  const apiTokens = apiTokensData?.data;
  const createdApiToken = createdApiTokenData?.data;

  const onCreateApiToken = async () => {
    await createApiToken();

    setOpen(true);
  };

  const onDialogClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <CreatedApiTokenDialog
        open={open}
        onClose={onDialogClose}
        apiToken={createdApiToken?.token}
      />

      <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <Grid container item xs={12} sm={10} md={9}>
          <Grid
            container
            sx={{ mb: [0, 3] }}
            columnSpacing={1.5}
            rowSpacing={3}
          >
            <Grid container item xs sm alignItems="center">
              <PageTitle data-test="admin-api-tokens-page-title">
                {formatMessage('adminApiTokensPage.title')}
              </PageTitle>
            </Grid>

            <Grid container item xs="auto" sm="auto" alignItems="center">
              <ConditionalIconButton
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                onClick={onCreateApiToken}
                disabled={isPending}
                fullWidth
                icon={<AddIcon />}
                data-test="create-user"
              >
                {formatMessage('adminApiTokensPage.createApiToken')}
              </ConditionalIconButton>
            </Grid>
          </Grid>

          <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
            {!isLoading && apiTokensData?.meta.count === 0 && (
              <NoResultFound
                onClick={onCreateApiToken}
                text={formatMessage('adminApiTokensPage.noApiTokens')}
              />
            )}

            {(isLoading || apiTokensData?.meta.count > 0) && (
              <ApiTokenList apiTokens={apiTokens} loading={isLoading} />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default AdminApiTokensPage;
