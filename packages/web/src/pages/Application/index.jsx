import PropTypes from 'prop-types';
import * as React from 'react';
import {
  Link,
  Route,
  Navigate,
  Routes,
  useParams,
  useSearchParams,
  useMatch,
  useNavigate,
} from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';

import useFormatMessage from 'hooks/useFormatMessage';
import useAppConfig from 'hooks/useAppConfig.ee';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import * as URLS from 'config/urls';
import SplitButton from 'components/SplitButton';
import ConditionalIconButton from 'components/ConditionalIconButton';
import AppConnections from 'components/AppConnections';
import AppFlows from 'components/AppFlows';
import AddAppConnection from 'components/AddAppConnection';
import AppIcon from 'components/AppIcon';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import useApp from 'hooks/useApp';
import Can from 'components/Can';
import { AppPropType } from 'propTypes/propTypes';

const ReconnectConnection = (props) => {
  const { application, onClose } = props;
  const { connectionId } = useParams();

  return (
    <AddAppConnection
      onClose={onClose}
      application={application}
      connectionId={connectionId}
    />
  );
};

ReconnectConnection.propTypes = {
  application: AppPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function Application() {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const formatMessage = useFormatMessage();
  const connectionsPathMatch = useMatch({
    path: URLS.APP_CONNECTIONS_PATTERN,
    end: false,
  });
  const flowsPathMatch = useMatch({ path: URLS.APP_FLOWS_PATTERN, end: false });
  const [searchParams] = useSearchParams();
  const { appKey } = useParams();
  const navigate = useNavigate();

  const { data, loading } = useApp(appKey);
  const app = data?.data || {};

  const { data: appConfig } = useAppConfig(appKey);
  const connectionId = searchParams.get('connectionId') || undefined;

  const currentUserAbility = useCurrentUserAbility();

  const goToApplicationPage = () => navigate('connections');

  const connectionOptions = React.useMemo(() => {
    const shouldHaveCustomConnection =
      appConfig?.data?.connectionAllowed &&
      appConfig?.data?.customConnectionAllowed;

    const options = [
      {
        label: formatMessage('app.addConnection'),
        key: 'addConnection',
        'data-test': 'add-connection-button',
        to: URLS.APP_ADD_CONNECTION(appKey, appConfig?.data?.connectionAllowed),
        disabled: !currentUserAbility.can('create', 'Connection'),
      },
    ];

    if (shouldHaveCustomConnection) {
      options.push({
        label: formatMessage('app.addCustomConnection'),
        key: 'addCustomConnection',
        'data-test': 'add-custom-connection-button',
        to: URLS.APP_ADD_CONNECTION(appKey),
        disabled: !currentUserAbility.can('create', 'Connection'),
      });
    }

    return options;
  }, [appKey, appConfig?.data, currentUserAbility, formatMessage]);

  if (loading) return null;

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Container>
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

            <Grid item xs="auto">
              <Routes>
                <Route
                  path={`${URLS.FLOWS}/*`}
                  element={
                    <Can I="create" a="Flow" passThrough>
                      {(allowed) => (
                        <ConditionalIconButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          component={Link}
                          to={URLS.CREATE_FLOW}
                          fullWidth
                          icon={<AddIcon />}
                          disabled={!allowed}
                        >
                          {formatMessage('app.createFlow')}
                        </ConditionalIconButton>
                      )}
                    </Can>
                  }
                />

                <Route
                  path={`${URLS.CONNECTIONS}/*`}
                  element={
                    <Can I="create" a="Connection" passThrough>
                      {(allowed) => (
                        <SplitButton
                          disabled={
                            !allowed ||
                            (appConfig?.data &&
                              !appConfig?.data?.disabled &&
                              !appConfig?.data?.connectionAllowed &&
                              !appConfig?.data?.customConnectionAllowed) ||
                            connectionOptions.every(({ disabled }) => disabled)
                          }
                          options={connectionOptions}
                        />
                      )}
                    </Can>
                  }
                />
              </Routes>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                  variant={matchSmallScreens ? 'fullWidth' : undefined}
                  value={
                    connectionsPathMatch?.pattern?.path ||
                    flowsPathMatch?.pattern?.path
                  }
                >
                  <Tab
                    label={formatMessage('app.connections')}
                    to={URLS.APP_CONNECTIONS(appKey)}
                    value={URLS.APP_CONNECTIONS_PATTERN}
                    disabled={
                      !currentUserAbility.can('read', 'Connection') ||
                      !app.supportsConnections
                    }
                    component={Link}
                    data-test="connections-tab"
                  />
                  <Tab
                    label={formatMessage('app.flows')}
                    to={URLS.APP_FLOWS(appKey)}
                    value={URLS.APP_FLOWS_PATTERN}
                    component={Link}
                    data-test="flows-tab"
                    disabled={!currentUserAbility.can('read', 'Flow')}
                  />
                </Tabs>
              </Box>

              <Routes>
                <Route
                  path={`${URLS.FLOWS}/*`}
                  element={
                    <Can I="read" a="Flow">
                      <AppFlows appKey={appKey} />
                    </Can>
                  }
                />
                <Route
                  path={`${URLS.CONNECTIONS}/*`}
                  element={
                    <Can I="read" a="Connection">
                      <AppConnections appKey={appKey} />
                    </Can>
                  }
                />
                <Route
                  path="/"
                  element={
                    <Navigate
                      to={
                        app.supportsConnections
                          ? URLS.APP_CONNECTIONS(appKey)
                          : URLS.APP_FLOWS(appKey)
                      }
                      replace
                    />
                  }
                />
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Routes>
        <Route
          path="/connections/add"
          element={
            <Can I="create" a="Connection">
              <AddAppConnection
                onClose={goToApplicationPage}
                application={app}
              />
            </Can>
          }
        />

        <Route
          path="/connections/:connectionId/reconnect"
          element={
            <Can I="create" a="Connection">
              <ReconnectConnection
                application={app}
                onClose={goToApplicationPage}
              />
            </Can>
          }
        />
      </Routes>
    </>
  );
}
