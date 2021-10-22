import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import { CardContent, Typography } from './style';

type AppFlowRowProps = {
  selected?: boolean;
  flow: any;
}

const countTranslation = (value: React.ReactNode) => (<><strong>{value}</strong><br /></>);

function AppFlowRow(props: AppFlowRowProps) {
  const formatMessage = useFormatMessage();

  return (
    <>
      <Card sx={{ my: 2 }}>
        <CardActionArea component={Link} to={URLS.FLOW('dummy')}>
          <CardContent>
            <Box>
              <Typography variant="h6">
                A flow
              </Typography>
            </Box>

            <Box>

            </Box>

            <Box sx={{ px: 2 }}>
              <Typography variant="body2">
                {formatMessage('connection.flowCount', { count: countTranslation(0) })}
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
