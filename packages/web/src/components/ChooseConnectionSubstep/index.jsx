import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import * as React from 'react';

import AddAppConnection from 'components/AddAppConnection';
import AppAuthClientsDialog from 'components/AppAuthClientsDialog/index.ee';
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

const ADD_CONNECTION_VALUE = 'ADD_CONNECTION';
const ADD_SHARED_CONNECTION_VALUE = 'ADD_SHARED_CONNECTION';

const optionGenerator = (connection) => ({
  label: connection?.formattedData?.screenName ?? 'Unnamed',
  value: connection?.id,
});

const getOption = (options, connectionId) =>
  options.find((connection) => connection.value === connectionId) || undefined;

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
  const editorContext = React.useContext(EditorContext);
  const [showAddConnectionDialog, setShowAddConnectionDialog] =
    React.useState(false);
  const [showAddSharedConnectionDialog, setShowAddSharedConnectionDialog] =
    React.useState(false);
  const queryClient = useQueryClient();

  const { authenticate } = useAuthenticateApp({
    appKey: application.key,
    useShared: true,
  });

  const {
    data,
    isLoading: isAppConnectionsLoading,
    refetch,
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
    const appWithConnections = data?.data;
    const options =
      appWithConnections?.map((connection) => optionGenerator(connection)) ||
      [];

    if (
      !appConfig?.data ||
      (!appConfig.data?.disabled && appConfig.data?.allowCustomConnection)
    ) {
      options.push({
        label: formatMessage('chooseConnectionSubstep.addNewConnection'),
        value: ADD_CONNECTION_VALUE,
      });
    }

    if (appConfig?.data?.connectionAllowed) {
      options.push({
        label: formatMessage('chooseConnectionSubstep.addNewSharedConnection'),
        value: ADD_SHARED_CONNECTION_VALUE,
      });
    }

    return options;
  }, [data, formatMessage, appConfig?.data]);

  const handleClientClick = async (appAuthClientId) => {
    try {
      const response = await authenticate?.({
        appAuthClientId,
      });
      const connectionId = response?.createConnection.id;

      if (connectionId) {
        await refetch();
        onChange({
          step: {
            ...step,
            connection: {
              id: connectionId,
            },
          },
        });
      }
    } catch (err) {
      // void
    } finally {
      setShowAddSharedConnectionDialog(false);
    }
  };

  const { name } = substep;

  const handleAddConnectionClose = React.useCallback(
    async (response) => {
      setShowAddConnectionDialog(false);
      const connectionId = response?.createConnection?.id;
      if (connectionId) {
        await refetch();
        onChange({
          step: {
            ...step,
            connection: {
              id: connectionId,
            },
          },
        });
      }
    },
    [onChange, refetch, step],
  );

  const handleChange = React.useCallback(
    async (event, selectedOption) => {
      if (typeof selectedOption === 'object') {
        // TODO: try to simplify type casting below.
        const typedSelectedOption = selectedOption;
        const option = typedSelectedOption;
        const connectionId = option?.value;

        if (connectionId === ADD_CONNECTION_VALUE) {
          setShowAddConnectionDialog(true);
          return;
        }

        if (connectionId === ADD_SHARED_CONNECTION_VALUE) {
          setShowAddSharedConnectionDialog(true);
          return;
        }

        if (connectionId !== stepConnection?.id) {
          onChange({
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
      }
    },
    [step, onChange, queryClient],
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
      <Collapse in={expanded} timeout="auto" unmountOnExit>
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
            disabled={editorContext.readOnly}
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
        <AppAuthClientsDialog
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
