import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DateTime } from 'luxon';

import NoResultFound from 'components/NoResultFound';
import useFormatMessage from 'hooks/useFormatMessage';
import useAgentExecutions from 'hooks/useAgentExecutions.ee';
import * as URLS from 'config/urls';

function AgentExecutionRow({ execution, agentId }) {
  const formatMessage = useFormatMessage();
  const createdAt = DateTime.fromMillis(parseInt(execution.createdAt, 10));
  const finishedAt = execution.finishedAt
    ? DateTime.fromMillis(parseInt(execution.finishedAt, 10))
    : null;
  const relativeCreatedAt = createdAt.toRelative();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'running':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Link
      to={URLS.AGENT_EXECUTION(agentId, execution.id)}
      data-test="agent-execution-row"
      style={{ textDecoration: 'none' }}
    >
      <Card sx={{ mb: 1 }}>
        <CardActionArea>
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" noWrap sx={{ mb: 1 }}>
                {execution.prompt || 'No prompt available'}
              </Typography>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <Chip
                  size="small"
                  label={execution.status}
                  color={getStatusColor(execution.status)}
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary">
                  {formatMessage('agentExecution.createdAt', {
                    datetime: relativeCreatedAt,
                  })}
                </Typography>
                {finishedAt && (
                  <Typography variant="caption" color="text.secondary">
                    •{' '}
                    {formatMessage('agentExecution.finishedAt', {
                      datetime: finishedAt.toRelative(),
                    })}
                  </Typography>
                )}
              </Box>
            </Box>

            <ArrowForwardIosIcon color="action" fontSize="small" />
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

AgentExecutionRow.propTypes = {
  execution: PropTypes.shape({
    id: PropTypes.string.isRequired,
    prompt: PropTypes.string,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    finishedAt: PropTypes.string,
  }).isRequired,
  agentId: PropTypes.string.isRequired,
};

export default function AgentExecutions({ agentId }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAgentExecutions(agentId, {
    refetchInterval: 5000,
  });

  const executions = data?.data || [];
  const hasExecutions = executions?.length > 0;

  return (
    <Box>
      {isLoading && (
        <CircularProgress
          data-test="agent-executions-loader"
          sx={{ display: 'block', margin: '20px auto' }}
        />
      )}

      {!isLoading && !hasExecutions && (
        <NoResultFound text={formatMessage('agent.noExecutions')} />
      )}

      {!isLoading && hasExecutions && (
        <Box>
          {executions.map((execution) => (
            <AgentExecutionRow
              key={execution.id}
              execution={execution}
              agentId={agentId}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

AgentExecutions.propTypes = {
  agentId: PropTypes.string.isRequired,
};
