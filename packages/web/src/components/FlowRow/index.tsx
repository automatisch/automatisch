import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import type { Flow } from 'types/flow';
import * as URLS from 'config/urls';
import { CardContent, Typography } from './style';

type FlowRowProps = {
  flow: Flow;
}

export default function FlowRow(props: FlowRowProps): React.ReactElement {
  const { flow } = props;

  return (
    <Link to={URLS.FLOW(flow.id.toString())}>
      <Card sx={{ mb: 1 }}>
        <CardActionArea>
          <CardContent>
            <Box>
              <Typography variant="h6" noWrap>
                {flow.name}
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