import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';

import NoResultFound from 'components/NoResultFound';
import AppIcon from 'components/AppIcon';
import FlowAppIcons from 'components/FlowAppIcons';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useFormatMessage from 'hooks/useFormatMessage';
import useAgentTools from 'hooks/useAgentTools.ee';
import useDeleteAgentTool from 'hooks/useDeleteAgentTool.ee';
import useApp from 'hooks/useApp';
import useActions from 'hooks/useActions';
import useFlow from 'hooks/useFlow';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import { getGeneralErrorMessage } from 'helpers/errors';

function AgentToolCard({ tool, agentId }) {
  const formatMessage = useFormatMessage();
  const { data: app } = useApp(tool.appKey);
  const { data: actions } = useActions(tool.appKey);
  const { data: flow } = useFlow(tool.flowId);
  const appData = app?.data;
  const actionsData = actions?.data || [];
  const flowData = flow?.data;
  const enqueueSnackbar = useEnqueueSnackbar();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const {
    mutateAsync: deleteAgentTool,
    error: deleteAgentToolError,
    isPending,
    reset: resetDeleteAgentTool,
  } = useDeleteAgentTool(agentId);

  const getActionNames = () => {
    if (!tool.actions || tool.actions.length === 0) return [];

    return tool.actions
      .map((actionKey) => {
        const action = actionsData.find((a) => a.key === actionKey);
        return action?.name || actionKey;
      })
      .filter(Boolean);
  };

  const actionNames = getActionNames();

  const handleDelete = React.useCallback(async () => {
    try {
      await deleteAgentTool(tool.id);
      enqueueSnackbar('Tool deleted successfully', {
        variant: 'success',
      });
    } catch (error) {
      const errorMessage = getGeneralErrorMessage(error);
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        persist: true,
      });
    }
    setShowConfirmation(false);
  }, [deleteAgentTool, tool.id, enqueueSnackbar]);

  const handleConfirmationClose = React.useCallback(() => {
    if (deleteAgentToolError) {
      resetDeleteAgentTool();
    }
    setShowConfirmation(false);
  }, [deleteAgentToolError, resetDeleteAgentTool]);

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={2}>
              {tool.type === 'app' && appData ? (
                <>
                  <AppIcon url={appData.iconUrl} name={appData.name} />
                  <Box>
                    <Typography variant="h6">{appData.name}</Typography>
                    {actionNames.length > 0 && (
                      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                        {actionNames.map((actionName, index) => (
                          <Chip
                            key={index}
                            label={actionName}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </>
              ) : tool.type === 'flow' && flowData ? (
                <>
                  <SwapCallsIcon />
                  <Box>
                    <Typography variant="h6">{flowData.name}</Typography>
                    <FlowAppIcons flow={flowData} />
                  </Box>
                </>
              ) : (
                <Box>
                  <Typography variant="h6">Unknown Tool</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {tool.type}
                  </Typography>
                </Box>
              )}
            </Box>

            <IconButton
              onClick={() => setShowConfirmation(true)}
              color="error"
              disabled={isPending}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showConfirmation}
        title={formatMessage('agentTools.deleteDialogTitle')}
        description={formatMessage('agentTools.deleteDialogDescription')}
        onClose={handleConfirmationClose}
        onConfirm={handleDelete}
        cancelButtonChildren={formatMessage('agentTools.deleteDialogCancel')}
        confirmButtonChildren={formatMessage('agentTools.deleteDialogConfirm')}
      />
    </>
  );
}

AgentToolCard.propTypes = {
  tool: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    appKey: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.string),
    flowId: PropTypes.string,
  }).isRequired,
  agentId: PropTypes.string.isRequired,
};

export default function AgentTools({ agentId }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAgentTools(agentId);

  const tools = data?.data || [];
  const hasTools = tools.length > 0;

  return (
    <Box>
      {isLoading && (
        <CircularProgress
          data-test="agent-tools-loader"
          sx={{ display: 'block', margin: '20px auto' }}
        />
      )}

      {!isLoading && !hasTools && (
        <NoResultFound text={formatMessage('agent.noTools')} />
      )}

      {!isLoading &&
        tools.map((tool) => (
          <AgentToolCard key={tool.id} tool={tool} agentId={agentId} />
        ))}
    </Box>
  );
}

AgentTools.propTypes = {
  agentId: PropTypes.string.isRequired,
};
