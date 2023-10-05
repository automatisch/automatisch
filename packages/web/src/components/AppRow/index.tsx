import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import useFormatMessage from 'hooks/useFormatMessage';
import AppIcon from 'components/AppIcon';
import type { IApp } from '@automatisch/types';

import { CardContent, Typography } from './style';

type AppRowProps = {
  application: IApp;
  url: string;
};

const countTranslation = (value: React.ReactNode) => (
  <>
    <Typography variant="body1">{value}</Typography>
    <br />
  </>
);

function AppRow(props: AppRowProps): React.ReactElement {
  const formatMessage = useFormatMessage();
  const { name, primaryColor, iconUrl, connectionCount, flowCount } =
    props.application;

  return (
    <Link to={props.url} data-test="app-row">
      <Card sx={{ mb: 1 }}>
        <CardActionArea>
          <CardContent>
            <Box>
              <AppIcon name={name} url={iconUrl} color={primaryColor} />
            </Box>

            <Box>
              <Typography variant="h6">{name}</Typography>
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: ['none', 'inline-block'] }}
              >
                {formatMessage('app.connectionCount', {
                  count: countTranslation(connectionCount || '-'),
                })}
              </Typography>
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: ['none', 'inline-block'] }}
              >
                {formatMessage('app.flowCount', {
                  count: countTranslation(flowCount || '-'),
                })}
              </Typography>
            </Box>

            <Box>
              <ArrowForwardIosIcon
                sx={{ color: (theme) => theme.palette.primary.main }}
              />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default AppRow;
