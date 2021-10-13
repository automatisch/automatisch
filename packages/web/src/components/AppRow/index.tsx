import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import AppIcon from 'components/AppIcon';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import { Link } from 'react-router-dom';
import type { App } from 'types/app';

import { CardContent, DesktopOnlyBreakline,Typography } from './style';

type AppRowProps = {
  application: App;
}

const countTranslation = (value: React.ReactNode) => (<><strong>{value}</strong><DesktopOnlyBreakline /></>);

function AppRow(props: AppRowProps) {
  const formatMessage = useFormatMessage();
  const { name, primaryColor, iconUrl } = props.application;

  return (
    <Link to={URLS.APP(name.toLowerCase())}>
      <Card sx={{ my: 2 }}>
        <CardActionArea>
        <CardContent>
            <Box>
              <AppIcon name={name} url={iconUrl} color={primaryColor} />
            </Box>

            <Box>
              <Typography variant="h6">
                {name}
              </Typography>
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography variant="body2">
                {formatMessage('app.connectionCount', { count: countTranslation(Math.round(Math.random() * 100)) })}
              </Typography>
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography variant="body2">
                {formatMessage('app.flowCount', { count: countTranslation(Math.round(Math.random() * 100)) })}
              </Typography>
            </Box>

            <Box>
              <ChevronRightIcon />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default AppRow;
