import PropTypes from 'prop-types';
import * as React from 'react';
import { DateTime } from 'luxon';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useFormatMessage from 'hooks/useFormatMessage';
import { ExecutionPropType } from 'propTypes/propTypes';

function ExecutionName(props) {
  return (
    <Typography variant="h3" gutterBottom>
      {props.name}
    </Typography>
  );
}

ExecutionName.propTypes = {
  name: PropTypes.string.isRequired,
};

function ExecutionId(props) {
  const formatMessage = useFormatMessage();
  const id = (
    <Typography variant="body1" component="span">
      {props.id}
    </Typography>
  );
  return (
    <Box sx={{ display: 'flex' }}>
      <Typography variant="body2">
        {formatMessage('execution.id', { id })}
      </Typography>
    </Box>
  );
}

ExecutionId.propTypes = {
  id: PropTypes.string.isRequired,
};

function ExecutionDate(props) {
  const createdAt = DateTime.fromMillis(parseInt(props.createdAt, 10));
  const relativeCreatedAt = createdAt.toRelative();
  return (
    <Tooltip
      title={createdAt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
    >
      <Typography variant="body1" gutterBottom>
        {relativeCreatedAt}
      </Typography>
    </Tooltip>
  );
}

ExecutionDate.propTypes = {
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};

function ExecutionHeader(props) {
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

ExecutionHeader.propTypes = {
  execution: ExecutionPropType,
};

export default ExecutionHeader;
