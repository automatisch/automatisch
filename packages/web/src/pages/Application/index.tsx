import { useQuery } from '@apollo/client';
import { Link, Route, Redirect, Switch, useParams, useRouteMatch, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SettingsIcon from '@mui/icons-material/Settings';

import useFormatMessage from 'hooks/useFormatMessage';
import { GET_APP } from 'graphql/queries/get-app';
import * as URLS from 'config/urls';

import AddAppConnection from 'components/AddAppConnection';
import AppIcon from 'components/AppIcon';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';

type ApplicationParams = {
  slug: string;
};

export default function Application() {
  const formatMessage = useFormatMessage();
  const routeMatch = useRouteMatch([URLS.APP_CONNECTIONS_PATTERN, URLS.APP_FLOWS_PATTERN, URLS.APP_PATTERN]);
  const { slug } = useParams<ApplicationParams>();
  const history = useHistory();
  const { data } = useQuery(GET_APP, { variables: { name: slug } });

  const app = data?.getApp || {};

  const goToApplicationPage = () => history.push(URLS.APP(slug));

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Container>
          <Grid container sx={{ mb: 3 }}>
            <Grid item xs="auto" sx={{ mr: 1.5 }}>
              <AppIcon url={app.iconUrl} color={app.primaryColor} name={app.name} />
            </Grid>

            <Grid item xs>
              <PageTitle>{app.name}</PageTitle>
            </Grid>

            <Grid item xs="auto" justifyContent="flex-end">
              <IconButton sx={{ mr: 2 }} title={formatMessage('app.settings')}>
                <SettingsIcon />
              </IconButton>

              <Button variant="contained" component={Link} to={URLS.APP_ADD_CONNECTION(slug)}>
                {formatMessage('app.addConnection')}
              </Button>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={routeMatch?.path}>
                  <Tab
                    label={formatMessage('app.connections')}
                    to={URLS.APP_CONNECTIONS(slug)}
                    value={URLS.APP_CONNECTIONS_PATTERN}
                    component={Link}
                  />

                  <Tab
                    label={formatMessage('app.flows')}
                    to={URLS.APP_FLOWS(slug)}
                    value={URLS.APP_FLOWS_PATTERN}
                    component={Link}
                  />
                </Tabs>
              </Box>

              <Switch>
                <Route path={URLS.APP_FLOWS_PATTERN}>
                    Flows come here.
                </Route>

                <Route path={URLS.APP_CONNECTIONS_PATTERN}>
                    Connections come here.
                </Route>

                <Route exact path={URLS.APP_PATTERN}>
                  <Redirect to={URLS.APP_CONNECTIONS(slug)} />
                </Route>
              </Switch>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Route exact path={URLS.APP_ADD_CONNECTION_PATTERN}>
        <AddAppConnection onClose={goToApplicationPage} application={app} />
      </Route>
    </>
  );
};
