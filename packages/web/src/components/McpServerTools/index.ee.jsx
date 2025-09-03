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
import useMcpTools from 'hooks/useMcpTools.ee';
import useDeleteMcpTool from 'hooks/useDeleteMcpTool.ee';
import useApp from 'hooks/useApp';
import useFlow from 'hooks/useFlow';
import useActions from 'hooks/useActions';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import { getGeneralErrorMessage } from 'helpers/errors';

function McpToolCard({ tool, mcpServerId }) {
  const { data: app } = useApp(tool.appKey);
  const { data: flow } = useFlow(tool.flowId);
  const { data: actions } = useActions(tool.appKey);
  const appData = app?.data;
  const flowData = flow?.data;
  const formatMessage = useFormatMessage();

  const actionData =
    tool.type === 'app' && actions?.data?.find((a) => a.key === tool.action);
  const actionDisplayName = actionData?.name || tool.action;
  const enqueueSnackbar = useEnqueueSnackbar();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const {
    mutateAsync: deleteMcpTool,
    error: deleteMcpToolError,
    isPending,
    reset: resetDeleteMcpTool,
  } = useDeleteMcpTool(mcpServerId);

  const generalErrorMessage = getGeneralErrorMessage({
    error: deleteMcpToolError,
    fallbackMessage: formatMessage('mcpTool.deleteError'),
  });

  const handleConfirm = React.useCallback(async () => {
    try {
      await deleteMcpTool(tool.id);
      setShowConfirmation(false);
      enqueueSnackbar(formatMessage('mcpTool.successfullyDeleted'), {
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
    }
  }, [deleteMcpTool, tool.id, enqueueSnackbar, formatMessage]);

  const handleClose = () => {
    setShowConfirmation(false);
    resetDeleteMcpTool();
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            {tool.type === 'app' ? (
              <AppIcon
                url={appData?.iconUrl}
                color={appData?.primaryColor}
                name={appData?.name || tool.appKey}
              />
            ) : (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SwapCallsIcon color="primary" sx={{ fontSize: 32 }} />
              </Box>
            )}
            <Typography variant="h6" component="h3">
              {tool.type === 'app'
                ? appData?.name || tool.appKey
                : flowData?.name || 'Flow Tool'}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={tool.type}
              size="small"
              color={tool.type === 'app' ? 'primary' : 'secondary'}
            />
            <IconButton
              onClick={() => setShowConfirmation(true)}
              disabled={isPending}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {tool.type === 'app' && tool.action && (
          <Typography variant="body2" color="text.secondary">
            {actionDisplayName}
          </Typography>
        )}

        {tool.type === 'flow' && flowData && flowData.steps && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlowAppIcons steps={flowData.steps} />
          </Box>
        )}
      </CardContent>

      <ConfirmationDialog
        open={showConfirmation}
        title={formatMessage('mcpTool.deleteConfirmation.title')}
        description={formatMessage('mcpTool.deleteConfirmation.description')}
        onClose={handleClose}
        onConfirm={handleConfirm}
        cancelButtonChildren={formatMessage(
          'mcpTool.deleteConfirmation.cancelText',
        )}
        confirmButtonChildren={formatMessage(
          'mcpTool.deleteConfirmation.confirmText',
        )}
        errorMessage={generalErrorMessage}
      />
    </Card>
  );
}

McpToolCard.propTypes = {
  tool: PropTypes.object.isRequired,
  mcpServerId: PropTypes.string.isRequired,
};

export default function McpServerTools({ mcpServerId }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useMcpTools(mcpServerId);

  const tools = data?.data || [];
  const hasTools = tools.length > 0;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {!hasTools && (
        <NoResultFound text={formatMessage('mcpServerTools.noTools')} />
      )}

      {hasTools && (
        <Box>
          {tools.map((tool) => (
            <McpToolCard key={tool.id} tool={tool} mcpServerId={mcpServerId} />
          ))}
        </Box>
      )}
    </Box>
  );
}

McpServerTools.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
};
