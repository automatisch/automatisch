import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import * as URLS from 'config/urls';
import { CardContent, Typography } from './style';

type AppFlowRowProps = {
  flow: any;
}

function AppFlowRow(props: AppFlowRowProps): React.ReactElement {
  const { flow } = props;

  return (
    <>
      <Card sx={{ my: 2 }}>
        <CardActionArea component={Link} to={URLS.FLOW(flow.id)}>
          <CardContent>
            <Box>
              <Typography variant="h6" noWrap>
                {flow.name}
              </Typography>
            </Box>

            <Box>
              <MoreHorizIcon />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default AppFlowRow;
