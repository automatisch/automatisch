import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DateTime } from 'luxon';

import useFormatMessage from 'hooks/useFormatMessage';
import useAgentExecution from 'hooks/useAgentExecution.ee';
import * as URLS from 'config/urls';

function ExecutionDetailCard({ title, children, ...props }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, ...props.sx }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

ExecutionDetailCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};

export default function AgentExecutionDetail() {
  const { agentId, executionId } = useParams();
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAgentExecution(agentId, executionId);

  const execution = data?.data;

  if (isLoading) {
    return (
      <Box sx={{ py: 3 }}>
        <CircularProgress
          data-test="agent-execution-detail-loader"
          sx={{ display: 'block', margin: '20px auto' }}
        />
      </Box>
    );
  }

  if (!execution) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="h6" color="error">
          Execution not found
        </Typography>
      </Box>
    );
  }

  const createdAt = DateTime.fromMillis(parseInt(execution.createdAt, 10));
  const finishedAt = execution.finishedAt
    ? DateTime.fromMillis(parseInt(execution.finishedAt, 10))
    : null;

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
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          to={URLS.AGENT_EXECUTIONS(agentId)}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          {formatMessage('agentExecution.backToExecutions')}
        </Button>

        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <span>Agent Execution Detail</span>
          <Chip
            label={execution.status}
            color={getStatusColor(execution.status)}
            variant="outlined"
          />
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {formatMessage('agentExecution.createdAt', {
              datetime: createdAt.toLocaleString(DateTime.DATETIME_FULL),
            })}
          </Typography>
          {finishedAt && (
            <Typography variant="body1" color="text.secondary">
              •{' '}
              {formatMessage('agentExecution.finishedAt', {
                datetime: finishedAt.toLocaleString(DateTime.DATETIME_FULL),
              })}
            </Typography>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ExecutionDetailCard title={formatMessage('agentExecution.prompt')}>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                backgroundColor: 'grey.50',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.300',
              }}
            >
              {execution.prompt || 'No prompt available'}
            </Typography>
          </ExecutionDetailCard>
        </Grid>

        {execution.output && (
          <Grid item xs={12}>
            <ExecutionDetailCard title={formatMessage('agentExecution.output')}>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  backgroundColor: 'grey.50',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                }}
              >
                {execution.output}
              </Typography>
            </ExecutionDetailCard>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <ExecutionDetailCard title="Execution Details">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700 }}
                  color="text.secondary"
                >
                  Execution ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {execution.id}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700 }}
                  color="text.secondary"
                >
                  Agent ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {execution.agentId}
                </Typography>
              </Box>
            </Box>
          </ExecutionDetailCard>
        </Grid>
      </Grid>
    </Box>
  );
}
