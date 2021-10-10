import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import useFormatMessage from 'hooks/useFormatMessage';
import AppIcon from 'components/AppIcon';
import * as URLS from 'config/urls';
import type { App } from 'types/app';
import { CardContent, Typography, DesktopOnlyBreakline } from './style';

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
