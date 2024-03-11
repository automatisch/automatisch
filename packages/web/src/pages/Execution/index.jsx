import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';

import useFormatMessage from 'hooks/useFormatMessage';
import ExecutionHeader from 'components/ExecutionHeader';
import ExecutionStep from 'components/ExecutionStep';
import Container from 'components/Container';
import { GET_EXECUTION } from 'graphql/queries/get-execution';
import useExecutionSteps from 'hooks/useExecutionSteps';

export default function Execution() {
  const { executionId } = useParams();
  const formatMessage = useFormatMessage();

  const { data: execution } = useQuery(GET_EXECUTION, {
    variables: { executionId },
  });

  const { data, isLoading: isExecutionLoading } = useExecutionSteps(
    executionId,
    1,
  );

  const executionSteps = data?.data;

  return (
    <Container sx={{ py: 3 }}>
      <ExecutionHeader execution={execution?.getExecution} />

      <Grid container item sx={{ mt: 2, mb: [2, 5] }} rowGap={3}>
        {!isExecutionLoading && !executionSteps?.length && (
          <Alert severity="warning" sx={{ flex: 1 }}>
            <AlertTitle sx={{ fontWeight: 700 }}>
              {formatMessage('execution.noDataTitle')}
            </AlertTitle>

            <Box sx={{ fontWeight: 400 }}>
              {formatMessage('execution.noDataMessage')}
            </Box>
          </Alert>
        )}

        {executionSteps?.map((executionStep) => (
          <ExecutionStep
            key={executionStep.id}
            executionStep={executionStep}
            step={executionStep.step}
          />
        ))}
      </Grid>
    </Container>
  );
}
