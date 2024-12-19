import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import NoResultFound from 'components/NoResultFound';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminOAuthClients from 'hooks/useAdminOAuthClients';

function AdminApplicationOAuthClients(props) {
  const { appKey } = props;
  const formatMessage = useFormatMessage();
  const { data: appOAuthClients, isLoading } = useAdminOAuthClients(appKey);

  if (isLoading)
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;

  if (!appOAuthClients?.data.length) {
    return (
      <NoResultFound
        to={URLS.ADMIN_APP_AUTH_CLIENTS_CREATE(appKey)}
        text={formatMessage('adminAppsOAuthClients.noOauthClients')}
      />
    );
  }

  const sortedOAuthClients = appOAuthClients.data.slice().sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      {sortedOAuthClients.map((client) => (
        <Card sx={{ mb: 1 }} key={client.id} data-test="auth-client">
          <CardActionArea
            component={Link}
            to={URLS.ADMIN_APP_AUTH_CLIENT(appKey, client.id)}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" noWrap>
                  {client.name}
                </Typography>
                <Chip
                  size="small"
                  color={client?.active ? 'success' : 'info'}
                  variant={client?.active ? 'filled' : 'outlined'}
                  label={formatMessage(
                    client?.active
                      ? 'adminAppsOAuthClients.statusActive'
                      : 'adminAppsOAuthClients.statusInactive',
                  )}
                />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
      <Stack justifyContent="flex-end" direction="row">
        <Link to={URLS.ADMIN_APP_AUTH_CLIENTS_CREATE(appKey)}>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            component="div"
            data-test="create-auth-client-button"
          >
            {formatMessage('createOAuthClient.button')}
          </Button>
        </Link>
      </Stack>
    </div>
  );
}

AdminApplicationOAuthClients.propTypes = {
  appKey: PropTypes.string.isRequired,
};

export default AdminApplicationOAuthClients;
