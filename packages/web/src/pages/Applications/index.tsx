import { useCallback, useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
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
import { GET_CONNECTED_APPS } from 'graphql/queries/get-connected-apps';
import * as URLS from 'config/urls';
import type { App } from 'types/app';

export default function Applications() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const [appName, setAppName] = useState(null);
  const { data } = useQuery(GET_CONNECTED_APPS, { variables: {name: appName } });

  const onSearchChange = useCallback((event) => {
    setAppName(event.target.value);
  }, []);

  const goToApps = useCallback(() => {
    navigate(URLS.APPS);
  }, [navigate]);

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

        {data?.getConnectedApps?.map((app: App) => (
          <AppRow key={app.name} application={app} />
        ))}

        <Routes>
          <Route path="/new" element={<AddNewAppConnection onClose={goToApps} />} />
        </Routes>
      </Container>
    </Box>
  );
};
