import * as React from 'react';
import { useQuery } from '@apollo/client';
import { Link, Route, Navigate, Routes, useParams, useMatch, useNavigate } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';

import useFormatMessage from 'hooks/useFormatMessage';
import { GET_APP } from 'graphql/queries/get-app';
import * as URLS from 'config/urls';

import ConditionalIconButton from 'components/ConditionalIconButton';
import AppConnections from 'components/AppConnections';
import AppFlows from 'components/AppFlows';
import AddAppConnection from 'components/AddAppConnection';
import AppIcon from 'components/AppIcon';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';

type ApplicationParams = {
  appKey: string;
  connectionId?: string;
};

const ReconnectConnection = (props: any) => {
  const { application, onClose } = props;
  const { connectionId } = useParams() as ApplicationParams;

  return (
    <AddAppConnection
      onClose={onClose}
      application={application}
      connectionId={connectionId}
    />
  );
}

export default function Application() {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const formatMessage = useFormatMessage();
  const connectionsPathMatch = useMatch({ path: URLS.APP_CONNECTIONS_PATTERN, end: false });
  const flowsPathMatch = useMatch({ path: URLS.APP_FLOWS_PATTERN, end: false });
  const { appKey } = useParams() as ApplicationParams;
  const navigate = useNavigate();
  const { data } = useQuery(GET_APP, { variables: { key: appKey } });

  const goToApplicationPage = () => navigate('connections');
  const app = data?.getApp || {};

  const NewConnectionLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(function InlineLink(
        linkProps,
        ref,
      ) {
        return <Link ref={ref} to={URLS.APP_ADD_CONNECTION(appKey)} {...linkProps} />;
      }),
    [appKey],
  );

  const NewFlowLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(function InlineLink(
        linkProps,
        ref,
      ) {
        return <Link ref={ref} to={URLS.APP_ADD_CONNECTION(appKey)} {...linkProps} />;
      }),
    [appKey],
  );

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
                    <ConditionalIconButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      component={NewFlowLink}
                      fullWidth
                      icon={<AddIcon />}
                    >
                      {formatMessage('app.createFlow')}
                    </ConditionalIconButton>
                  }
                />

                <Route
                  path={`${URLS.CONNECTIONS}/*`}
                  element={
                    <ConditionalIconButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      component={NewConnectionLink}
                      fullWidth
                      icon={<AddIcon />}
                    >
                      {formatMessage('app.addConnection')}
                    </ConditionalIconButton>
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
                  value={connectionsPathMatch?.pattern?.path || flowsPathMatch?.pattern?.path}
                >
                  <Tab
                    label={formatMessage('app.connections')}
                    to={URLS.APP_CONNECTIONS(appKey)}
                    value={URLS.APP_CONNECTIONS_PATTERN}
                    component={Link}
                  />

                  <Tab
                    label={formatMessage('app.flows')}
                    to={URLS.APP_FLOWS(appKey)}
                    value={URLS.APP_FLOWS_PATTERN}
                    component={Link}
                  />
                </Tabs>
              </Box>

              <Routes>
                <Route path={`${URLS.FLOWS}/*`} element={<AppFlows appKey={appKey} />} />

                <Route path={`${URLS.CONNECTIONS}/*`} element={<AppConnections appKey={appKey} />} />

                <Route path="/" element={<Navigate to={URLS.APP_CONNECTIONS(appKey)} />} />
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Routes>
        <Route
          path="/connections/add"
          element={
            <AddAppConnection
              onClose={goToApplicationPage}
              application={app}
            />
          }
        />

        <Route
          path="/connections/:connectionId/reconnect"
          element={<ReconnectConnection application={app} onClose={goToApplicationPage} />}
        />
      </Routes>
    </>
  );
};
