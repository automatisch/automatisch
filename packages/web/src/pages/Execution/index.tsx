import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import type { IExecutionStep } from '@automatisch/types';

import ExecutionStep from 'components/ExecutionStep';
import Container from 'components/Container';
import { GET_EXECUTION_STEPS } from 'graphql/queries/get-execution-steps';

type ExecutionParams = {
  executionId: string;
};

const EXECUTION_PER_PAGE = 5;

const getLimitAndOffset = (page: number) => ({
  limit: EXECUTION_PER_PAGE,
  offset: (page - 1) * EXECUTION_PER_PAGE,
});

export default function Execution(): React.ReactElement {
  const { executionId } = useParams() as ExecutionParams;
  const { data, fetchMore } = useQuery(GET_EXECUTION_STEPS, { variables: { executionId, ...getLimitAndOffset(1) } });

  const { edges, pageInfo } = data?.getExecutionSteps || {};
  const executionSteps: IExecutionStep[] = edges?.map((edge: { node: IExecutionStep }) => edge.node);

  React.useEffect(() => {
    if (pageInfo?.currentPage < pageInfo?.totalPages) {
      fetchMore({
        variables: {
          executionId,
          ...getLimitAndOffset(pageInfo.currentPage + 1),
        }
      });
    }
  }, [executionId, fetchMore, pageInfo]);

  return (
    <Container sx={{ py: 3 }}>
      <Grid container item sx={{ mb: [2, 5] }} rowGap={3}>
        {executionSteps?.map((executionStep) => (
          <ExecutionStep key={executionStep.id} executionStep={executionStep} step={executionStep.step} />
        ))}
      </Grid>
    </Container>
  );
};
