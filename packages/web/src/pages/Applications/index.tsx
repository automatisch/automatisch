import * as React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';


import ConditionalIconButton from 'components/ConditionalIconButton';
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
  const [appName, setAppName] = React.useState(null);
  const { data } = useQuery(GET_CONNECTED_APPS, { variables: {name: appName } });

  const onSearchChange = React.useCallback((event) => {
    setAppName(event.target.value);
  }, []);

  const goToApps = React.useCallback(() => {
    navigate(URLS.APPS);
  }, [navigate]);

  const NewAppConnectionLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(function InlineLink(
        linkProps,
        ref,
      ) {
        return <Link ref={ref} to={URLS.NEW_APP_CONNECTION} {...linkProps} />;
      }),
    [],
  );

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [2, 5] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center" order={{ xs: 0 }}>
            <PageTitle>{formatMessage('apps.title')}</PageTitle>
          </Grid>

          <Grid item xs={12} sm="auto" order={{ xs: 2, sm: 1 }}>
            <SearchInput onChange={onSearchChange} />
          </Grid>

          <Grid container item xs="auto" sm="auto" alignItems="center" order={{ xs: 1, sm: 2 }}>
            <ConditionalIconButton
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              component={NewAppConnectionLink}
              fullWidth
              icon={<AddIcon />}
            >
              {formatMessage('apps.addConnection')}
            </ConditionalIconButton>
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
