import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import * as React from 'react';

import AddAppConnection from 'components/AddAppConnection';
import AppOAuthClientsDialog from 'components/OAuthClientsDialog/index.ee';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import useAppConfig from 'hooks/useAppConfig.ee';
import { EditorContext } from 'contexts/Editor';
import useAuthenticateApp from 'hooks/useAuthenticateApp.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import {
  AppPropType,
  StepPropType,
  SubstepPropType,
} from 'propTypes/propTypes';
import useStepConnection from 'hooks/useStepConnection';
import { useQueryClient } from '@tanstack/react-query';
import useAppConnections from 'hooks/useAppConnections';
import useTestConnection from 'hooks/useTestConnection';
import useOAuthClients from 'hooks/useOAuthClients';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import appConfig from 'config/app.js';

const useNewFlowEditor = appConfig.useNewFlowEditor;

const ADD_CONNECTION_VALUE = 'ADD_CONNECTION';
const ADD_SHARED_CONNECTION_VALUE = 'ADD_SHARED_CONNECTION';

const optionGenerator = (connection) => ({
  label: connection?.formattedData?.screenName ?? 'Unnamed',
  value: connection?.id,
});

const getOption = (options, connectionId) =>
  options.find((connection) => connection.value === connectionId) || '';

function ChooseConnectionSubstep(props) {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    step,
    onSubmit,
    onChange,
    application,
  } = props;
  const { appKey } = step;
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();

  const editorContext = React.useContext(EditorContext);
  const [showAddConnectionDialog, setShowAddConnectionDialog] =
    React.useState(false);
  const [showAddSharedConnectionDialog, setShowAddSharedConnectionDialog] =
    React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const queryClient = useQueryClient();

  const { authenticate } = useAuthenticateApp({
    appKey: application.key,
    useShared: true,
  });

  const { data: appOAuthClients } = useOAuthClients(application.key);

  const {
    data: appConnectionsData,
    isLoading: isAppConnectionsLoading,
    refetch: refetchAppConnections,
  } = useAppConnections(appKey);
  const { data: appConfig } = useAppConfig(application.key);

  const { data: stepConnectionData } = useStepConnection(step.id);
  const stepConnection = stepConnectionData?.data;

  // TODO: show detailed error when connection test/verification fails
  const { mutate: testConnection, isPending: isTestConnectionPending } =
    useTestConnection({
      connectionId: stepConnection?.id,
    });

  React.useEffect(() => {
    if (stepConnection?.id) {
      testConnection({
        variables: {
          id: stepConnection.id,
        },
      });
    }
    // intentionally no dependencies for initial test
  }, []);

  const connectionOptions = React.useMemo(() => {
    const appWithConnections = appConnectionsData?.data;
    const options =
      appWithConnections?.map((connection) => optionGenerator(connection)) ||
      [];

    const addCustomConnection = {
      label: formatMessage('chooseConnectionSubstep.addNewConnection'),
      value: ADD_CONNECTION_VALUE,
    };

    const addConnectionWithOAuthClient = {
      label: formatMessage(
        'chooseConnectionSubstep.addConnectionWithOAuthClient',
      ),
      value: ADD_SHARED_CONNECTION_VALUE,
    };

    // means there is no app config. defaulting to custom connections only
    if (!appConfig?.data) {
      return options.concat([addCustomConnection]);
    }

    // app is disabled.
    if (appConfig.data.disabled) return options;

    // means only OAuth clients are allowed for connection creation and there is OAuth client
    if (
      appConfig.data.useOnlyPredefinedAuthClients === true &&
      appOAuthClients.data.length > 0
    ) {
      return options.concat([addConnectionWithOAuthClient]);
    }

    // means there is no OAuth client. so we don't show the `addConnectionWithOAuthClient`
    if (
      appConfig.data.useOnlyPredefinedAuthClients === true &&
      appOAuthClients.data.length === 0
    ) {
      return options;
    }

    if (appOAuthClients.data.length === 0) {
      return options.concat([addCustomConnection]);
    }

    return options.concat([addCustomConnection, addConnectionWithOAuthClient]);
  }, [appConnectionsData, formatMessage, appConfig, appOAuthClients]);

  const handleClientClick = async (oauthClientId) => {
    try {
      const response = await authenticate?.({
        oauthClientId,
      });
      const connectionId = response?.createConnection.id;

      if (connectionId) {
        await refetchAppConnections();
        onChange({
          step: {
            ...step,
            connection: {
              id: connectionId,
            },
          },
        });
      }
    } catch (error) {
      enqueueSnackbar(error?.message || formatMessage('genericError'), {
        variant: 'error',
      });
    } finally {
      setShowAddSharedConnectionDialog(false);
    }
  };

  const { name } = substep;

  const handleAddConnectionClose = React.useCallback(
    async (response) => {
      setSubmitting(true);
      setShowAddConnectionDialog(false);
      const connectionId = response?.createConnection?.id;
      if (connectionId) {
        await refetchAppConnections();
        await onChange({
          step: {
            ...step,
            connection: {
              id: connectionId,
            },
          },
        });
      }
      setSubmitting(false);
    },
    [onChange, refetchAppConnections, step],
  );

  const handleChange = React.useCallback(
    async (event, selectedOption) => {
      if (typeof selectedOption === 'object') {
        setSubmitting(true);
        const connectionId = selectedOption?.value;

        if (connectionId === ADD_CONNECTION_VALUE) {
          setShowAddConnectionDialog(true);
        } else if (connectionId === ADD_SHARED_CONNECTION_VALUE) {
          setShowAddSharedConnectionDialog(true);
        } else if (connectionId !== stepConnection?.id) {
          await onChange({
            step: {
              ...step,
              connection: {
                id: connectionId,
              },
            },
          });

          await queryClient.invalidateQueries({
            queryKey: ['steps', step.id, 'connection'],
          });
        }
        setSubmitting(false);
      }
    },
    [stepConnection?.id, onChange, step, queryClient],
  );

  React.useEffect(() => {
    if (stepConnection?.id) {
      testConnection({
        id: stepConnection?.id,
      });
    }
  }, [stepConnection?.id, testConnection]);

  const onToggle = expanded ? onCollapse : onExpand;

  return (
    <React.Fragment>
      <FlowSubstepTitle
        expanded={expanded}
        onClick={onToggle}
        title={name}
        valid={isTestConnectionPending ? null : stepConnection?.verified}
      />
      <Collapse
        in={expanded}
        timeout={useNewFlowEditor ? 0 : 'auto'}
        unmountOnExit
      >
        <ListItem
          sx={{
            pt: 2,
            pb: 3,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Autocomplete
            fullWidth
            disablePortal
            disableClearable
            disabled={
              editorContext.readOnly || isTestConnectionPending || submitting
            }
            options={connectionOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage(
                  'chooseConnectionSubstep.chooseConnection',
                )}
                required
              />
            )}
            value={getOption(connectionOptions, stepConnection?.id)}
            onChange={handleChange}
            loading={isAppConnectionsLoading}
            data-test="choose-connection-autocomplete"
            componentsProps={{ popper: { className: 'nowheel' } }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 2 }}
            disabled={
              submitting ||
              isTestConnectionPending ||
              !stepConnection?.verified ||
              editorContext.readOnly
            }
            data-test="flow-substep-continue-button"
          >
            {formatMessage('chooseConnectionSubstep.continue')}
          </Button>
        </ListItem>
      </Collapse>

      {application && showAddConnectionDialog && (
        <AddAppConnection
          onClose={handleAddConnectionClose}
          application={application}
        />
      )}

      {application && showAddSharedConnectionDialog && (
        <AppOAuthClientsDialog
          appKey={application.key}
          onClose={() => setShowAddSharedConnectionDialog(false)}
          onClientClick={handleClientClick}
        />
      )}
    </React.Fragment>
  );
}

ChooseConnectionSubstep.propTypes = {
  application: AppPropType.isRequired,
  substep: SubstepPropType.isRequired,
  expanded: PropTypes.bool,
  onExpand: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  step: StepPropType.isRequired,
};

export default ChooseConnectionSubstep;
