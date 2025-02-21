import * as React from 'react';
import {
  Link,
  Route,
  Navigate,
  Routes,
  useParams,
  useMatch,
  useNavigate,
} from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';
import AppIcon from 'components/AppIcon';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import AdminApplicationSettings from 'components/AdminApplicationSettings';
import AdminApplicationOAuthClients from 'components/AdminApplicationOAuthClients';
import AdminApplicationCreateOAuthClient from 'components/AdminApplicationCreateOAuthClient';
import AdminApplicationUpdateOAuthClient from 'components/AdminApplicationUpdateOAuthClient';
import useApp from 'hooks/useApp';

export default function AdminApplication() {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();

  const connectionsPathMatch = useMatch({
    path: URLS.ADMIN_APP_CONNECTIONS_PATTERN,
    end: false,
  });

  const settingsPathMatch = useMatch({
    path: URLS.ADMIN_APP_SETTINGS_PATTERN,
    end: false,
  });

  const oauthClientsPathMatch = useMatch({
    path: URLS.ADMIN_APP_AUTH_CLIENTS_PATTERN,
    end: false,
  });

  const { appKey } = useParams();

  const { data, loading } = useApp(appKey);

  const app = data?.data || {};

  const goToAuthClientsPage = () => navigate('oauth-clients');

  if (loading) return null;

  return (
    <>
      <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <Grid container item xs={12} sm={10} md={9}>
          <Grid container sx={{ mb: 3 }} alignItems="center">
            <Grid item xs="auto" sx={{ mr: 3 }}>
              <AppIcon
                url={app.iconUrl}
                color={app.primaryColor}
                name={app.name}
              />
            </Grid>
            <Grid item xs>
              <PageTitle>{app.name}</PageTitle>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                  variant={matchSmallScreens ? 'fullWidth' : undefined}
                  value={
                    settingsPathMatch?.pattern?.path ||
                    connectionsPathMatch?.pattern?.path ||
                    oauthClientsPathMatch?.pattern?.path
                  }
                >
                  <Tab
                    label={formatMessage('adminApps.settings')}
                    to={URLS.ADMIN_APP_SETTINGS(appKey)}
                    value={URLS.ADMIN_APP_SETTINGS_PATTERN}
                    component={Link}
                  />

                  {app.supportsOauthClients && (
                    <Tab
                      data-test="oauth-clients-tab"
                      label={formatMessage('adminApps.oauthClients')}
                      to={URLS.ADMIN_APP_AUTH_CLIENTS(appKey)}
                      value={URLS.ADMIN_APP_AUTH_CLIENTS_PATTERN}
                      component={Link}
                    />
                  )}
                </Tabs>
              </Box>

              <Routes>
                <Route
                  path={`/settings/*`}
                  element={<AdminApplicationSettings appKey={appKey} />}
                />

                {app.supportsOauthClients && (
                  <Route
                    path={`/oauth-clients/*`}
                    element={<AdminApplicationOAuthClients appKey={appKey} />}
                  />
                )}

                <Route
                  path="/"
                  element={
                    <Navigate to={URLS.ADMIN_APP_SETTINGS(appKey)} replace />
                  }
                />
              </Routes>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {app.supportsOauthClients && (
        <Routes>
          <Route
            path="/oauth-clients/create"
            element={
              <AdminApplicationCreateOAuthClient
                application={app}
                onClose={goToAuthClientsPage}
                appKey={appKey}
              />
            }
          />

          <Route
            path="/oauth-clients/:clientId"
            element={
              <AdminApplicationUpdateOAuthClient
                application={app}
                onClose={goToAuthClientsPage}
              />
            }
          />
        </Routes>
      )}
    </>
  );
}
