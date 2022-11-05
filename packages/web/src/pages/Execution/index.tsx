import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import type { IExecutionStep } from '@automatisch/types';

import useFormatMessage from 'hooks/useFormatMessage';
import ExecutionHeader from 'components/ExecutionHeader';
import ExecutionStep from 'components/ExecutionStep';
import Container from 'components/Container';
import { GET_EXECUTION } from 'graphql/queries/get-execution';
import { GET_EXECUTION_STEPS } from 'graphql/queries/get-execution-steps';

type ExecutionParams = {
  executionId: string;
};

const EXECUTION_PER_PAGE = 100;

const getLimitAndOffset = (page: number) => ({
  limit: EXECUTION_PER_PAGE,
  offset: (page - 1) * EXECUTION_PER_PAGE,
});

export default function Execution(): React.ReactElement {
  const { executionId } = useParams() as ExecutionParams;
  const formatMessage = useFormatMessage();
  const { data: execution } = useQuery(GET_EXECUTION, {
    variables: { executionId },
  });
  const { data, loading } = useQuery(GET_EXECUTION_STEPS, {
    variables: { executionId, ...getLimitAndOffset(1) },
  });

  const { edges } = data?.getExecutionSteps || {};
  const executionSteps: IExecutionStep[] = edges?.map(
    (edge: { node: IExecutionStep }) => edge.node
  );

  return (
    <Container sx={{ py: 3 }}>
      <ExecutionHeader execution={execution?.getExecution} />

      <Grid container item sx={{ mt: 2, mb: [2, 5] }} rowGap={3}>
        {!loading && !executionSteps?.length && (
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
