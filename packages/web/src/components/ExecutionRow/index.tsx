import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DateTime } from 'luxon';

import type { IExecution } from '@automatisch/types';
import * as URLS from 'config/urls';
import { CardContent, Typography } from './style';

type ExecutionRowProps = {
  execution: IExecution;
}

const getHumanlyDate = (timestamp: number) => DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATETIME_MED);

export default function ExecutionRow(props: ExecutionRowProps): React.ReactElement {
  const { execution } = props;
  const { flow } = execution;

  return (
    <Link to={URLS.FLOW(flow.id.toString())}>
      <Card sx={{ mb: 1 }}>
        <CardActionArea>
          <CardContent>
            <Box
              display="flex"
              flex={1}
              flexDirection="column"
            >
              <Typography variant="h6" noWrap>
                {flow.name}
              </Typography>

              <Typography variant="subtitle1" noWrap>
                {getHumanlyDate(parseInt(execution.createdAt, 10))}
              </Typography>
            </Box>

            <Box>
              <ArrowForwardIosIcon sx={{ color: (theme) => theme.palette.primary.main }} />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
