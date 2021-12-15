import * as React from 'react';
import { useQuery } from '@apollo/client';

import { GET_APP_CONNECTIONS } from 'graphql/queries/get-app-connections';
import AppConnectionRow from 'components/AppConnectionRow';
import NoResultFound from 'components/NoResultFound';
import useFormatMessage from 'hooks/useFormatMessage';
import type { Connection } from 'types/connection';
import * as URLS from 'config/urls';

type AppConnectionsProps = {
  appKey: string;
}

export default function AppConnections(props: AppConnectionsProps) {
  const { appKey } = props;
  const formatMessage = useFormatMessage();
  const { data } = useQuery(GET_APP_CONNECTIONS, { variables: { key: appKey } });
  const appConnections: Connection[] = data?.getApp?.connections || [];

  const hasConnections = appConnections?.length;

  if (!hasConnections) {
    return (
      <NoResultFound
        to={URLS.APP_ADD_CONNECTION(appKey)}
        text={formatMessage('app.noConnections')}
      />
    );
  }

  return (
    <>
      {appConnections.map((appConnection: Connection) => (
        <AppConnectionRow key={appConnection.id} connection={appConnection} />
      ))}
    </>
  )
};
