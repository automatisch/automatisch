import * as React from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { useQuery } from '@apollo/client';
import { IApp } from '@automatisch/types';

import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import SearchInput from 'components/SearchInput';
import AppRow from 'components/AppRow';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import { GET_APPS } from 'graphql/queries/get-apps';

function AdminApplications() {
  const formatMessage = useFormatMessage();
  const [appName, setAppName] = React.useState(null);
  const { data, loading: appsLoading } = useQuery(GET_APPS, {
    variables: { name: appName },
  });
  const apps = data?.getApps;

  const onSearchChange = React.useCallback((event) => {
    setAppName(event.target.value);
  }, []);

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center" order={{ xs: 0 }}>
            <PageTitle>{formatMessage('adminApps.title')}</PageTitle>
          </Grid>
          <Grid item xs={12} sm="auto" order={{ xs: 2, sm: 1 }}>
            <SearchInput onChange={onSearchChange} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mt: [2, 0], mb: 2 }} />
        </Grid>

        {appsLoading && (
          <CircularProgress
            data-test="apps-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        )}

        {!appsLoading &&
          apps?.map((app: IApp) => (
            <Grid item xs={12} key={app.name}>
              <AppRow application={app} url={URLS.ADMIN_APP(app.key)} />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

export default AdminApplications;
