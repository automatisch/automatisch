import * as React from 'react';
import { DateTime } from 'luxon';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { IExecution } from '@automatisch/types';

type ExecutionHeaderProps = {
  execution: IExecution;
};

function ExecutionName(props: Pick<IExecution['flow'], 'name'>) {
  return (
    <Typography variant="h3" gutterBottom>
      {props.name}
    </Typography>
  );
}

function ExecutionId(props: Pick<IExecution, 'id'>) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Typography variant="body2">
        Execution ID:{' '}
        <Typography variant="body1" component="span">
          {props.id}
        </Typography>
      </Typography>
    </Box>
  );
}

function ExecutionDate(props: Pick<IExecution, 'createdAt'>) {
  const createdAt = DateTime.fromMillis(parseInt(props.createdAt, 10));
  const relativeCreatedAt = createdAt.toRelative();

  return (
    <Tooltip title={createdAt.toLocaleString(DateTime.DATE_MED)}>
      <Typography variant="body1" gutterBottom>
        {relativeCreatedAt}
      </Typography>
    </Tooltip>
  );
}

export default function ExecutionHeader(
  props: ExecutionHeaderProps
): React.ReactElement {
  const { execution } = props;

  if (!execution) return <React.Fragment />;

  return (
    <Stack direction="column">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
      >
        <ExecutionDate createdAt={execution.createdAt} />
        <ExecutionId id={execution.id} />
      </Stack>

      <Stack direction="row">
        <ExecutionName name={execution.flow.name} />
      </Stack>
    </Stack>
  );
}
