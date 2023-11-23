import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import type { IConnection } from '@automatisch/types';

import { GET_APP_CONNECTIONS } from 'graphql/queries/get-app-connections';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import NoResultFound from 'components/NoResultFound';

import AppConnectionRow from './AppConnectionRow';

type AdminApplicationConnectionsProps = { appKey: string };

function AdminApplicationConnections(
  props: AdminApplicationConnectionsProps
): React.ReactElement {
  const { appKey } = props;
  const formatMessage = useFormatMessage();
  const { data, loading } = useQuery(GET_APP_CONNECTIONS, {
    variables: { key: appKey },
  });
  const appConnections: IConnection[] = data?.getApp?.connections || [];

  if (loading)
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;

  if (appConnections.length === 0) {
    return (
      <NoResultFound
        to={URLS.ADMIN_APP_CONNECTIONS_CREATE(appKey)}
        text={formatMessage('adminAppsConnections.noConnections')}
      />
    );
  }

  return (
    <div>
      {appConnections.map((appConnection) => (
        <AppConnectionRow key={appConnection.id} connection={appConnection} />
      ))}
      <Stack justifyContent="flex-end" direction="row">
        <Link to={URLS.ADMIN_APP_CONNECTIONS_CREATE(appKey)}>
          <Button variant="contained" sx={{ mt: 2 }} component="div">
            {formatMessage('adminAppsConnections.createConnection')}
          </Button>
        </Link>
      </Stack>
    </div>
  );
}

export default AdminApplicationConnections;
