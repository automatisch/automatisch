import { useCallback, useState } from 'react';
import { Link, Route, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Container from 'components/Container';
import AddNewAppConnection from 'components/AddNewAppConnection';
import PageTitle from 'components/PageTitle';
import AppRow from 'components/AppRow';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage'
import { GET_APPS } from 'graphql/queries/get-apps';
import * as URLS from 'config/urls';
import type { App } from 'types/app';

export default function Applications() {
  const history = useHistory();
  const formatMessage = useFormatMessage();
  const [appName, setAppName] = useState(null);
  const { data } = useQuery(GET_APPS, { variables: {name: appName } });

  const onSearchChange = useCallback((event) => {
    setAppName(event.target.value);
  }, []);

  const goToApps = useCallback(() => {
    history.push(URLS.APPS);
  }, [history]);

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: 3 }} spacing={1}>
          <Grid item xs={12} sm>
            <PageTitle>{formatMessage('apps.title')}</PageTitle>
          </Grid>

          <Grid container item xs={12} sm="auto" justifyContent="flex-end" spacing={2}>
            <Grid item xs={12} sm="auto">
              <SearchInput onChange={onSearchChange} />
            </Grid>

            <Grid item xs={12} sm="auto">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                component={Link}
                to={URLS.NEW_APP_CONNECTION}
                fullWidth
              >
                {formatMessage('apps.addConnection')}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {data?.getApps?.map((app: App) => (
          <AppRow key={app.name} application={app} />
        ))}

        <Route exact path={URLS.NEW_APP_CONNECTION}>
          <AddNewAppConnection onClose={goToApps} />
        </Route>
      </Container>
    </Box>
  );
};
