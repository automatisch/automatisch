import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, useSearchParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';

import NoResultFound from 'components/NoResultFound';
import SearchableJSONViewer from 'components/SearchableJSONViewer';
import AppIcon from 'components/AppIcon';
import useFormatMessage from 'hooks/useFormatMessage';
import objectifyUrlSearchParams from 'helpers/objectifyUrlSearchParams';
import useMcpToolExecutions from 'hooks/useMcpToolExecutions.ee';
import useActions from 'hooks/useActions';
import useMcpTools from 'hooks/useMcpTools.ee';
import useApp from 'hooks/useApp';

function ExecutionCard({ execution, mcpServerId }) {
  const formatMessage = useFormatMessage();
  const [expanded, setExpanded] = React.useState(false);

  const { data: mcpTools } = useMcpTools(mcpServerId);
  const mcpTool = mcpTools?.data?.find(
    (tool) => tool.id === execution.mcpToolId,
  );
  const { data: app } = useApp(mcpTool?.appKey);
  const { data: actions } = useActions(mcpTool?.appKey);

  const actionData =
    mcpTool?.type === 'app' &&
    actions?.data?.find((a) => a.key === mcpTool.action);
  const actionDisplayName =
    mcpTool?.type === 'app'
      ? actionData?.name || mcpTool?.action || 'Unknown Action'
      : 'Flow Tool';

  const createdAt = DateTime.fromMillis(parseInt(execution.createdAt, 10));
  const relativeCreatedAt = createdAt.toRelative();
  const appData = app?.data;

  const statusIcon =
    execution.status === 'success' ? (
      <CheckCircleIcon color="success" />
    ) : (
      <ErrorIcon color="error" />
    );

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const hasData =
    execution.dataIn || execution.dataOut || execution.errorDetails;

  return (
    <Paper elevation={1} sx={{ mb: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          p: 3,
          cursor: hasData ? 'pointer' : 'default',
          '&:hover': hasData ? { bgcolor: 'action.hover' } : {},
        }}
        onClick={hasData ? handleToggleExpand : undefined}
      >
        <Stack direction="row" gap={3} alignItems="center">
          <Box
            sx={{
              display: 'inline-flex',
              position: 'relative',
            }}
          >
            {mcpTool?.type === 'app' ? (
              <AppIcon
                url={appData?.iconUrl}
                color={appData?.primaryColor}
                name={appData?.name || mcpTool?.appKey}
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
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                transform: 'translate(50%, -50%)',
                lineHeight: 0.75,
                bgcolor: 'white',
                borderRadius: '50%',
                overflow: 'hidden',
              }}
            >
              {statusIcon}
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h3">
              {actionDisplayName}
            </Typography>
            <Tooltip
              title={createdAt.toLocaleString(
                DateTime.DATETIME_FULL_WITH_SECONDS,
              )}
            >
              <Typography variant="caption" color="text.secondary">
                {formatMessage('executionStep.executedAt', {
                  datetime: relativeCreatedAt,
                })}
              </Typography>
            </Tooltip>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={execution.status === 'success' ? 'Success' : 'Error'}
              size="small"
              color={execution.status === 'success' ? 'success' : 'error'}
            />
            {hasData && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand();
                }}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>
        </Stack>
      </Box>

      {hasData && (
        <Collapse in={expanded}>
          <Box>
            {execution.dataIn && (
              <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={0}>
                    <Tab
                      label={formatMessage('mcpServerExecutions.inputData')}
                    />
                  </Tabs>
                </Box>
                <Box sx={{ px: 2, py: 3 }}>
                  <SearchableJSONViewer data={execution.dataIn} />
                </Box>
              </Box>
            )}

            {execution.dataOut && (
              <Box
                sx={{
                  borderTop: execution.dataIn ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={0}>
                    <Tab
                      label={formatMessage('mcpServerExecutions.outputData')}
                    />
                  </Tabs>
                </Box>
                <Box sx={{ px: 2, py: 3 }}>
                  <SearchableJSONViewer data={execution.dataOut} />
                </Box>
              </Box>
            )}

            {execution.errorDetails && (
              <Box
                sx={{
                  borderTop: execution.dataIn || execution.dataOut ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={0}>
                    <Tab
                      label={formatMessage('mcpServerExecutions.errorDetails')}
                    />
                  </Tabs>
                </Box>
                <Box sx={{ px: 2, py: 3 }}>
                  <SearchableJSONViewer data={execution.errorDetails} />
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      )}
    </Paper>
  );
}

ExecutionCard.propTypes = {
  execution: PropTypes.object.isRequired,
  mcpServerId: PropTypes.string.isRequired,
};

export default function McpServerExecutions({ mcpServerId }) {
  const formatMessage = useFormatMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const { data, isLoading } = useMcpToolExecutions(mcpServerId, page);

  const executions = data?.data || [];
  const pageInfo = data?.meta || {};
  const hasExecutions = executions.length > 0;

  const getPathWithSearchParams = (page) => {
    const searchParamsObject = objectifyUrlSearchParams(searchParams);
    const newSearchParams = new URLSearchParams(searchParamsObject);

    if (page === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', page.toString());
    }

    const query = newSearchParams.toString();
    return query ? `?${query}` : '';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {!hasExecutions && (
        <NoResultFound
          text={formatMessage('mcpServerExecutions.noExecutions')}
        />
      )}

      {hasExecutions && (
        <Box>
          {executions.map((execution) => (
            <ExecutionCard
              key={execution.id}
              execution={execution}
              mcpServerId={mcpServerId}
            />
          ))}
        </Box>
      )}

      {pageInfo && pageInfo.totalPages > 1 && (
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
          page={pageInfo?.currentPage}
          count={pageInfo?.totalPages}
          onChange={(event, page) => {
            const newParams = new URLSearchParams(searchParams);
            if (page === 1) {
              newParams.delete('page');
            } else {
              newParams.set('page', page.toString());
            }
            setSearchParams(newParams);
          }}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={getPathWithSearchParams(item.page)}
              {...item}
            />
          )}
        />
      )}
    </Box>
  );
}

McpServerExecutions.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
};
