import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AppPropType } from 'propTypes/propTypes';
import AppAuthClientsDialog from 'components/AppAuthClientsDialog/index.ee';
import InputCreator from 'components/InputCreator';
import * as URLS from 'config/urls';
import useAuthenticateApp from 'hooks/useAuthenticateApp.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import { generateExternalLink } from 'helpers/translationValues';
import { Form } from './style';
import useAppAuth from 'hooks/useAppAuth';
import { useQueryClient } from '@tanstack/react-query';

function AddAppConnection(props) {
  const { application, connectionId, onClose } = props;
  const { name, authDocUrl, key } = application;
  const { data: auth } = useAppAuth(key);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formatMessage = useFormatMessage();
  const [error, setError] = React.useState(null);
  const [inProgress, setInProgress] = React.useState(false);
  const hasConnection = Boolean(connectionId);
  const useShared = searchParams.get('shared') === 'true';
  const appAuthClientId = searchParams.get('appAuthClientId') || undefined;
  const { authenticate } = useAuthenticateApp({
    appKey: key,
    connectionId,
    appAuthClientId,
    useShared: !!appAuthClientId,
  });
  const queryClient = useQueryClient();

  React.useEffect(function relayProviderData() {
    if (window.opener) {
      window.opener.postMessage({
        source: 'automatisch',
        payload: { search: window.location.search, hash: window.location.hash },
      });

      window.close();
    }
  }, []);

  React.useEffect(
    function initiateSharedAuthenticationForGivenAuthClient() {
      if (!appAuthClientId) return;

      if (!authenticate) return;

      const asyncAuthenticate = async () => {
        await authenticate();
        navigate(URLS.APP_CONNECTIONS(key));
      };

      asyncAuthenticate();
    },
    [appAuthClientId, authenticate],
  );

  const handleClientClick = (appAuthClientId) =>
    navigate(URLS.APP_ADD_CONNECTION_WITH_AUTH_CLIENT_ID(key, appAuthClientId));

  const handleAuthClientsDialogClose = () =>
    navigate(URLS.APP_CONNECTIONS(key));

  const submitHandler = React.useCallback(
    async (data) => {
      if (!authenticate) return;
      setInProgress(true);
      try {
        const response = await authenticate({
          fields: data,
        });

        await queryClient.invalidateQueries({
          queryKey: ['apps', key, 'connections'],
        });
        onClose(response);
      } catch (err) {
        const error = err;
        console.log(error);
        setError(error.graphQLErrors?.[0]);
      } finally {
        setInProgress(false);
      }
    },
    [authenticate],
  );

  if (useShared)
    return (
      <AppAuthClientsDialog
        appKey={key}
        onClose={handleAuthClientsDialogClose}
        onClientClick={handleClientClick}
      />
    );

  if (appAuthClientId) return <React.Fragment />;

  return (
    <Dialog
      open={true}
      onClose={() => onClose()}
      data-test="add-app-connection-dialog"
    >
      <DialogTitle>
        {hasConnection
          ? formatMessage('app.reconnectConnection')
          : formatMessage('app.addConnection')}
      </DialogTitle>

      {authDocUrl && (
        <Alert severity="info" sx={{ fontWeight: 300 }}>
          {formatMessage('addAppConnection.callToDocs', {
            appName: name,
            docsLink: generateExternalLink(authDocUrl),
          })}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 1, fontWeight: 500, wordBreak: 'break-all' }}
        >
          {error.message}
          {error.details && (
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(error.details, null, 2)}
            </pre>
          )}
        </Alert>
      )}

      <DialogContent>
        <DialogContentText tabIndex={-1} component="div">
          <Form onSubmit={submitHandler}>
            {auth?.data?.fields?.map((field) => (
              <InputCreator key={field.key} schema={field} />
            ))}

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2 }}
              loading={inProgress}
              disabled={!authenticate}
              data-test="create-connection-button"
            >
              {formatMessage('addAppConnection.submit')}
            </LoadingButton>
          </Form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

AddAppConnection.propTypes = {
  onClose: PropTypes.func.isRequired,
  application: AppPropType.isRequired,
  connectionId: PropTypes.string,
};

export default AddAppConnection;
