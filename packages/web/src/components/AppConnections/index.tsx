import * as React from 'react';
import { useQuery } from '@apollo/client';

import type { IConnection } from '@automatisch/types';
import { GET_APP_CONNECTIONS } from 'graphql/queries/get-app-connections';
import AppConnectionRow from 'components/AppConnectionRow';
import NoResultFound from 'components/NoResultFound';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';

type AppConnectionsProps = {
  appKey: string;
};

export default function AppConnections(
  props: AppConnectionsProps
): React.ReactElement {
  const { appKey } = props;
  const formatMessage = useFormatMessage();
  const { data } = useQuery(GET_APP_CONNECTIONS, {
    variables: { key: appKey },
  });
  const appConnections: IConnection[] = data?.getApp?.connections || [];

  const hasConnections = appConnections?.length;

  if (!hasConnections) {
    return (
      <NoResultFound
        to={URLS.APP_ADD_CONNECTION(appKey)}
        text={formatMessage('app.noConnections')}
        data-test="connections-no-results"
      />
    );
  }

  return (
    <>
      {appConnections.map((appConnection: IConnection) => (
        <AppConnectionRow key={appConnection.id} connection={appConnection} />
      ))}
    </>
  );
}
