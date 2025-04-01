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
import AppOAuthClientsDialog from 'components/OAuthClientsDialog/index.ee';
import InputCreator from 'components/InputCreator';
import * as URLS from 'config/urls';
import useAuthenticateApp from 'hooks/useAuthenticateApp.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useAppConfig from 'hooks/useAppConfig.ee';
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
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [errorDetails, setErrorDetails] = React.useState(null);
  const [inProgress, setInProgress] = React.useState(false);
  const hasConnection = Boolean(connectionId);
  const useShared = searchParams.get('shared') === 'true';
  const oauthClientId = searchParams.get('oauthClientId') || undefined;
  const { authenticate } = useAuthenticateApp({
    appKey: key,
    connectionId,
    oauthClientId,
    useShared: !!oauthClientId,
  });
  const queryClient = useQueryClient();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { data: appConfig } = useAppConfig(key);

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
    function initiateSharedAuthenticationForGivenOAuthClient() {
      if (!oauthClientId) return;

      if (!authenticate) return;

      const asyncAuthenticate = async () => {
        try {
          await authenticate();
          navigate(URLS.APP_CONNECTIONS(key));
        } catch (error) {
          enqueueSnackbar(error?.message || formatMessage('genericError'), {
            variant: 'error',
          });
        }
      };

      asyncAuthenticate();
    },
    [oauthClientId, authenticate, key, navigate],
  );

  const handleClientClick = (oauthClientId) =>
    navigate(URLS.APP_ADD_CONNECTION_WITH_OAUTH_CLIENT_ID(key, oauthClientId));

  const handleOAuthClientsDialogClose = () =>
    navigate(URLS.APP_CONNECTIONS(key));

  const submitHandler = React.useCallback(
    async (data) => {
      if (!authenticate) return;
      setInProgress(true);
      setErrorMessage(null);
      setErrorDetails(null);
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

        setErrorMessage(error.message);
        setErrorDetails(error?.response?.data?.errors);
      } finally {
        setInProgress(false);
      }
    },
    [authenticate, key, onClose, queryClient],
  );

  if (useShared)
    return (
      <AppOAuthClientsDialog
        appKey={key}
        onClose={handleOAuthClientsDialogClose}
        onClientClick={handleClientClick}
      />
    );

  if (oauthClientId) return <React.Fragment />;

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
        <Alert severity="info">
          {formatMessage('addAppConnection.callToDocs', {
            appName: name,
            docsLink: generateExternalLink(authDocUrl),
          })}
        </Alert>
      )}

      {(errorMessage || errorDetails) && (
        <Alert
          data-test="add-connection-error"
          severity="error"
          sx={{ mt: 1, wordBreak: 'break-all' }}
        >
          {!errorDetails && errorMessage}
          {errorDetails && (
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(errorDetails, null, 2)}
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
              disabled={!authenticate || appConfig?.data?.disabled === true}
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
