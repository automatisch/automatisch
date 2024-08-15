import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import useFormatMessage from 'hooks/useFormatMessage';
import useSamlAuthProvider from 'hooks/useSamlAuthProvider';
import SamlConfiguration from './SamlConfiguration';
import RoleMappings from './RoleMappings';
import useAdminSamlAuthProviders from 'hooks/useAdminSamlAuthProviders.ee';
function AuthenticationPage() {
  const formatMessage = useFormatMessage();

  const { data: adminSamlAuthProviders } = useAdminSamlAuthProviders();
  const samlAuthProviderId = adminSamlAuthProviders?.data?.[0]?.id;

  const { data, isLoading: isProviderLoading } = useSamlAuthProvider({
    samlAuthProviderId,
  });
  const provider = data?.data;

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid container item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('authenticationPage.title')}</PageTitle>
        </Grid>
        <Grid item xs={12} sx={{ pt: 5, pb: 5 }}>
          <Stack spacing={5}>
            <SamlConfiguration
              provider={provider}
              providerLoading={isProviderLoading}
            />
            <RoleMappings
              provider={provider}
              providerLoading={isProviderLoading}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
export default AuthenticationPage;
