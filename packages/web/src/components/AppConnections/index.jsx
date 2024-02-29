import * as React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { GET_APP_CONNECTIONS } from 'graphql/queries/get-app-connections';
import AppConnectionRow from 'components/AppConnectionRow';
import NoResultFound from 'components/NoResultFound';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';

function AppConnections(props) {
  const { appKey } = props;
  const formatMessage = useFormatMessage();
  const { data } = useQuery(GET_APP_CONNECTIONS, {
    variables: { key: appKey },
  });
  const appConnections = data?.getApp?.connections || [];
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
      {appConnections.map((appConnection) => (
        <AppConnectionRow key={appConnection.id} connection={appConnection} />
      ))}
    </>
  );
}

AppConnections.propTypes = {
  appKey: PropTypes.string.isRequired,
};

export default AppConnections;
