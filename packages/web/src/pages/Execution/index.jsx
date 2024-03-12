import * as React from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';

import useFormatMessage from 'hooks/useFormatMessage';
import ExecutionHeader from 'components/ExecutionHeader';
import ExecutionStep from 'components/ExecutionStep';
import Container from 'components/Container';
import useExecutionSteps from 'hooks/useExecutionSteps';
import useExecution from 'hooks/useExecution';

export default function Execution() {
  const { executionId } = useParams();
  const formatMessage = useFormatMessage();

  const { data: execution } = useExecution({ executionId });

  const {
    data,
    isLoading: isExecutionStepsLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useExecutionSteps({
    executionId: executionId,
  });

  React.useEffect(() => {
    if (!isFetching && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching, isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <Container sx={{ py: 3 }}>
      <ExecutionHeader execution={execution?.data} />

      <Grid container item sx={{ mt: 2, mb: [2, 5] }} rowGap={3}>
        {!isExecutionStepsLoading && !data?.pages?.[0].data.length && (
          <Alert severity="warning" sx={{ flex: 1 }}>
            <AlertTitle sx={{ fontWeight: 700 }}>
              {formatMessage('execution.noDataTitle')}
            </AlertTitle>

            <Box sx={{ fontWeight: 400 }}>
              {formatMessage('execution.noDataMessage')}
            </Box>
          </Alert>
        )}

        {data?.pages?.map((group, i) => (
          <React.Fragment key={i}>
            {group?.data?.map((executionStep) => (
              <ExecutionStep
                key={executionStep.id}
                executionStep={executionStep}
                step={executionStep.step}
              />
            ))}
          </React.Fragment>
        ))}
      </Grid>
    </Container>
  );
}
