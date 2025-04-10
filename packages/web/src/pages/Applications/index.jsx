import * as React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import Can from 'components/Can';
import NoResultFound from 'components/NoResultFound';
import ConditionalIconButton from 'components/ConditionalIconButton';
import Container from 'components/Container';
import AddNewAppConnection from 'components/AddNewAppConnection';
import PageTitle from 'components/PageTitle';
import AppRow from 'components/AppRow';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';
import useUserApps from 'hooks/useUserApps';

export default function Applications() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const [appName, setAppName] = React.useState(null);
  const { data, isLoading } = useUserApps(appName);
  const apps = data?.data;
  const hasApps = apps?.length;

  const onSearchChange = React.useCallback((event) => {
    setAppName(event.target.value);
  }, []);

  const goToApps = React.useCallback(() => {
    navigate(URLS.APPS);
  }, [navigate]);

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center" order={{ xs: 0 }}>
            <PageTitle>{formatMessage('apps.title')}</PageTitle>
          </Grid>

          <Grid item xs={12} sm="auto" order={{ xs: 2, sm: 1 }}>
            <SearchInput onChange={onSearchChange} />
          </Grid>

          <Grid
            container
            item
            xs="auto"
            sm="auto"
            alignItems="center"
            order={{ xs: 1, sm: 2 }}
          >
            <Can I="manage" a="Connection" passThrough>
              {(allowed) => (
                <ConditionalIconButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  component={Link}
                  to={URLS.NEW_APP_CONNECTION}
                  fullWidth
                  disabled={!allowed}
                  icon={<AddIcon />}
                  data-test="add-connection-button"
                >
                  {formatMessage('apps.addConnection')}
                </ConditionalIconButton>
              )}
            </Can>
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {isLoading && (
          <CircularProgress
            data-test="apps-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        )}

        {!isLoading && !hasApps && (
          <Can I="manage" a="Connection" passThrough>
            {(allowed) => (
              <NoResultFound
                text={formatMessage('apps.noConnections')}
                {...(allowed && { to: URLS.NEW_APP_CONNECTION })}
              />
            )}
          </Can>
        )}

        {!isLoading &&
          apps?.map((app) => (
            <AppRow key={app.name} application={app} url={URLS.APP(app.key)} />
          ))}

        <Routes>
          <Route
            path="/new"
            element={<AddNewAppConnection onClose={goToApps} />}
          />
        </Routes>
      </Container>
    </Box>
  );
}
