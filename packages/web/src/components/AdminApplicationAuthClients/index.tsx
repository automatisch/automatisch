import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useAppAuthClients from 'hooks/useAppAuthClients.ee';

import NoResultFound from 'components/NoResultFound';

type AdminApplicationAuthClientsProps = {
  appKey: string;
};

function AdminApplicationAuthClients(
  props: AdminApplicationAuthClientsProps
): React.ReactElement {
  const { appKey } = props;
  const formatMessage = useFormatMessage();
  const { appAuthClients, loading } = useAppAuthClients({ appKey });

  if (loading)
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;

  if (!appAuthClients?.length) {
    return (
      <NoResultFound
        to={URLS.ADMIN_APP_AUTH_CLIENTS_CREATE(appKey)}
        text={formatMessage('adminAppsAuthClients.noAuthClients')}
      />
    );
  }

  const sortedAuthClients = appAuthClients.slice().sort((a, b) => {
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
      {sortedAuthClients.map((client) => (
        <Card sx={{ mb: 1 }} key={client.id}>
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
                      ? 'adminAppsAuthClients.statusActive'
                      : 'adminAppsAuthClients.statusInactive'
                  )}
                />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
      <Stack justifyContent="flex-end" direction="row">
        <Link to={URLS.ADMIN_APP_AUTH_CLIENTS_CREATE(appKey)}>
          <Button variant="contained" sx={{ mt: 2 }} component="div">
            {formatMessage('createAuthClient.button')}
          </Button>
        </Link>
      </Stack>
    </div>
  );
}

export default AdminApplicationAuthClients;
