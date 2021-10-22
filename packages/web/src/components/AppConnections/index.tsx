import { useQuery } from '@apollo/client';
import { GET_APP_CONNECTIONS } from 'graphql/queries/get-app-connections';

import AppConnectionRow from 'components/AppConnectionRow';
import type { Connection } from 'types/connection';

type AppConnectionsProps = {
  appKey: String;
}

export default function AppConnections(props: AppConnectionsProps) {
  const { appKey } = props;
  const { data } = useQuery(GET_APP_CONNECTIONS, { variables: { key: appKey } });
  const appConnections: Connection[] = data?.getApp?.connections || [];

  return (
    <>
      {appConnections.map((appConnection: Connection) => (
        <AppConnectionRow key={appConnection.id} connection={appConnection} />
      ))}
    </>
  )
};
