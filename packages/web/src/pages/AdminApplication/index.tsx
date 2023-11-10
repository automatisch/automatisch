import * as React from 'react';
import { useQuery } from '@apollo/client';
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
import { GET_APP } from 'graphql/queries/get-app';
import * as URLS from 'config/urls';

import AppIcon from 'components/AppIcon';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import AdminApplicationSettings from 'components/AdminApplicationSettings';
import AdminApplicationAuthClients from 'components/AdminApplicationAuthClients';
import AdminApplicationCreateAuthClient from 'components/AdminApplicationCreateAuthClient';
import AdminApplicationUpdateAuthClient from 'components/AdminApplicationUpdateAuthClient';

type AdminApplicationParams = {
  appKey: string;
};

export default function AdminApplication(): React.ReactElement | null {
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
  const authClientsPathMatch = useMatch({
    path: URLS.ADMIN_APP_AUTH_CLIENTS_PATTERN,
    end: false,
  });

  const { appKey } = useParams() as AdminApplicationParams;
  const { data, loading } = useQuery(GET_APP, { variables: { key: appKey } });

  const app = data?.getApp || {};

  const goToAuthClientsPage = () => navigate('auth-clients');

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
                    authClientsPathMatch?.pattern?.path
                  }
                >
                  <Tab
                    label={formatMessage('adminApps.settings')}
                    to={URLS.ADMIN_APP_SETTINGS(appKey)}
                    value={URLS.ADMIN_APP_SETTINGS_PATTERN}
                    component={Link}
                  />
                  <Tab
                    label={formatMessage('adminApps.authClients')}
                    to={URLS.ADMIN_APP_AUTH_CLIENTS(appKey)}
                    value={URLS.ADMIN_APP_AUTH_CLIENTS_PATTERN}
                    component={Link}
                  />
                  <Tab
                    label={formatMessage('adminApps.connections')}
                    to={URLS.ADMIN_APP_CONNECTIONS(appKey)}
                    value={URLS.ADMIN_APP_CONNECTIONS_PATTERN}
                    disabled={!app.supportsConnections}
                    component={Link}
                  />
                </Tabs>
              </Box>

              <Routes>
                <Route
                  path={`/settings/*`}
                  element={<AdminApplicationSettings appKey={appKey} />}
                />
                <Route
                  path={`/auth-clients/*`}
                  element={<AdminApplicationAuthClients appKey={appKey} />}
                />
                <Route
                  path={`/connections/*`}
                  element={<div>App connections</div>}
                />
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
      <Routes>
        <Route
          path="/auth-clients/create"
          element={
            <AdminApplicationCreateAuthClient
              application={app}
              onClose={goToAuthClientsPage}
              appKey={appKey}
            />
          }
        />
        <Route
          path="/auth-clients/:clientId"
          element={
            <AdminApplicationUpdateAuthClient
              application={app}
              onClose={goToAuthClientsPage}
            />
          }
        />
      </Routes>
    </>
  );
}
