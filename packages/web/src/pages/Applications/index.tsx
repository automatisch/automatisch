import { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import AppRow from 'components/AppRow';
import SearchInput from 'components/SearchInput';
import * as URLS from 'config/urls';
import { GET_APPS } from 'graphql/queries/get-apps';
import type { App } from 'types/app';

export default function Applications() {
  const [appName, setAppName] = useState(null);
  const { data } = useQuery(GET_APPS, { variables: {name: appName } });

  const onSearchChange = useCallback((event) => {
    setAppName(event.target.value);
  }, []);

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <PageTitle>Applications</PageTitle>
          </Grid>

          <Grid container item xs={6} justifyContent="flex-end">
            <SearchInput onChange={onSearchChange} />
          </Grid>
        </Grid>

        {data?.getApps?.map((app: App) => (
          <AppRow key={app.name} application={app} />
        ))}
      </Container>
    </Box>
  );
};
