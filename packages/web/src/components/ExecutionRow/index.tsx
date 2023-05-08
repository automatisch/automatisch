import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DateTime } from 'luxon';
import type { IExecution } from '@automatisch/types';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import FlowAppIcons from 'components/FlowAppIcons';
import { Apps, CardContent, ArrowContainer, Title, Typography } from './style';

type ExecutionRowProps = {
  execution: IExecution;
};

export default function ExecutionRow(
  props: ExecutionRowProps
): React.ReactElement {
  const formatMessage = useFormatMessage();
  const { execution } = props;
  const { flow } = execution;

  const updatedAt = DateTime.fromMillis(parseInt(execution.updatedAt, 10));
  const relativeUpdatedAt = updatedAt.toRelative();

  return (
    <Link to={URLS.EXECUTION(execution.id)} data-test="execution-row">
      <Card sx={{ mb: 1 }}>
        <CardActionArea>
          <CardContent>
            <Apps direction="row" gap={1} sx={{ gridArea: 'apps' }}>
              <FlowAppIcons steps={flow.steps} />
            </Apps>

            <Title justifyContent="center" alignItems="flex-start" spacing={1}>
              <Typography variant="h6" noWrap>
                {flow.name}
              </Typography>

              <Typography variant="caption" noWrap>
                {formatMessage('execution.updatedAt', {
                  datetime: relativeUpdatedAt,
                })}
              </Typography>
            </Title>

            <ArrowContainer>
              {execution.testRun && (
                <Chip
                  size="small"
                  color="warning"
                  variant="outlined"
                  label={formatMessage('execution.test')}
                />
              )}

              <Chip
                size="small"
                color={execution.status === 'success' ? 'success' : 'error'}
                label={formatMessage(
                  execution.status === 'success'
                    ? 'execution.statusSuccess'
                    : 'execution.statusFailure'
                )}
              />

              <ArrowForwardIosIcon
                sx={{ color: (theme) => theme.palette.primary.main }}
              />
            </ArrowContainer>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
